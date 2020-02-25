#!/usr/bin/env node
const { spawnSync } = require("child_process");
const lib = require("./lib");
const init = require("./init");
const { io, log } = lib;

function kjørLastejobb(jsFile) {
  log.debug("Kjører " + jsFile);
  const r = spawnSync("node", ["--max_old_space_size=2096", `"${jsFile}"`], {
    encoding: "buffer",
    shell: true,
    stdio: [0, 1, 2]
  });
  if (r.status > 0) process.exit(1);
}

function kjørLastejobberUnder(rotkatalog) {
  let files = io.findFiles(rotkatalog, ".js");
  files = files.sort();
  log.info("Fant " + files.length + " lastejobber");
  files = files.filter(file => file.indexOf(".test") < 0);
  files.forEach(file => kjørLastejobb(file));
}

if (process.argv.length > 2) {
  switch (process.argv[2]) {
    case "init":
      log.info("Initialiserer lastejobb");
      init.init();
      break;
    default:
      log.info("Usage: npx lastejobb init");
  }
}

module.exports = {
  ...lib,
  kjørLastejobberUnder,
  kjørLastejobb
};
