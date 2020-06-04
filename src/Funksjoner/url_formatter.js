export function getFeatureInfoUrl(layer, coords) {
  if (layer.klikkurl)
    // Generic API
    return url_formatter(layer.klikkurl, coords);

  return getWmsFeatureUrl(layer, coords);
}

function getWmsFeatureUrl(layer, coords) {
  const url = new URL(layer.wmsurl);
  const params = url.searchParams;

  const delta = 0.01;
  const bbox = `${coords.lng - delta},${coords.lat - delta},${coords.lng +
    delta},${coords.lat + delta}`;

  const layers = Object.values(layer.underlag)
    .filter(l => l.erSynlig && l.wmslayer)
    .map(l => l.wmslayer)
    .join(",");

  const erv130 = layer.wmsversion === "1.3.0";
  params.set("request", "GetFeatureInfo");
  params.set("version", layer.wmsversion || "1.1.0");
  params.set("service", "WMS");
  params.set(erv130 ? "i" : "x", 128);
  params.set(erv130 ? "j" : "y", 128);
  params.set("width", 255);
  params.set("height", 255);
  params.set("layers", layers);
  params.set("query_layers", layers);
  params.set("info_format", layer.wmsinfoformat || "application/vnd.ogc.gml");
  params.set("crs", "EPSG:4326");
  params.set("srs", "EPSG:4326");
  params.set("bbox", bbox);
  return url.toString();
}

export default function url_formatter(formatstring = "", variables) {
  if (variables.loading) return null;
  if (variables.error) return null;

  const delta = 0.01;
  variables.bbox = `${variables.lng - delta},${variables.lat -
    delta},${variables.lng + delta},${variables.lat + delta}`;

  const matches = formatstring.matchAll(
    /\{(?<variable>[^{]*?)\}|(?<literal>[^<{]+)/g
  );
  var hits = Array.from(matches);
  const parts = hits.map(hit => {
    const e = hit.groups;
    if (e.variable) return lookup(variables, e.variable);
    if (e.literal) return e.literal;
    return "";
  });

  var url = parts.join("");
  if (!url) {
    console.warn(
      `Ugyldig url fra formatstring '${formatstring}', variables ${JSON.stringify(
        variables
      )}`
    );
    return null;
  }
  url = new URL(url);
  const params = new URLSearchParams(url.search);
  url.search = params.toString();
  return url.toString();
}

function lookup(o, path) {
  if (o.loading || o.error) return;
  if (!path) return JSON.stringify(o);
  const segments = path.split(".");
  for (var segment of segments) {
    if (!o[segment]) {
      console.warn(path, segment + " mangler i ", o);
      return null;
    }
    o = o[segment];
  }
  if (typeof o === "string") return o;
  return JSON.stringify(o);
}
