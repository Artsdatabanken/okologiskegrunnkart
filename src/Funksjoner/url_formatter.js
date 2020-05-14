export default function url_formatter(formatstring = "", variables) {
  if (!formatstring) return null;
  if (variables.loading) return null;
  if (variables.error) return null;

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

  if (parts.length <= 0) console.log("parts", formatstring, variables);
  var url = new URL(parts.join(""));
  const params = new URLSearchParams(url.search);
  url.search = params.toString();
  return url.toString();
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

export function wmsurlformatter(wmsurl = "", variables, layers) {
  if (!wmsurl) return null;
  var url = new URL(wmsurl);
  const layerNames = layers.map(e => e.wmslayer);
  const params = new URLSearchParams(url.search);
  params.set("layers", layerNames[0]);
  params.set("query_layers", layerNames.join(","));
  if (!params.get("version")) params.set("version", "1.3.0");
  for (var key of Object.keys(variables)) params.set(key, variables[key]);
  url.search = params.toString();
  return url.toString();
}
