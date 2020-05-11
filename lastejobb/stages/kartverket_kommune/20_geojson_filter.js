const { io } = require("lastejobb");
const fs = require("fs");

// Plukker ut bare kommunene fra datasettet med flere lag
const all = io.lesTempJson(
  "Basisdata_0000_Norge_25833_Kommuner_GEOJSON.geojson"
);
const kommuner = all["administrative_enheter.kommune"];

fs.writeFileSync("temp/kommune.geojson", JSON.stringify(kommuner));
