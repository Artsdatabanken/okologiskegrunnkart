import Dexie from "dexie";

const db = new Dexie("GrunnkartDB");

const store = {
  layers: "&id, title, favorite",
  sublayers: "&id, title, favorite"
};

db.version(1).stores(store);

export default db;
