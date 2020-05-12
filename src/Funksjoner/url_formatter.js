var qs = require("qs");

export default function url_formatter(formatstring = "", variables) {
  if (variables.loading) return null;
  if (variables.error) return null;

  const delta = 0.01;
  variables.bbox = `${variables.lng - delta},${variables.lat -
    delta},${variables.lng + delta},${variables.lat + delta}`;

  const matches = formatstring.matchAll(
    /\{(?<variable>[^{]*?)\}|(?<literal>[^<{]+)/g
  );
  var hits = Array.from(matches);
  const parts = hits.map(hit => {
    const e = hit.groups;
    if (e.variable) return lookup(variables, e.variable);
    if (e.literal) return e.literal;
    return "";
  });

  const url = parts.join("");
  var uo = qs.parse(url);
  if (uo.request === "GetFeatureInfo") {
    // Force xy of featureinfo to center of bbox
    uo.x = 128;
    uo.y = 128;
    uo.width = 255;
    uo.height = 255;
  }
  return url;
}

function lookup(o, path) {
  if (o.loading || o.error) return;
  if (!path) return JSON.stringify(o);
  const segments = path.split(".");
  for (var segment of segments) {
    if (!o[segment]) {
      console.warn(path, segment + " mangler i ", o);
      return null;
    }
    o = o[segment];
  }
  if (typeof o === "string") return o;
  return JSON.stringify(o);
}
