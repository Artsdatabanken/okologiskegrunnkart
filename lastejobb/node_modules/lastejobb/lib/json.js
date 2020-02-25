// Recursively sort by keys
// So we can minimize diffs in output files
sortKeys = function(x) {
  if (x === null) return x;
  if (x instanceof Date) return x;
  if (typeof x !== "object") return x;
  if (Array.isArray(x)) return x.map(sortKeys);
  var res = {};
  Object.keys(x)
    .sort()
    .forEach(k => (res[k] = sortKeys(x[k])));
  return res;
};

function stringifyGeojsonCompact(geojson) {
  const magic = "😀";
  function replacer(key, value) {
    if (key === "coordinates")
      return magic + JSON.stringify(value, null, 0) + magic;

    return value;
  }
  let json = JSON.stringify(geojson, replacer, "  ");
  json = json.replace(/\"😀/g, "");
  json = json.replace(/😀\"/g, "");
  return json;
}

// Converts an array of objects to an object keyed by property specified in key
const arrayToObject = (arr, { uniqueKey, removeKeyProperty = true }) =>
  arr.reduce((acc, e) => {
    acc[e[uniqueKey]] = e;
    if (removeKeyProperty) delete e[uniqueKey];
    return acc;
  }, {});

// Convert a javascript object into an array
// Arguments:
//    propertyForKey (optional): Assigns a property on the array element with the key from the input object
const objectToArray = (o, propertyForKey) =>
  Object.entries(o).reduce((acc, [key, value]) => {
    if (propertyForKey) value[propertyForKey] = key;
    acc.push(value);
    return acc;
  }, []);

// Move a property to a different location within the object
// Warning: Mutates the object
// Arguments:
//   srcProperty: Name of the property whose value will be moved
//   destPath: New path to put the property
// Example:
//   o =  {a: 42}
//   moveKey(o, 'a', 'd.e') => {d:{e:42}}
function moveKey(o, srcProperty, destPath) {
  if (!o.hasOwnProperty(srcProperty)) return;

  let node = o;
  const destArr = destPath.split(".");
  while (destArr.length > 1) {
    const dest = destArr.shift();
    if (!node[dest]) node[dest] = {};
    node = node[dest];
  }

  const dest = destArr.pop();
  if (node.hasOwnProperty(dest))
    throw new Error(
      `Forsøk på å skrive over nøkkel "${dest}" fra nøkkel "${srcProperty}"`
    );
  node[dest] = o[srcProperty];
  delete o[srcProperty];
  return o;
}

// Remove keys that don't have values
// Example: {a: null, b: {}, c: undefined}
function removeEmptyKeys(o) {
  if (o === undefined) return;
  if (o === null) return;
  if (o.constructor !== Object) return;
  for (var key of Object.keys(o)) {
    const obj = o[key];
    removeEmptyKeys(obj);
    const isEmpty =
      obj === undefined ||
      obj === null ||
      (Object.entries(obj).length === 0 && obj.constructor === Object);
    if (isEmpty) delete o[key];
  }
  return o;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

module.exports = {
  arrayToObject,
  objectToArray,
  mergeDeep,
  moveKey,
  removeEmptyKeys,
  sortKeys,
  stringifyGeojsonCompact
};
