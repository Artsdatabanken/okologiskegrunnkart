import React from "react";

const Test = props => {
  return <div>Test v={props.v}</div>;
};

function lookup(o, path) {
  if (o.loading || o.error || Object.keys(o).length === 0) return;
  if (!path) return JSON.stringify(o);
  const segments = path.split(".");
  for (const segment of segments) {
    if (o[segment] === undefined) {
      return null;
    }
    o = o[segment];
  }

  let key = path;
  if (segments.length > 1) {
    key = segments[segments.length - 1];
  }

  // Clean string
  const cleanResult = cleanLookup(o);

  // Filter out results if not relevant
  const result = filterLookup(cleanResult);

  if (key === "nb" && segments.length > 1) {
    const prekey = segments[segments.length - 2];
    key = `${prekey}${key}`;
  }
  key = key.replace(/:/g, "");
  return { [key]: result };
}

function cleanLookup(o) {
  let result;
  if (typeof o === "string") {
    result = o;
  } else {
    if (typeof o === "number") {
      const decimals = countDecimals(o);
      if (decimals > 6) o = o.toFixed(6);
    }
    result = JSON.stringify(o);
  }
  return result;
}

function filterLookup(o) {
  let result;
  // Filter out results if not relevant
  if (o.replace(/ /g, "") === "") return null;
  if (o.toLowerCase() === "null") return null;
  result = o.charAt(0).toUpperCase() + o.slice(1);
  result = result.replace(/&#xA;/g, "");
  result = result.replace(/&quot;/g, '"');
  return result;
}

function countDecimals(number) {
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1].length || 0;
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

  // If empty, the lookup function return string (typically "null" or "") instead of object
  elementer = elementer.filter(e => e && typeof e !== "string");
  elementer = elementer.filter(e => e && typeof e !== "string");

  // // Capitalize and add separation point if needed
  // for (let i = 0; i < elementer.length; i++) {
  //   if (typeof elementer[i] === "string" || elementer[i] instanceof String) {
  //     elementer[i] =
  //       elementer[i].charAt(0).toUpperCase() + elementer[i].slice(1);
  //     elementer[i] = elementer[i].replace(/&#xA;/g, "");
  //   }
  //   if (i < elementer.length - 1) {
  //     elementer[i] = elementer[i] + ". ";
  //   }
  // }
  // harData = elementer.some(e => e && e.replace(/ /g, "") !== "");

  elementer = elementer.filter(e => e !== null);
  harData = elementer.length > 0;

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
  if (
    wmsinfoformat === "application/vnd.ogc.gml" ||
    wmsinfoformat === "application/vnd.esri.wms_raw_xml"
  ) {
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
