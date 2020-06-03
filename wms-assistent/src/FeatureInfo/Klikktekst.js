import React from "react";

const Test = (props) => {
  return <div>Test v={props.v}</div>;
};

function lookup(o, path, warn) {
  if (o.loading || o.error || Object.keys(o).length === 0) return;
  if (!path) return JSON.stringify(o);
  const segments = path.split(".");
  for (var segment of segments) {
    if (o[segment] === undefined) {
      warn.push(
        path + ": " + segment + " mangler i " + Object.keys(o).join(",")
      );
      return null;
    }
    o = o[segment];
  }
  if (typeof o === "string") return o;
  return JSON.stringify(o);
}

function mapComponent(c) {
  if (!c) return c;
  c = c.split(" ");
  const type = c.shift();
  const props = c.reduce((acc, e) => {
    e = e.split("=");
    const js = e[1] || "true";
    acc[e[0]] = JSON.parse(js);
    return acc;
  }, {});
  return { type, props };
}

const klikktekst = (input, formatstring = "") => {
  if (!input) return { verdier: [] };
  if (input.error) return { warn: [input.error] };
  if (input.loading) return { verdier: "..." };
  const matches = formatstring.matchAll(
    /\{(?<variable>.*?)\}|<(?<component>.*?)\/>|(?<literal>[^<{]+)/g
  );
  var hits = Array.from(matches);
  hits = hits.map((e) => {
    const r = e.groups;
    r.component = mapComponent(r.component);
    return r;
  });

  const warn = [];
  const verdier = hits.map((e) => {
    if (e.component) return React.createElement(Test, e.component.props);
    if (e.variable) return lookup(input, e.variable, warn);
    if (e.literal) return e.literal;
    return null;
  });

  return { warn, verdier: verdier || [] };
};

export default klikktekst;
