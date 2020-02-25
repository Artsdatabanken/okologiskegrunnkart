const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;
var gitconfig = require("./gitconfig/gitconfiglocalSync");

function git(cmd, args = "") {
  execSync("git " + cmd + " " + args);
}

function clone(url, destFolder) {
  if (fs.existsSync(destFolder)) pull(destFolder);
  // only latest version
  else {
    fs.mkdirSync(destFolder, { recursive: true });
    git(`clone --depth=1 ${url} ${destFolder}`);
  }
}

function pull(destFolder) {
  git(`-C ${destFolder} pull`);
}

function upstreamUrl(localPath) {
  const config = gitconfig(localPath);
  if (!config) return; // log.warn("No git config in " + localPath);
  if (!config.remote) return; // only a local git repo
  const remote = config.remote.upstream || config.remote.origin;
  const url = remote.url;
  return url;
}

// Calculate what the upstream git url for a local file would be
// The file need not exist locally or remotely
function upstreamUrlForFile(fullpath) {
  const localPath = path.dirname(fullpath);
  const filename = path.basename(fullpath);
  let baseUrl = upstreamUrl(localPath);
  if (!baseUrl) return null;
  baseUrl = baseUrl.replace(".git", "");
  baseUrl = baseUrl.replace("github.com", "raw.githubusercontent.com");
  //  https://github.com/Artsdatabanken/lastejobb.git/master/schema.json
  //  https://raw.githubusercontent.com/Artsdatabanken/lastejobb/master/index.js
  return `${baseUrl}/master/${filename}`;
}

module.exports = { git, clone, pull, upstreamUrl, upstreamUrlForFile };
