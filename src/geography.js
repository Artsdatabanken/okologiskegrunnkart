import proj4 from "proj4";

var geographicProjection = "+proj=longlat +datum=WGS84 +no_defs";
var utmProjection = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

function addDistances(polyline) {
  const coords = polyline.coords;
  for (var i = 0; i < coords.length; i++) {
    const current = coords[i];
    const [x, y] = proj4(geographicProjection, utmProjection, [
      current.coords[0],
      current.coords[1]
    ]);
    current.utm = { x, y };
  }

  for (var i = 0; i < coords.length; i++) {
    const current = coords[i];
    const next = coords[(i + 1) % coords.length];
    const dx = next.utm.x - current.utm.x;
    const dy = next.utm.y - current.utm.y;
    next.angle = Math.atan2(dy, dx) * (180 / Math.PI);
    next.dist = Math.sqrt(dx * dx + dy * dy);
  }
}

export default { addDistances };
