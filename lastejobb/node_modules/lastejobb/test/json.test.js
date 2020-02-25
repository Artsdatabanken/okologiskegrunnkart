const { json } = require("..");

const input = {
  z: 2,
  k: [6, 1, 3],
  y: { c: 5, a: "abc", inception: new Date(1880, 1, 2) }
};
const inputArray = [6, 1, 3];

// Recursively sort objects
test("sort JSON object", () => {
  const actual = json.sortKeys(input);
  expect(actual).toMatchSnapshot();
});

// We don't sort the array
test("sort JSON array", () => {
  const actual = json.sortKeys(inputArray);
  expect(actual).toMatchSnapshot();
});

test("arrayToObject", () => {
  const arr = [{ id: 5, value: "abc" }, { id: 2, name: "def" }];
  const actual = json.arrayToObject(arr, { uniqueKey: "id" });
  expect(actual).toMatchSnapshot();
});

test("arrayToObject: keep keys", () => {
  const arr = [{ id: 5, value: "abc" }, { id: 2, name: "def" }];
  const actual = json.arrayToObject(arr, {
    uniqueKey: "id",
    removeKeyProperty: false
  });
  expect(actual).toMatchSnapshot();
});

test("objectToArray", () => {
  const o = { a: { id: 5 }, b: { name: "def" } };
  const actual = json.objectToArray(o, "identifier");
  expect(actual).toMatchSnapshot();
});

test("moveKey", () => {
  const o = { a: { id: 5 }, b: { c: { name: "def" } } };
  const actual = json.moveKey(o, "a", "b.c.a");
  expect(actual).toMatchSnapshot();
});

test("remove empty keys", () => {
  const input = { a: { b: {} }, c: 2 };
  const actual = json.removeEmptyKeys(input);
  expect(actual).toMatchSnapshot();
});

test("merge deep", () => {
  const obj1 = {
    a: 1,
    b: 1,
    c: { x: 1, y: 1 },
    d: [1, 1]
  };
  const obj2 = {
    b: 2,
    c: { y: 2, z: 2 },
    d: [2, 2],
    e: 2
  };
  const actual = json.mergeDeep(obj1, obj2);
  expect(actual).toMatchSnapshot();
});
