import proj4 from "proj4";

function getPolygonDepth(polygon) {
  if (!polygon) return 0;
  if (!Array.isArray(polygon) || polygon.length === 0) return 0;
  const depth1 = polygon[0];
  if (!Array.isArray(depth1) || depth1.length === 0) return 1;
  // Single polygon
  const depth2 = depth1[0];
  if (!Array.isArray(depth2) || depth2.length === 0) return 2;
  // Single polygon with holes
  const depth3 = depth2[0];
  if (!Array.isArray(depth3) || depth3.length === 0) return 3;
  // Multipolygon
  const depth4 = depth3[0];
  if (!Array.isArray(depth4) || depth4.length === 0) return 4;
  return 5;
}

function getFirstPolygonCoordinate(polygon) {
  if (!polygon) return 0;
  if (!Array.isArray(polygon) || polygon.length === 0) return null;
  const depth1 = polygon[0];
  if (!Array.isArray(depth1) || depth1.length === 0) return null;
  // Single polygon
  const depth2 = depth1[0];
  if (!Array.isArray(depth2) || depth2.length === 0)
    return [depth1[0], depth1[1]];
  // Single polygon with holes
  const depth3 = depth2[0];
  if (!Array.isArray(depth3) || depth3.length === 0)
    return [depth2[0], depth2[1]];
  // Multipolygon
  const depth4 = depth3[0];
  if (!Array.isArray(depth4) || depth4.length === 0)
    return [depth3[0], depth3[1]];
  return [depth4[0], depth4[1]];
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

function transformPolygonCoord(geom, projection) {
  if (!geom || !geom.coordinates) return [];
  const coordinates = geom.coordinates;
  const depth = getPolygonDepth(coordinates);

  // Calculate real coordinates from projections
  const epsg3857Proj = projection;
  const geographicProj = "+proj=longlat +datum=WGS84 +no_defs";

  const allGeoms = [];
  if (depth === 2 || depth === 3) {
    for (const coord of coordinates) {
      const sortedGeom = coord.map(item => {
        const x = item[0];
        const y = item[1];
        const [lng, lat] = proj4(epsg3857Proj, geographicProj, [x, y]);
        return [lat, lng];
      });
      allGeoms.push(sortedGeom);
    }
  } else if (depth === 4) {
    for (const poly of coordinates) {
      const polygon = [];
      for (const coord of poly) {
        const sortedGeom = coord.map(item => {
          const x = item[0];
          const y = item[1];
          const [lng, lat] = proj4(epsg3857Proj, geographicProj, [x, y]);
          return [lat, lng];
        });
        polygon.push(sortedGeom);
      }
      allGeoms.push(polygon);
    }
  }
  return allGeoms;
}

function transformUploadedPolygon(geom, projection) {
  if (!geom || !geom.coordinates) return [];
  const coordinates = geom.coordinates;
  const firstCoordinate = getFirstPolygonCoordinate(coordinates);
  // If both coordinates are < 90, it is already in EPSG:4326.
  // No need to transform, only sort.
  // NOTE: this works because in Norway, at least one coordinate
  // will always be larger than 90 when projected. This may fail
  // in other regions
  if (firstCoordinate[0] <= 90 && firstCoordinate[1] <= 90) {
    const allGeoms = sortPolygonCoord(geom);
    return allGeoms;
  } else if (projection !== "") {
    const allGeoms = transformPolygonCoord(geom, projection);
    return allGeoms;
  } else {
    return [];
  }
}

export { getPolygonDepth, sortPolygonCoord, transformUploadedPolygon };
