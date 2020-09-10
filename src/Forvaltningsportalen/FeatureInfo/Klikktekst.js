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

function matchInput(formatstring, input) {
  let elementer;
  let harData;
  const matches = formatstring.matchAll(
    /\{(?<variable>.*?)\}|<(?<component>.*?)\/>|(?<literal>[^<{]+)/g
  );

  elementer = Array.from(matches);
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

  elementer = elementer.filter(e => e && e.replace(/ /g, "") !== "");
  harData = elementer.some(e => e && e.replace(/ /g, "") !== "");

  return { harData, elementer };
}

function klikktekstVersjon1(
  formatstringObject,
  inputObject,
  aggregatedLayerKey
) {
  let result = {};
  Object.keys(inputObject).forEach(inputkey => {
    if (inputkey === aggregatedLayerKey) return;
    let input = inputObject[inputkey];
    input = { [inputkey]: input };

    Object.keys(formatstringObject).forEach(stringkey => {
      let formatstring = formatstringObject[stringkey];
      if (!formatstring) return;
      const { harData, elementer } = matchInput(formatstring, input);
      if (harData) {
        result = { ...result, [stringkey]: { harData, elementer } };
      }
    });
  });
  return result;
}

function klikktekstVersjon2(
  formatstringObject,
  inputObject,
  aggregatedLayerKey
) {
  let result = {};
  Object.keys(inputObject).forEach(inputkey => {
    if (inputkey === aggregatedLayerKey) return;
    const input = inputObject[inputkey];
    let formatstring = formatstringObject[inputkey];
    if (!formatstring) return;
    const { harData, elementer } = matchInput(formatstring, input);
    if (harData) {
      result = { ...result, [inputkey]: { harData, elementer } };
    }
  });

  if (aggregatedLayerKey && inputObject[aggregatedLayerKey]) {
    Object.keys(inputObject[aggregatedLayerKey]).forEach(inputkey => {
      if (inputkey === aggregatedLayerKey) return;
      let input = inputObject[aggregatedLayerKey][inputkey];
      input = { [inputkey]: input };

      Object.keys(formatstringObject[aggregatedLayerKey]).forEach(stringkey => {
        let formatstring = formatstringObject[aggregatedLayerKey][stringkey];
        if (!formatstring) return;
        const { harData, elementer } = matchInput(formatstring, input);
        if (harData) {
          result = { ...result, [stringkey]: { harData, elementer } };
        }
      });
    });
  }
  return result;
}

const formatterKlikktekst = (
  formatstringObject = "",
  inputObject,
  aggregatedLayerKey,
  wmsinfoformat
) => {
  if (inputObject.error) {
    return { harData: false, elementer: "Får ikke kontakt" };
  }
  if (inputObject.loading) {
    return {
      harData: false
    };
  }

  let result;
  if (wmsinfoformat === "application/vnd.ogc.gml") {
    result = klikktekstVersjon1(
      formatstringObject,
      inputObject,
      aggregatedLayerKey
    );
  } else {
    result = klikktekstVersjon2(
      formatstringObject,
      inputObject,
      aggregatedLayerKey
    );
  }
  return result;
};

export default formatterKlikktekst;
