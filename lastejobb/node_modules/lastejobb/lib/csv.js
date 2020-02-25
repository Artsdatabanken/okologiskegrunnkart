const parse = require("csv-parse/lib/sync");
const fs = require("fs");

function les(csvFilePath, csvOptions, readFileOptions) {
  const input = fs.readFileSync(csvFilePath, readFileOptions);
  const records = parse(input, {
    columns: true,
    ...csvOptions
  });
  return records;
}

module.exports = { les };
