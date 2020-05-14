function getFeatureInfos(map, latlng) {
  var point = map.latLngToContainerPoint(latlng, map.getZoom()),
    size = map.getSize(),
    bounds = map.getBounds(),
    sw = bounds.getSouthWest(),
    ne = bounds.getNorthEast();
  var params = {
    lat: latlng.lat,
    lng: latlng.lng,
    request: "GetFeatureInfo",
    service: "WMS",
    crs: "EPSG:4326",
    srs: "EPSG:4326",
    //version: layer._wmsVersion,
    bbox: [sw.lng, sw.lat, ne.lng, ne.lat],
    height: size.y,
    width: size.x
    //layers: layer.options.layers,
    //query_layers: layer.options.layers,
    //info_format: 'application/vnd.ogc.gml'  TODO: Fra GetCapabilities
    //info_format: 'text/xml'
  };
  params.x = point.x;
  params.i = point.x;
  params.y = point.y;
  params.j = point.y;
  params.zoom = map.getZoom();
  return params;
}

export default getFeatureInfos;
