const { io } = require("lastejobb");
const fs = require("fs");

const cleaner = {
  WMS: "",
  aar: "år",
  nin_alle: "",
  foreslatt: "foreslått",
  naturvern_omrade: "naturvernområde",
  AR5grenser: "AR5 grenser",
  sjo: "sjø",
  _: " ",
  miljo: "miljø"
};

const cleanup = text =>
  Object.entries(cleaner).reduce(
    (acc, [key, value]) => (acc = acc.replace(key, value)),
    text
  );

const wms = io.lesDatafil("wms.json").items;

const topp = {
  kode: "FP",
  tittel: { nb: "Forvaltningskartlag" },
  kart: { format: { wms: {} } },
  foreldre: []
};

let tre = {};
let tre2 = {};
wms.forEach(ds => readCapabilities(ds));
//new url(tre).assignUrls();
mapBarn();
fs.writeFileSync("build/metadata.json", JSON.stringify(topp, null, " "));

function readCapabilities(ds) {
  const cfg = io.lesDatafil(ds.datasett);
  const layers = cfg.Capability.Layer.Layer;
  layers.forEach(l => {
    addLayer(l, ds);
  });
}

function addLayer(layer, ds) {
  let title = cleanup(layer.Title);
  const e = {
    tittel: { nb: ds.tema + ": " + title },
    dataeier: ds.dataeier,
    geonorge: ds.geonorge
  };
  e.tema = { nb: ds.tema };
  e.kode = "FP-" + lagKode(ds.dataeier + " " + layer.Title);
  e.foreldre = ["FP"];
  let url = ds.wms.replace(/&?request=getcapabilities/i, "");
  url = url.replace(/&?service=wms/i, "");
  url = url.replace(/\?&/, "?");
  url = url.replace(/[\?&]$/, "");
  url = url.replace("version=1.3.0", "");
  url = url.replace("version=1.1.1", "");
  url = url.replace("VERSION=1.3.0", "");

  e.kart = {
    format: {
      wms: { url: url, layer: layer.Name, version: ds.version }
    }
  };
  tre[e.kode] = e;
  tre2[e.dataeier] = tre2[e.dataeier] || {};
  tre2[e.dataeier][e.kode] = e;
}

function lagKode(ds) {
  const p = ds.replace(/[^a-zA-z]/g, " ").split(" ");
  let r = p
    .map(x => x[0])
    .join("")
    .toUpperCase();
  return r;
}

function mapBarn() {
  let barn = [];
  Object.keys(tre).forEach(ckey => {
    const cnode = tre[ckey];
    const barnet = {
      ...cnode,
      farge: "#ef8040"
    };
    barn.push(barnet);
  });

  topp.barn = barn;
  topp.lag = tre2;
}
