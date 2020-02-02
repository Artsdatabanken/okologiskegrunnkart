const { io, log } = require("lastejobb");
const { spawnSync } = require("child_process");
const { DOMParser } = require("xmldom");
const WMSCapabilities = require("wms-capabilities");
const fetch = require("node-fetch");

const datasett = io.lesDatafil("ubehandlet/datasett.json");

datasett.forEach(ds => getCapabilities(ds));
//datasett.forEach(ds => checkCors(ds));
const r = [];

async function getCapabilities(ds) {
  if (!ds.Lenke) return;
  const response = await fetch(ds.Lenke);
  const xml = await response.text();
  const json = new WMSCapabilities(xml, DOMParser).toJSON();
  const layerNames = [];
  console.log("### " + ds.Datasett);
  json.Capability.Layer.Layer.forEach(l => {
    console.log(" * " + l.Title || l.Name);
    layerNames.push(l.Name);
  });
  r.push(ds.Datasett, layerNames);
  log.info(ds.Datasett + ":" + layerNames.join(","));
  io.skrivDatafil(ds.Datasett, json);
}

function checkCors(ds) {
  const r = curl(ds.Lenke);
}

function curl(url) {
  if (!url) debugger;
  const childProcess = spawnSync("curl", ["--verbose", url], {
    cwd: process.cwd(),
    env: process.env,
    //    stdio: [process.stdin, process.stdout, process.stderr],
    stdio: "pipe",
    encoding: "utf-8"
  });
  const output = childProcess.output;
  let cors = false;
  output.forEach(block => {
    if (block)
      block.split("\n").forEach(line => {
        if (line.indexOf("Access-Control-Allow-Origin") >= 0) cors = true;
      });
  });
  console.log(cors, url);
  if (childProcess.status > 0) process.exit(1);
}
/*



https://kart.miljodirektoratet.no/arcgis/services/naturtyper_nin/MapServer/WmsServer?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&BBOX=10.12617212102932385,61.29276136045882595,10.90217990628183742,61.74074396699310796&SRS=EPSG:4326&WIDTH=1462&HEIGHT=844&LAYERS=naturtyper_nin_alle&STYLES=&FORMAT=image/png&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96&TRANSPARENT=TRUE

*/
