const { geospatial } = require("..");

const geom = [[0, 0], [0, 10], [10, 10], [0, 0]];
const geom2 = [[50, 0], [0, 1], [10, 1], [0, 0]];

test("area", () => {
  const actual = geospatial.calculateArea(geom);
  expect(actual).toMatchSnapshot();
});

test("bbox", () => {
  const actual = geospatial.axisAlignedBoundingBox(geom);
  expect(actual).toMatchSnapshot();
});

test("bbox multi", () => {
  const actual = geospatial.axisAlignedBoundingBox([geom, geom2]);
  expect(actual).toMatchSnapshot();
});
