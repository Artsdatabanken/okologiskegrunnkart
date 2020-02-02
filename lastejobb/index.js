if (!process.env.DEBUG) process.env.DEBUG = "*";
const { kjørLastejobberUnder } = require("lastejobb");

const scripPath = "stages/" + (process.argv[2] || "");
kjørLastejobberUnder(scripPath);
