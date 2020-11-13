import Dexie from "dexie";

const db = new Dexie("GrunnkartDB");

// KEEP TO REMEMBER OLDER DB VERSION
// const store = {
//   layers: "&id, title, favorite",
//   sublayers: "&id, title, favorite"
// };
// db.version(1).stores(store);

const store = {
  layers: "&id, title, favorite",
  sublayers: "&id, title, favorite",
  polygons: "++id, &name, geometry, date"
};
db.version(2).stores(store);

export default db;
