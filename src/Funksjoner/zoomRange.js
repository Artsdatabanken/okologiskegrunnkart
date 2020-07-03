// Relation scale denominator - map zoom
// Index in array corresponds to map zoom
const scaleArray = [
  559082264, // zoom 0
  279541132, // zoom 1
  139770566, // zoom 2
  69885283, // zoom 3
  34942642, // zoom 4
  17471321, // zoom 5
  8735660, // zoom 6
  4367830, // zoom 7
  2183915, // zoom 8
  1091958, // zoom 9
  545979, // zoom 10
  272989, // zoom 11
  136495, // zoom 12
  68247, // zoom 13
  34124, // zoom 14
  17062, // zoom 15
  8531, // zoom 16
  4265, // zoom 17
  2133, // zoom 18
  1066, // zoom 19
  533 // zoom 20
];

function zoomRangeLayer(zoom, sublayers) {
  // Find the highest 'maxscaledenominator' and lowest
  // 'minscaledenominator' from all sublayers
  // NOTE: if maxScaleDenominator is null, in any sublayer,
  // max is set to 999999999 (unlimited)
  let min = 999999999;
  let max = 0;
  let maxNull = false;
  for (const sublayerId in sublayers) {
    if (sublayers[sublayerId].minscaledenominator < min) {
      min = sublayers[sublayerId].minscaledenominator;
    }
    if (sublayers[sublayerId].maxscaledenominator > max) {
      max = sublayers[sublayerId].maxscaledenominator;
    }
    if (sublayers[sublayerId].maxscaledenominator === null) maxNull = true;
  }
  if (!min || min === 999999999) min = 0;
  if (!max || max === 0 || maxNull) max = 999999999;

  // NOTE: Some scales from NIBIO seem to be wrong.
  // Adjusted manually here (hopefully this will not
  // affect other scale denominators)
  if (max === 1000000) max = 1091960;
  if (max === 500000) max = 545980;

  // Asses if current map zoom is within all sublayers' scale range
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
  // Asses if current map zoom is within sublayer's scale range
  let min = minScaleDenominator ? minScaleDenominator : 0;
  let max = maxScaleDenominator ? maxScaleDenominator : 999999999;

  // NOTE: Some scales from NIBIO seem to be wrong.
  // Adjusted manually here (hopefully this will not
  // affect other scale denominators)
  if (max === 1000000) max = 1091960;
  if (max === 500000) max = 545980;

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
  if (!minIndex) minIndex = 20;
  if (!maxIndex) maxIndex = 0;

  if (zoom >= maxIndex && zoom <= minIndex) {
    return { disabled: false, description: "" };
  } else if (zoom < maxIndex) {
    return { disabled: true, description: "Utenfor zoomområdet - zoom inn" };
  }
  return { disabled: true, description: "Utenfor zoomområdet - zoom ut" };
}

function zoomRangeBadge(zoom, sublayers) {
  // Find the highest 'maxscaledenominator' and lowest 'minscaledenominator'
  // from all sublayers which are visible (i.e. selected by user)
  // NOTE: if maxScaleDenominator is null, in any sublayer,
  // max is set to 999999999 (unlimited)
  let min = 999999999;
  let max = 0;
  let maxNull = false;
  let visibleSublayers = {};
  for (const sublayerId in sublayers) {
    if (sublayers[sublayerId].erSynlig) {
      visibleSublayers[sublayerId] = sublayers[sublayerId];
    }
    if (
      sublayers[sublayerId].minscaledenominator < min &&
      sublayers[sublayerId].erSynlig
    ) {
      min = sublayers[sublayerId].minscaledenominator;
    }
    if (
      sublayers[sublayerId].maxscaledenominator > max &&
      sublayers[sublayerId].erSynlig
    ) {
      max = sublayers[sublayerId].maxscaledenominator;
    }
    if (sublayers[sublayerId].maxscaledenominator === null) maxNull = true;
  }
  if (visibleSublayers.length === 0) return true;

  if (!min || min === 999999999) min = 0;
  if (!max || max === 0 || maxNull) max = 999999999;

  // NOTE: Some scales from NIBIO seem to be wrong.
  // Adjusted manually here (hopefully this will not
  // affect other scale denominators)
  if (max === 1000000) max = 1091960;
  if (max === 500000) max = 545980;

  // Asses if current map zoom is within all sublayers' scale range
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
    return false;
  }
  return true;
}

const scaleToZoom = ({ minscaledenominator, maxscaledenominator }) => {
  // Asses if current map zoom is within sublayer's scale range
  let min = minscaledenominator ? minscaledenominator : 0;
  let max = maxscaledenominator ? maxscaledenominator : 999999999;

  // NOTE: Some scales from NIBIO seem to be wrong.
  // Adjusted manually here (hopefully this will not
  // affect other scale denominators)
  if (max === 1000000) max = 1091960;
  if (max === 500000) max = 545980;

  let maxZoom = null;
  let minZoom = null;
  for (let i = 0; i < scaleArray.length && !maxZoom; i++)
    if (max > scaleArray[i]) maxZoom = i;

  for (let i = scaleArray.length; i >= 0 && !minZoom; i--)
    if (min < scaleArray[i]) minZoom = i;

  if (!minZoom) minZoom = 20;
  if (!maxZoom) maxZoom = 0;
  return [maxZoom, minZoom];
};

export { zoomRangeLayer, zoomRangeSublayer, zoomRangeBadge, scaleToZoom };
