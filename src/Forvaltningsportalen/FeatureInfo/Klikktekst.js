import React from "react";

const Test = props => {
  return <div>Test v={props.v}</div>;
};

function lookup(o, path) {
  if (o.loading || o.error || Object.keys(o).length === 0) return;
  if (!path) return JSON.stringify(o);
  const segments = path.split(".");
  for (var segment of segments) {
    if (o[segment] === undefined) {
      //      console.warn(path, segment + " mangler i ", o);
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

const formatterKlikktekst = (formatstring = "", input) => {
  if (input.error) return { harData: false, elementer: "Får ikke kontakt" };
  if (input.loading)
    return {
      harData: false
    };
  const matches = formatstring.matchAll(
    /\{(?<variable>.*?)\}|<(?<component>.*?)\/>|(?<literal>[^<{]+)/g
  );
  var elementer = Array.from(matches);
  elementer = elementer.map(e => {
    const r = e.groups;
    r.component = mapComponent(r.component);
    return r;
  });

  elementer = elementer.map(e => {
    if (e.component) return React.createElement(Test, e.component.props);
    if (e.variable) return lookup(input, e.variable);
    if (e.literal) return e.literal;
    return null;
  });
  const harData = elementer.some(e => e !== null);
  return {
    harData,
    elementer
  };
};

export default formatterKlikktekst;
