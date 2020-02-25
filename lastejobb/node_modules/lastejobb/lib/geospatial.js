function polygonArea(polygon) {
  const numPoints = polygon.length;
  let area = 0;
  let prev = polygon[0];
  for (let i = 1; i <= numPoints; i++) {
    let cur = polygon[i % numPoints];
    area += (prev[0] + cur[0]) * (prev[1] - cur[1]);
    prev = cur;
  }
  return Math.abs(area / 2);
}

/**
 * Calculate area covered by geometry
 * Makes most sense to use on UTM coordinates - does not reproject coordinates
 * s
 * @return {number} Area in square meters (if input is UTM)
 */
function calculateArea(geoJsonGeometries) {
  let area = 0;
  if (Array.isArray(geoJsonGeometries[0][0]))
    geoJsonGeometries.forEach(geom => (area += calculateArea(geom)));
  else return polygonArea(geoJsonGeometries);
  return area;
}

/**
 *  Find the minimal axis aligned rectangle covering the geometry
 *
 * @param {geometries} geoJsonGeometries GeoJSON format geometries collection
 */
function axisAlignedBoundingBox(geoJsonGeometries) {
  let bbox = [1e9, 1e9, -1e9, -1e9];
  if (!Array.isArray(geoJsonGeometries[0][0]))
    return bboxForCoordinates(geoJsonGeometries);
  geoJsonGeometries.forEach(geom => {
    const bbox2 = axisAlignedBoundingBox(geom);
    bbox = unionBboxes(bbox, bbox2);
  });
  return bbox;
}

function bboxForCoordinates(coords) {
  let bbox = [1e9, 1e9, -1e9, -1e9];
  coords.forEach(c => {
    bbox[0] = Math.min(bbox[0], c[0]);
    bbox[1] = Math.min(bbox[1], c[1]);
    bbox[2] = Math.max(bbox[2], c[0]);
    bbox[3] = Math.max(bbox[3], c[1]);
  });
  return bbox;
}

function unionBboxes(bbox1, bbox2) {
  return [
    Math.min(bbox1[0], bbox2[0]),
    Math.min(bbox1[1], bbox2[1]),
    Math.max(bbox1[2], bbox2[2]),
    Math.max(bbox1[3], bbox2[3])
  ];
}

module.exports = { calculateArea, axisAlignedBoundingBox };
