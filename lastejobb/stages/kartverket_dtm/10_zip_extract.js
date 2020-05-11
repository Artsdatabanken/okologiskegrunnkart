const { archive, io } = require("lastejobb");

const files = io.findFiles("temp/DTM50 TIFF-format");
for (var file of files) archive.unzip("../" + file);
