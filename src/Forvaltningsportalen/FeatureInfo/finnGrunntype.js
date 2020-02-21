export default function finnGrunntype(fi) {
  let value = null;
  let longestkey = "";
  for (var key of Object.keys(fi)) {
    if (key.indexOf("_layer") < 0) continue;
    if (key.length > longestkey.length) {
      longestkey = key;
      value = fi[key];
    }
  }
  return value && Object.values(value)[0];
}
