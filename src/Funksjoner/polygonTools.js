function getPolygonDepth(polygon) {
  if (!polygon) return 0;
  if (!Array.isArray(polygon) || polygon.length === 0) return 0;
  const depth1 = polygon[0];
  if (!Array.isArray(depth1) || depth1.length === 0) return 1;
  // Single polygon
  const depth2 = depth1[0];
  if (!Array.isArray(depth2) || depth2.length === 0) return 2;
  // ingle polygon with holes
  const depth3 = depth2[0];
  if (!Array.isArray(depth3) || depth3.length === 0) return 3;
  // Multipolygon
  const depth4 = depth3[0];
  if (!Array.isArray(depth4) || depth4.length === 0) return 4;
  return 5;
}

function sortPolygonCoord(geom) {
  if (!geom || !geom.coordinates) return [];
  const coordinates = geom.coordinates;
  const depth = getPolygonDepth(coordinates);
  const allGeoms = [];
  if (depth === 2 || depth === 3) {
    for (const coord of coordinates) {
      const sortedGeom = coord.map(item => {
        return [item[1], item[0]];
      });
      allGeoms.push(sortedGeom);
    }
  } else if (depth === 4) {
    for (const poly of coordinates) {
      const polygon = [];
      for (const coord of poly) {
        const sortedGeom = coord.map(item => {
          return [item[1], item[0]];
        });
        polygon.push(sortedGeom);
      }
      allGeoms.push(polygon);
    }
  }
  return allGeoms;
}

export { getPolygonDepth, sortPolygonCoord };
