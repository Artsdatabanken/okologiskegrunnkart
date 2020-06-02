import PouchDB from "pouchdb-browser";

const tjeneste = new PouchDB("forvaltningsportal-kartlag");
const dataeier = new PouchDB("forvaltningsportal-dataeier");
const remoteTjeneste = new PouchDB(
  `http://172.17.0.2:5984/forvaltningsportal-kartlag`
);
const remoteDataeier = new PouchDB(
  `http://172.17.0.2:5984/forvaltningsportal-dataeier`
);

const options = {
  live: true,
  heartbeat: false,
  timeout: false,
  retry: true,
};
xxx;

PouchDB.sync(tjeneste, remoteTjeneste, options);
PouchDB.sync(dataeier, remoteDataeier, options);
console.log("xxxxx");
export default { tjeneste, dataeier };
