import Dexie from "dexie";

const db = new Dexie("GrunnkartDB");

const store = {
  layers: "&id, layer, active",
  sublayers: "&id, sublayer, active"
};

db.version(1).stores(store);

export default db;
