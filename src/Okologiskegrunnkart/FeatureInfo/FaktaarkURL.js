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
  result = o.replace(/&#xA;/g, "");
  return result;
}

function countDecimals(number) {
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1].length || 0;
}

function matchInput(formatstring, input) {
  let elementer;
  formatstring = formatstring.trim();
  const matches = formatstring.matchAll(/\{(?<variable>.*?)\}/g);

  elementer = Array.from(matches);

  if (!elementer || elementer.length === 0) {
    if (typeof formatstring === "string" && formatstring.length > 0) {
      return { harData: true, faktaark: formatstring };
    }
    return { harData: false };
  }
  const element = elementer[0];
  if (!element.groups || !element.groups.variable) return { harData: false };
  const variable = element.groups.variable;
  const result = lookup(input, variable);
  if (!result || result.constructor !== Object) return { harData: false };
  if (Object.keys(result).length === 0) return { harData: false };

  // Get first property value an dreplace in orginal string
  let faktaark = encodeURIComponent(result[Object.keys(result)[0]]);
  faktaark = formatstring.replace(/\{(.+?)\}/g, faktaark);

  return { harData: true, faktaark };
}

function formatterFaktaarkVersjon1(
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
      const { harData, faktaark } = matchInput(formatstring, input);
      if (harData) {
        result = { ...result, [stringkey]: { harData, faktaark } };
      }
    });
  });
  return result;
}

function formatterFaktaarkVersjon2(
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
    const { harData, faktaark } = matchInput(formatstring, input);
    if (harData) {
      result = { ...result, [inputkey]: { harData, faktaark } };
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
        const { harData, faktaark } = matchInput(formatstring, input);
        if (harData) {
          result = { ...result, [stringkey]: { harData, faktaark } };
        }
      });
    });
  }
  return result;
}

const formatterFaktaarkURL = (
  formatstringObject = "",
  inputObject,
  aggregatedLayerKey,
  wmsinfoformat
) => {
  if (inputObject.error) {
    return { harData: false, faktaark: "Får ikke kontakt" };
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
    result = formatterFaktaarkVersjon1(
      formatstringObject,
      inputObject,
      aggregatedLayerKey
    );
  } else {
    result = formatterFaktaarkVersjon2(
      formatstringObject,
      inputObject,
      aggregatedLayerKey
    );
  }
  return result;
};

export default formatterFaktaarkURL;
