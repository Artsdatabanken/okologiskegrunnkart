const { processes, log } = require("lastejobb");

log.info("Kjører Massiv nedlaster...");
const cmd = "/usr/bin/dotnet";
const args = [
  "exec",
  "$PWD/Geonorge.NedlastingKlient/Console/bin/Debug/netcoreapp2.1/Geonorge.Nedlaster.dll default"
];

processes.exec(cmd, args);
