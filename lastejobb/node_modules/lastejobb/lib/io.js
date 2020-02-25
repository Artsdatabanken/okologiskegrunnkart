const fs = require("fs-extra");
const path = require("path");
const log = require("log-less-fancy")();
const GenerateSchema = require("generate-schema");

const config = require("./config");
const git = require("./git");
const json = require("./json");
const jsonschema = require("./jsonschema");

capitalizeTittel = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

function getLength(o) {
  if (o.items) return o.items.length;
  if (o.length) return o.length;
  return Object.keys(o).length;
}

function lesDatafil(filename, extension, defaultJson) {
  const jsonPath = config.getDataPath(filename, extension);
  return readJson(jsonPath, defaultJson);
}

function lesBuildfil(filename, extension, defaultJson) {
  const jsonPath = config.getBuildPath(filename, extension);
  return readJson(jsonPath, defaultJson);
}

function skrivDatafil(filename, o) {
  const jsonPath = config.getDataPath(filename);
  return writeJson(jsonPath, o);
}

function skrivBuildfil(filename, o, delimiter = "  ") {
  const jsonPath = config.getBuildPath(filename);
  if (!Array.isArray(o) && !o.features) {
    // Skriv alltid arrays (da fungerer schema osv)
    // med mindre output er GeoJSON
    o = json.objectToArray(o, "kode");
    o = o.sort((a, b) => (a.kode > b.kode ? 1 : -1));
  }
  const dokument = writeJson(jsonPath, o, delimiter);

  // Lag schema json for build outputs
  const schema = GenerateSchema.json(dokument);
  writeJson(jsonPath.replace(".json", "") + ".schema.json", schema, delimiter);
  return dokument;
}

function skrivLoggLinje(aksjon, filePath, json) {
  let produsertUtc = null;
  if (json.meta && json.meta.produsertUtc)
    produsertUtc = new Date(json.meta.produsertUtc);
  else produsertUtc = new Date(fs.statSync(filePath).ctime);
  const now = new Date();
  const timerGammel =
    Math.round((10 * (now - produsertUtc)) / 1000 / 60 / 60) / 10;

  if (json.data) json = json.data;
  log.info(
    "Lest " +
      getLength(json) +
      " elementer fra " +
      timerGammel +
      " timer gammel fil."
  );
}

// Read file, parse to JSON.  If file doesn't exists defaultJson will be returned
function readJson(filePath, defaultJson) {
  log.info("Åpner " + filePath);
  if (defaultJson && !fs.existsSync(filePath)) return defaultJson;
  let data = fs.readFileSync(filePath, "utf8");
  //  data = data.replace(/^\uFEFF/, '') // node #fail https://github.com/nodejs/node/issues/6924
  if (data.charCodeAt(0) === 0xfeff) data = data.slice(1);
  let json = JSON.parse(data);
  delete json.meta;
  //  if (Object.keys(json).length === 1) json = json[Object.keys(json)[0]]
  skrivLoggLinje("Lest", filePath, json);
  return json;
}

function readBinary(filePath) {
  log.info("Åpner " + filePath);
  const data = fs.readFileSync(filePath, "utf8");
  return data;
}

function writeJson(filePath, o, delimiter) {
  const parsedFn = path.parse(filePath);
  const basename = parsedFn.name;
  let dokument = Array.isArray(o) ? { items: o } : o;
  const meta = dokument.meta;
  const pjson = config.getPackage();
  dokument.meta = {
    tittel: capitalizeTittel(basename.replace(/_/g, " ")),
    produsertUtc: new Date().toJSON(),
    utgiver: "Artsdatabanken",
    url: git.upstreamUrlForFile(filePath),
    tool: { name: pjson.name, url: pjson.homepage },
    elementer: getLength(o)
  };
  if (meta) Object.assign(dokument.meta, meta);
  dokument.items = json.sortKeys(dokument.items);
  const schemaFilename = filePath.replace(parsedFn.ext, ".schema.json");
  if (fs.existsSync(schemaFilename))
    jsonschema.addSchemaLink(dokument, schemaFilename);
  const bytes = writeBinary(
    filePath,
    stringify(dokument, parsedFn.ext, delimiter)
  );
  log.info("Skrevet " + getLength(o) + " elementer, " + bytes + " bytes");
  return dokument;
}

function stringify(o, extension, delimiter) {
  if (extension === ".geojson") return json.stringifyGeojsonCompact(o);
  return JSON.stringify(o, null, delimiter);
}

function writeBinary(filePath, o) {
  if (!filePath) throw new Error("Filename is required");
  if (!o) throw new Error("No data provided");
  log.info("Writing " + filePath);
  const dir = path.dirname(filePath);
  mkdir(dir);
  fs.writeFileSync(filePath, o, "utf8");
  return o.length;
}

function mkdir(path) {
  fs.ensureDirSync(path);
}

function fileExists(path) {
  return fs.existsSync(path);
}

// Recursive find files in startPath satisfying filter
function findFiles(startPath, filter) {
  let r = [];
  var files = fs.readdirSync(startPath);
  for (var file of files) {
    var filename = path.join(startPath, file);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      r = r.concat(findFiles(filename, filter));
    } else if (filter && filter !== path.parse(filename).ext) {
    } else r.push(filename);
  }
  return r;
}

module.exports = {
  lesDatafil,
  lesBuildfil,
  readJson,
  writeBinary,
  writeJson,
  skrivDatafil,
  skrivBuildfil,
  findFiles,
  fileExists,
  mkdir
};
