var DecompressZip = require("decompress-zip");
const config = require("./config");
const log = require("log-less-fancy")();

function unzip(filename) {
  const filePath = config.getDataPath(filename);

  var unzipper = new DecompressZip(filePath);
  unzipper.on("error", function(err) {
    log.fatal(err);
    process.exit(1);
  });

  unzipper.on("extract", function(json) {
    log.debug("Extracted " + json.map(e => Object.values(e)[0]).join(", "));
  });

  unzipper.extract({
    path: config.getDataPath(),
    restrict: false,
    strip: 1, // Fjern 1 katalognivå i zippen
    filter: function(file) {
      return file.type !== "SymbolicLink";
    }
  });
}

module.exports = { unzip };
