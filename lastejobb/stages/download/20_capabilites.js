const { io, log } = require("lastejobb");
const { DOMParser } = require("xmldom");
const WMSCapabilities = require("wms-capabilities");
const fetch = require("node-fetch");

const datasett = io.lesDatafil("datasett.json");
datasett.forEach(ds => getCapabilities(ds));

async function getCapabilities(ds) {
  if (!ds.wms) return log.warn(ds.dataeier + " " + ds.tema + " mangler url.");
  const response = await fetch(ds.wms);
  const xml = await response.text();
  const jsonCapabilities = new WMSCapabilities(xml, DOMParser).toJSON();
  io.skrivDatafil(ds.datasett, jsonCapabilities);
}
