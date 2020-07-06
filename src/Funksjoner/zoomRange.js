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

const scaleToZoom = ({ minscaledenominator, maxscaledenominator }) => {
  // Asses if current map zoom is within sublayer's scale range
  let min = minscaledenominator ? minscaledenominator : 0;
  let max = maxscaledenominator ? maxscaledenominator : 999999999;

  // NOTE: Some scales from NIBIO seem to be wrong.
  // Adjusted manually here (hopefully this will not
  // affect other scale denominators)
  if (max === 1000000) max = 1091960;
  if (max === 500000) max = 545980;

  let minZoom = null;
  let maxZoom = null;
  for (let i = 0; i < scaleArray.length && !minZoom; i++)
    if (max > scaleArray[i]) minZoom = i;

  for (let i = scaleArray.length; i >= 0 && !maxZoom; i--)
    if (min < scaleArray[i]) maxZoom = i;

  if (!maxZoom) maxZoom = 20;
  if (!minZoom) minZoom = 8; // Default minimum zoom for unspecified
  return [minZoom, maxZoom];
};

export { scaleToZoom };
