// Index in array corresponds to map zoom
const scaleArray = [
  559082264,
  279541132,
  139770566,
  69885283,
  34942642,
  17471321,
  8735660,
  4367830,
  2183915,
  1091958,
  545979,
  272989,
  136495,
  68247,
  34124,
  17062,
  8531,
  4265,
  2133,
  1066,
  533
];

function zoomRangeLayer(zoom, sublayers) {
  let min = 0;
  let max = 999999999;
  for (const sublayerId in sublayers) {
    if (sublayers[sublayerId].minscaledenominator > min) {
      min = sublayers[sublayerId].minscaledenominator;
    }
    if (sublayers[sublayerId].maxscaledenominator < max) {
      max = sublayers[sublayerId].maxscaledenominator;
    }
  }

  let maxIndex = null;
  let minIndex = null;
  for (let i = 0; i < scaleArray.length; i++) {
    if (!maxIndex && max > scaleArray[i]) {
      maxIndex = i;
    }
  }
  for (let i = scaleArray.length; i >= 0; i--) {
    if (!minIndex && min < scaleArray[i]) {
      minIndex = i;
    }
  }
  if (!minIndex) {
    minIndex = 20;
  }
  if (!maxIndex) {
    maxIndex = 0;
  }

  if (zoom >= maxIndex && zoom <= minIndex) {
    return { disabled: false, description: "" };
  }
  return { disabled: true, description: "Alle lag utenfor zoomområdet" };
}

function zoomRangeSublayer(zoom, minScaleDenominator, maxScaleDenominator) {
  const min = minScaleDenominator ? minScaleDenominator : 0;
  const max = maxScaleDenominator ? maxScaleDenominator : 999999999;

  let maxIndex = null;
  let minIndex = null;
  for (let i = 0; i < scaleArray.length; i++) {
    if (!maxIndex && max > scaleArray[i]) {
      maxIndex = i;
    }
  }
  for (let i = scaleArray.length; i >= 0; i--) {
    if (!minIndex && min < scaleArray[i]) {
      minIndex = i;
    }
  }
  if (!minIndex) {
    minIndex = 20;
  }
  if (!maxIndex) {
    maxIndex = 0;
  }

  if (zoom >= maxIndex && zoom <= minIndex) {
    return { disabled: false, description: "" };
  } else if (zoom < maxIndex) {
    return { disabled: true, description: "Utenfor zoomområdet - zoom inn" };
  }
  return { disabled: true, description: "Utenfor zoomområdet - zoom ut" };
}

export { zoomRangeLayer, zoomRangeSublayer };
