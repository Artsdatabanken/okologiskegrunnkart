const { git } = require("../");

test("Schema url", () => {
  const actual = git.upstreamUrlForFile("./schema.json");
  expect(actual).toMatchSnapshot();
});
