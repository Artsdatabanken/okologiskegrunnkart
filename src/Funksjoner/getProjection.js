// Get projection according to proj4.js
const getProjection = crs => {
  let projection = "";
  crs = crs.toLowerCase();
  if (
    crs.includes("epsg") &&
    (crs.includes(":3857") ||
      crs.includes(":3785") ||
      crs.includes(":900913") ||
      crs.includes(":102113"))
  ) {
    projection = "EPSG:3857";
  } else if (crs.includes("epsg") && crs.includes(":4269")) {
    projection = "EPSG:4269";
  } else if (crs.includes("epsg") && crs.includes(":25829")) {
    projection =
      "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25830")) {
    projection =
      "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25831")) {
    projection =
      "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25832")) {
    projection =
      "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25833")) {
    projection =
      "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25834")) {
    projection =
      "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25835")) {
    projection =
      "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":25836")) {
    projection =
      "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32631")) {
    projection = "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32632")) {
    projection = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32633")) {
    projection = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32634")) {
    projection = "+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32635")) {
    projection = "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs";
  } else if (crs.includes("epsg") && crs.includes(":32636")) {
    projection = "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs";
  }
  return projection;
};

export default getProjection;
