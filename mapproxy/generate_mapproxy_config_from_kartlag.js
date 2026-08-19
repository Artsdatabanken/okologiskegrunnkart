/**
 * Generates MapProxy configuration from kartlag.json.
 *
 * This script reads the layer catalog from `kartlag.json`, validates that each
 * configured WMS layer is actually advertised by its source service, and then
 * writes two output files:
 *
 * - `seed.yaml`: MapProxy seed definitions for the lowest configured zoom level
 *   of each layer.
 * - `mapproxy.yaml`: MapProxy layer, cache, source, grid, and service
 *   definitions.
 *
 * The script is intentionally conservative: if a WMS source or layer cannot be
 * verified through GetCapabilities, it is skipped so that invalid MapProxy
 * configuration is not generated.
 *
 * Optional debug flags:
 * - DEBUG_WMS=1: log WMS validation and GetCapabilities activity
 * - DEBUG_WMS_LAYERS=1: also log all advertised layers when a match is missing
 */

const fs = require("fs");
const http = require("http");
const https = require("https");
const { XMLParser } = require("fast-xml-parser");
// Layer-specific MapProxy request overrides.
//
// Some upstream WMS services require custom request parameters in order to
// return tiles correctly. The key is the generated internal layer id.
const special_options = {
  Arterrdlista_NTNrtruet: "styles: simple" // Don't know why this was necessary. TODO: Check mapserver config?
};

// Optional seed coverage overrides per generated layer id.
//
// Restricting seed coverage reduces work for layers that only need tiles inside
// a known geographic extent. Layers not listed here fall back to `alt`, which
// covers the broader default bounding box.
//
// TODO: Maybe map this information from WMS capabilities and add to kartlag.json
// NOTE: This list is incomplete. Only layers that had a high enough minimum
// zoom to benefit from the performance gain from smaller bounds have been listed.
const coverage = {
  ArealressursAR5_ArealressursAR5Arealtype: "norge",
  ArealressursAR5_Treslag: "norge",
  ArealressursAR5_Jordbruksareal: "norge",
  ElvenettElvis_Elvenett: "norge_og_svalbard",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge",
  Forurensetgrunn_Forurensetomrdetilstand: "norge_og_svalbard",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge_og_svalbard",
  Kulturminnerlokaliteter_Kulturminnerlokaliteter: "norge_og_svalbard",
  Vannkraftutbygd_Dam: "norge",
  Livsmiljer_Dekningskartdetalj: "norge"
};

/**
 * Normalizes a WMS URL so it can be reused safely for validation and requests.
 *
 * The source data may already contain a `request` parameter. We remove it here
 * so the same base URL can be used both for GetCapabilities requests and as the
 * MapProxy source URL.
 *
 * @param {string} url - Original WMS URL from kartlag.json.
 * @returns {string} Normalized WMS base URL.
 */
const getBaseWmsUrl = url => {
  url = new URL(url);
  for (var item of url.searchParams) {
    const key = item[0];
    if (key.toLowerCase() === "request") url.searchParams.delete(key);
  }
  return url.toString();
};

/**
 * Builds a filesystem- and YAML-friendly identifier fragment.
 *
 * @param {string} s - Text to sanitize.
 * @returns {string} Input with non-alphanumeric characters removed.
 */
const alphaNumericOnly = s => s.replace(/[^a-zA-Z0-9]/g, "");
const DEBUG_WMS = process.env.DEBUG_WMS === "1";
const DEBUG_WMS_LAYERS = process.env.DEBUG_WMS_LAYERS === "1";

// Active output stream. This switches between `seed.yaml` and `mapproxy.yaml`
// while the script runs.
let logger;

// Final flattened layer list derived from kartlag.json.
let kartlag;

// Cache GetCapabilities lookups per base URL so multiple layers from the same
// service do not trigger repeated network requests.
const capabilitiesCache = new Map();

main().catch(err => {
  console.error("Failed to generate MapProxy configuration", err);
  process.exit(1);
});

/**
 * Main entry point.
 *
 * Workflow:
 * 1. Read and flatten layers from kartlag.json.
 * 2. Validate each WMS layer against GetCapabilities.
 * 3. Remove duplicates by generated layer id.
 * 4. Sort layers for stable output.
 * 5. Generate `seed.yaml` and `mapproxy.yaml`.
 */
async function main() {
  const rawKartlag = JSON.parse(fs.readFileSync("kartlag.json"));
  kartlag = {};

  for (const e of Object.values(rawKartlag)) {
    for (const ul of Object.values(e.underlag || {})) {
      const wmsurl = getBaseWmsUrl(e.wmsurl);
      const isValid = await hasValidWmsSource(wmsurl, ul.wmslayer);
      if (!isValid) {
        console.warn(
          `Skipping invalid WMS source for ${e.tittel} / ${ul.tittel}: ${wmsurl} (${ul.wmslayer})`
        );
        continue;
      }

      ul.wmsurl = wmsurl;
      ul.projeksjon = e.projeksjon;
      // Create a stable internal id used throughout the generated MapProxy
      // configuration. Storing layers in an object lets later duplicates
      // overwrite earlier ones so the final output contains unique ids only.
      ul.id = alphaNumericOnly(e.tittel) + "_" + alphaNumericOnly(ul.tittel);
      kartlag[ul.id] = ul; // Object so we can filter duplicates
    }
  }

  kartlag = Object.values(kartlag);

  kartlag = kartlag.sort((a, b) => {
    if (a.minzoom > b.minzoom) return 1;
    if (a.minzoom < b.minzoom) return -1;
    return a.tittel > b.tittel ? 1 : -1;
  });

  logger = fs.createWriteStream("seed.yaml");

  console.log("Creating seed.yaml");
  makeSeed(kartlag);

  logger.end();
  console.log("Creating mapproxy.yaml");
  logger = fs.createWriteStream("mapproxy.yaml");

  write(`layers:`);
  makeLayers(kartlag);
  write(`caches:`);
  makeCaches(kartlag);
  write(`sources:`);
  makeSources(kartlag);

  write(``);
  write(`grids:`);
  write(`  webmercator:`);
  write(`    base: GLOBAL_MERCATOR`);
  write(`    srs: EPSG:3857`);
  write(`  google:`);
  write(`    base: GLOBAL_MERCATOR`);
  write(`    srs: EPSG:900913`);
  write(``);
  write(`globals:`);

  write(``);
  write(`services:`);
  write(`  demo:`);
  write(`  tms:`);
  write(`    use_grid_names: true`);
  write(`    origin: "nw"`);
  write(`  wmts:`);
  write(`  wms:`);
  write(`    md:`);
  write(`      title: Økologisk grunnkart cache`);
  write(`      abstract: Økologisk grunnkart overview cache.`);
  write(``);

  logger.end();
  console.log("Success: Mapproxy configuration updated.");
}

/**
 * Writes one line to the currently active output file.
 *
 * @param {string} line - A single YAML line without trailing newline.
 */
function write(line) {
  logger.write(line + "\n");
}

/**
 * Removes request-specific query parameters from a WMS URL before writing it
 * into MapProxy configuration.
 *
 * MapProxy will construct its own requests, so the configured source URL should
 * only contain the base endpoint and any required persistent query params.
 *
 * @param {string} wmsurl - WMS URL.
 * @returns {URL} URL object with transient WMS parameters removed.
 */
function trimwmsurl(wmsurl) {
  const url = new URL(wmsurl);
  url.searchParams.delete("request");
  url.searchParams.delete("service");
  return url;
}

/**
 * Creates a WMS GetCapabilities request URL from a base WMS URL.
 *
 * @param {string} urlString - The base WMS URL to augment with standard GetCapabilities query parameters.
 * @returns {string} A URL string with `service=WMS` and `request=GetCapabilities` applied.
 */
function createGetCapabilitiesUrl(urlString) {
  const url = new URL(urlString);
  url.searchParams.set("service", "WMS");
  url.searchParams.set("request", "GetCapabilities");
  return url.toString();
}

/**
 * Collects advertised WMS layer names from a layer node or array of layer nodes.
 *
 * @param {object|object[]} layerNode - A parsed WMS Capability Layer node, or an array of layer nodes.
 * @param {Set<string>} layerNames - The set that will be populated with discovered layer names.
 * @returns {void}
 */
function collectLayerNames(layerNode, layerNames) {
  if (Array.isArray(layerNode)) {
    layerNode.forEach(node => collectLayerNames(node, layerNames));
    return;
  }

  if (!layerNode || typeof layerNode !== "object") return;

  if (typeof layerNode.Name === "string") {
    layerNames.add(layerNode.Name);
  }

  if (layerNode.Layer) {
    collectLayerNames(layerNode.Layer, layerNames);
  }
}

/**
 * Verifies that a WMS service advertises the requested layer name.
 *
 * @param {string} urlString - Base WMS URL.
 * @param {string} layerName - Expected advertised layer name.
 * @returns {Promise<boolean>} True when the layer is present in GetCapabilities.
 */
async function hasValidWmsSource(urlString, layerName) {
  const layerNames = await getAdvertisedLayers(urlString);
  if (!layerNames) {
    if (DEBUG_WMS) {
      console.warn(
        `[WMS DEBUG] No advertised layers could be read from ${urlString}`
      );
    }
    return false;
  }

  const isMatch = layerNames.has(layerName);
  if (DEBUG_WMS) {
    console.log(
      `[WMS DEBUG] Checked layer "${layerName}" against ${urlString}. Advertised layer count: ${layerNames.size}. Match: ${isMatch}`
    );
  }

  if (!isMatch) {
    console.warn(
      `[WMS DEBUG] Missing advertised layer "${layerName}" for ${urlString}`
    );
    if (DEBUG_WMS_LAYERS) {
      console.warn(
        `[WMS DEBUG] Advertised layers for ${urlString}: ${Array.from(
          layerNames
        )
          .sort()
          .join(", ")}`
      );
    }
  }

  return isMatch;
}

/**
 * Returns the set of layer names advertised by a WMS service.
 *
 * Results are cached per service URL so multiple validations against the same
 * endpoint reuse the same in-flight or completed request.
 *
 * @param {string} urlString - Base WMS URL.
 * @returns {Promise<Set<string>|null>} Advertised layer names, or null on error.
 */
async function getAdvertisedLayers(urlString) {
  if (capabilitiesCache.has(urlString)) {
    if (DEBUG_WMS) {
      console.log(`[WMS DEBUG] Using cached capabilities for ${urlString}`);
    }
    return capabilitiesCache.get(urlString);
  }

  if (DEBUG_WMS) {
    console.log(`[WMS DEBUG] Fetching capabilities for ${urlString}`);
  }
  const promise = fetchCapabilitiesLayerNames(urlString);
  capabilitiesCache.set(urlString, promise);
  return promise;
}

/**
 * Fetches and parses a WMS GetCapabilities document.
 *
 * Network and parsing failures are treated as non-fatal and resolve to `null`
 * so the caller can skip invalid sources instead of aborting the whole script.
 *
 * @param {string} urlString - Base WMS URL.
 * @returns {Promise<Set<string>|null>} Advertised layer names, or null.
 */
function fetchCapabilitiesLayerNames(urlString) {
  return new Promise(resolve => {
    try {
      const url = new URL(createGetCapabilitiesUrl(urlString));
      const client = url.protocol === "https:" ? https : http;
      const req = client.get(url, res => {
        if (DEBUG_WMS) {
          console.log(
            `[WMS DEBUG] Capabilities HTTP status for ${urlString}: ${res.statusCode}`
          );
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          console.warn(
            `Invalid HTTP status for capabilities ${urlString}: ${res.statusCode}`
          );
          res.resume();
          resolve(null);
          return;
        }

        let body = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            const layerNames = parseLayerNamesFromCapabilities(body);
            if (DEBUG_WMS) {
              console.log(
                `[WMS DEBUG] Parsed ${layerNames.size} advertised layers from ${urlString}`
              );
            }
            resolve(layerNames);
          } catch (err) {
            console.warn(
              `Failed parsing WMS capabilities for ${urlString}: ${err.message}`
            );
            resolve(null);
          }
        });
      });

      req.setTimeout(10000, () => {
        if (DEBUG_WMS) {
          console.warn(
            `[WMS DEBUG] Timeout while fetching capabilities for ${urlString}`
          );
        }
        req.destroy();
        resolve(null);
      });

      req.on("error", err => {
        if (DEBUG_WMS) {
          console.warn(
            `[WMS DEBUG] Error while fetching capabilities for ${urlString}: ${err.message}`
          );
        }
        resolve(null);
      });
    } catch (err) {
      if (DEBUG_WMS) {
        console.warn(
          `[WMS DEBUG] Invalid capabilities URL ${urlString}: ${err.message}`
        );
      }
      resolve(null);
    }
  });
}

/**
 * Parses advertised layer names from a WMS GetCapabilities XML document.
 *
 * Supports a few common root element variants seen in WMS 1.1.x and 1.3.x
 * responses.
 *
 * @param {string} xml - Raw GetCapabilities XML.
 * @returns {Set<string>} Set of advertised layer names.
 * @throws {Error} If the document does not contain Capability.Layer.
 */
function parseLayerNamesFromCapabilities(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  const parsed = parser.parse(xml);
  const root =
    parsed.WMS_Capabilities ||
    parsed.WMT_MS_Capabilities ||
    parsed["wms:WMS_Capabilities"] ||
    parsed["WMS_MS_Capabilities"];

  if (!root || !root.Capability || !root.Capability.Layer) {
    throw new Error("Missing Capability.Layer in GetCapabilities response");
  }

  const layerNames = new Set();
  collectLayerNames(root.Capability.Layer, layerNames);
  return layerNames;
}

/**
 * Writes the `seed.yaml` content.
 *
 * Only layers with `minzoom > 1` get explicit seed entries, matching the
 * original script behavior. Coverage definitions are appended after the seed
 * list.
 *
 * @param {Array<object>} kartlag - Flattened and validated layer list.
 */
function makeSeed(kartlag) {
  write("seeds:");
  kartlag.forEach(ul => {
    if (ul.minzoom <= 1) return;
    write("  " + ul.id + ":");
    write(`        caches: [${ul.id}_cache]`);
    write(`        coverages: [${coverage[ul.id] || "alt"}]`);
    write(`        levels: [${ul.minzoom}]`);
    write(`        refresh_before:`);
    write(`          time: 2019-10-10T12:35:00`);
    write("");
  });
  write("coverages:");
  write("  norge:");
  write("    datasource: coverage/NO.txt");
  write('    srs: "EPSG:3857"');
  write("  norge_og_svalbard:");
  write("    union:");
  write("      - datasource: coverage/NO.txt");
  write('        srs: "EPSG:3857"');
  write("      - datasource: coverage/SV.txt");
  write('        srs: "EPSG:3857"');
  write("  alt:");
  write("    bbox: [-23.3304, 44.7047, 49.999980, 84]");
  write('    srs: "EPSG:4326"');
}

/**
 * Writes the top-level MapProxy layer definitions.
 *
 * @param {Array<object>} kartlag - Flattened and validated layer list.
 */
function makeLayers(kartlag) {
  kartlag.forEach(ul => {
    write(`  - name: ${ul.id}`);
    write(`    title: "${ul.tittel}"`);
    write(`    sources: [${ul.id}_cache]`);
  });
}

/**
 * Writes MapProxy cache definitions.
 *
 * The grid is selected from the original layer projection, preserving the
 * legacy behavior of this generator.
 *
 * @param {Array<object>} kartlag - Flattened and validated layer list.
 */
function makeCaches(kartlag) {
  kartlag.forEach(ul => {
    write(`  ${ul.id}_cache:`);
    write(`    sources: [${ul.id}]`);
    write(
      `    grids: [${
        ul.projeksjon === "EPSG:900913" ? "google" : "webmercator"
      }]`
    );
    write(`    cache:`);
    write(`      type: sqlite`);
    write(`      directory: /mapproxy/cache/${ul.id}/`);
  });
}

/**
 * Writes MapProxy WMS source definitions.
 *
 * @param {Array<object>} kartlag - Flattened and validated layer list.
 */
function makeSources(kartlag) {
  kartlag.forEach(ul => {
    write(`  ${ul.id}: `);
    write(`    type: wms`);
    write(`    req: `);
    write(`      url: ${trimwmsurl(ul.wmsurl)}`);
    write(`      layers: ${ul.wmslayer}`);
    if (special_options[ul.id]) write(`      ${special_options[ul.id]}`); // Arterrdlista_NTNrtruet
    write(`      transparent: true`);
  });
}
