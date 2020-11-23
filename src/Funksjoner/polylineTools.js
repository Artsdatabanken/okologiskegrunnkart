function checkIntersectingLines(
  lat1,
  lng1,
  lat2,
  lng2,
  lat3,
  lng3,
  lat4,
  lng4
) {
  const det = (lat2 - lat1) * (lng4 - lng3) - (lat4 - lat3) * (lng2 - lng1);
  if (det === 0) {
    return false;
  } else {
    const lambda =
      ((lng4 - lng3) * (lat4 - lat1) + (lat3 - lat4) * (lng4 - lng1)) / det;
    const gamma =
      ((lng1 - lng2) * (lat4 - lat1) + (lat2 - lat1) * (lng4 - lng1)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}

function checkPolylineIsValid(newLat, newLng, polyline) {
  if (!polyline || polyline.length < 2) return true;
  const lat1 = polyline[polyline.length - 1][0];
  const lng1 = polyline[polyline.length - 1][1];
  for (let i = 1; i < polyline.length; i++) {
    const lat3 = polyline[i - 1][0];
    const lng3 = polyline[i - 1][1];
    const lat4 = polyline[i][0];
    const lng4 = polyline[i][1];
    const intersecting = checkIntersectingLines(
      lat1,
      lng1,
      newLat,
      newLng,
      lat3,
      lng3,
      lat4,
      lng4
    );
    if (intersecting) return false;
  }
  return true;
}

export { checkPolylineIsValid };
