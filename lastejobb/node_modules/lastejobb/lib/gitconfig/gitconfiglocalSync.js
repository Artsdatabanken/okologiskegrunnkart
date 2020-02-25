var fs = require("fs");
var ini = require("ini");
var path = require("path");
const { log } = require("../");

module.exports = function(dir) {
  let gitDir = path.resolve(dir, process.env.GIT_DIR || ".git");
  if (!fs.existsSync(gitDir)) return;
  if (fs.statSync(gitDir).isFile()) {
    // Git Submodule
    let formatted = readDotGitFile(gitDir);
    // Relative path
    gitDir = path.resolve(dir, formatted.gitdir);
  }

  var configPath = path.join(gitDir, "config");
  if (!fs.existsSync(configPath))
    return log.warn("no gitconfig found at " + dir);
  let formatted = readGitConfig(configPath);
  return formatted;
};

function readDotGitFile(configPath) {
  const data = fs.readFileSync(configPath).toString();
  return data.split("\n").reduce((acc, line) => {
    const [k, v] = line.split(":");
    if (v) acc[k] = v.trim();
    return acc;
  }, {});
}

function readGitConfig(configPath) {
  const data = fs.readFileSync(configPath);
  const inidata = ini.parse(data.toString());
  var formatted = format(inidata);
  return formatted;
}

function format(data) {
  var out = {};
  Object.keys(data).forEach(k => {
    if (k.indexOf('"') > -1) {
      var parts = k.split('"');
      var parentKey = parts.shift().trim();
      var childKey = parts.shift().trim();
      if (!out[parentKey]) out[parentKey] = {};
      out[parentKey][childKey] = data[k];
    } else {
      out[k] = { ...out[k], ...data[k] };
    }
  });
  return out;
}
