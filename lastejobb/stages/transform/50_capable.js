const { io } = require("lastejobb");

const datasett = io.lesDatafil("ubehandlet/datasett.json");

let r = [];
datasett.forEach(ds => readCapabilities(ds));
io.skrivDatafil("wms", r);

function readCapabilities(ds) {
  const capa = io.lesDatafil(ds.datasett);
  const e = Object.assign(ds, capa);
  r.push(e);
}
