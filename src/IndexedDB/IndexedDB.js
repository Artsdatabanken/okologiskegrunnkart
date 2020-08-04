import Dexie from "dexie";

const db = new Dexie("GrunnkartDB");

const store = {
  layers: "&id, title, active",
  sublayers: "&id, title, active"
};

db.version(1).stores(store);

export default db;
