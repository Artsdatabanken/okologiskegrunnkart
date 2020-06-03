export function plukkForetrukketFormat(formats) {
  const preferred = [
    "application/vnd.ogc.gml",
    "application/vnd.ogc.wms_xml",
    "text/xml",
    "application/vnd.esri.wms_featureinfo_xml",
    "application/vnd.esri.wms_raw_xml",
    "application/geojson",
  ];

  formats = formats.reduce((acc, e) => {
    acc[e] = true;
    return acc;
  }, {});
  for (var pref of preferred) if (formats[pref]) return pref;
  console.warn("Unable to decide format", formats);
}

export function selectCrs(capability) {
  var crs = capability.Layer.CRS || capability.Layer.SRS;
  if (crs.constructor !== Array) crs = crs.split(" ");
  const preferred = ["EPSG:3857", "EPSG:900913"];

  crs = crs.reduce((acc, e) => {
    acc[e] = true;
    return acc;
  }, {});
  for (var pref of preferred) if (crs[pref]) return pref;
  console.warn("Unable to pick a good crs", crs);
}

export function computeLegendUrl(layer, underlag) {
  console.log(layer);
  const url = new URL(layer.wmsurl);
  url.searchParams.set("version", layer.wmsversion);
  url.searchParams.set("service", "WMS");
  url.searchParams.set("request", "GetLegendGraphic");
  url.searchParams.set("layer", underlag.wmslayer);
  url.searchParams.set("format", "image/png");
  console.log(url.toString());
  return url.toString();
}
