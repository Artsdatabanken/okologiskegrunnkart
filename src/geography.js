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
    current.x = x;
    current.y = y;
  }
  polyline.distance = 0;
  for (i = 0; i < coords.length; i++) {
    const current = coords[i];
    const next = coords[(i + 1) % coords.length];
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    next.angle = Math.atan2(dy, dx) * (180 / Math.PI);
    next.distance = Math.sqrt(dx * dx + dy * dy);
    if (i !== 0 || polyline.shapeType === "polygon")
      polyline.distance += next.distance;
  }
  polyline.area = calculateArea(coords);
}

function calculateArea(vertices) {
  var total = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var addX = vertices[i].x;
    var addY = vertices[i === vertices.length - 1 ? 0 : i + 1].y;
    var subX = vertices[i === vertices.length - 1 ? 0 : i + 1].x;
    var subY = vertices[i].y;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

function bbox(json) {
  const bounds = [180, 90, -180, -90];
  console.log({ json });
  for (var feature of json.features)
    bboxgeom(feature.geometry.coordinates, bounds);
  console.log({ bounds });
  return [[bounds[1], bounds[0]], [bounds[3], bounds[2]]];
}

function bboxgeom(geom, bounds) {
  for (var coord of geom) {
    if (Array.isArray(coord[0])) return bboxgeom(coord, bounds);
    bounds[0] = Math.min(bounds[0], coord[0]);
    bounds[1] = Math.min(bounds[1], coord[1]);
    bounds[2] = Math.max(bounds[2], coord[0]);
    bounds[3] = Math.max(bounds[3], coord[1]);
  }
}

export default { addDistances, bbox };
