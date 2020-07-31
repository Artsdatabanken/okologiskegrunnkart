// Reads kartlag.json
// Creates the files mapproxy.yaml and seed.yaml that Mapproxy needs
//   in order to seed the lowest available single zoom level for each layer.

const fs = require("fs");

const special_options = {
  Arterrdlista_NTNrtruet: "styles: simple" // Don't know why this was necessary. TODO: Check mapserver config?
};

// TODO: Maybe map this information from WMS capabilities and add to kartlag.json
// NOTE: This list is incomplete.  Only layers that had a high enough minimum zoom to benefit from the performance gain from smaller bounds have been listed.
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

const getBaseWmsUrl = url => {
  url = new URL(url);
  for (var item of url.searchParams) {
    const key = item[0];
    if (key.toLowerCase() === "request") url.searchParams.delete(key);
  }
  return url.toString();
};

var kartlag = JSON.parse(fs.readFileSync("kartlag.json"));
kartlag = Object.values(kartlag).reduce((acc, e) => {
  for (var ul of Object.values(e.underlag || {})) {
    ul.wmsurl = getBaseWmsUrl(e.wmsurl);
    ul.projeksjon = e.projeksjon;
    acc[ul.id] = ul; // Object so we can filter duplicates
  }
  return acc;
}, {});
kartlag = Object.values(kartlag);

kartlag = kartlag.sort((a, b) => {
  if (a.minzoom > b.minzoom) return 1;
  if (a.minzoom < b.minzoom) return -1;
  return a.tittel > b.tittel ? 1 : -1;
});

var logger = fs.createWriteStream("seed.yaml");

makeSeed(kartlag);

logger.end();
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

function write(line) {
  logger.write(line + "\n");
}

function trimwmsurl(wmsurl) {
  const url = new URL(wmsurl);
  url.searchParams.delete("request");
  url.searchParams.delete("service");
  return url;
}

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
  write("    bbox: [4.41, 57.92, 34.22, 81.06]");
  write('    srs: "EPSG:4326"');
}

function makeLayers(kartlag) {
  kartlag.forEach(ul => {
    write(`  - name: ${ul.id}`);
    write(`    title: "${ul.tittel}"`);
    write(`    sources: [${ul.id}_cache]`);
  });
}

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
