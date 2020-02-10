const layers = {
  løsmasse:
    "https://geo.ngu.no/mapserver/LosmasserWMS?service=wms&version=1.1.1&srs=EPSG:4326&layers=Losmasse_flate&query_layers=Losmasse_flate&info_format=application/vnd.ogc.gml&height=921&width=1920&{x}&{y}",
  laksefjord:
    "https://ogc.fiskeridir.no/wms.ashx?service=wms&version=1.1.1&srs=EPSG:4326&layers=layer_388&query_layers=layer_388&info_format=application/vnd.ogc.gml&height=921&width=1920&{x}&{y}",
  naturtype:
    "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_nin/MapServer/WMSServer?version=1.1.1&layers=naturtyper_nin_alle&query_layers=naturtyper_nin_alle&srs=EPSG%3A4326&height=921&width=1920",
  naturvern:
    "https://kart.miljodirektoratet.no/arcgis/services/vern/MapServer/WmsServer?VERSION=1.3.0&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=naturvern_omrade&query_layers=naturvern_omrade&info_format=application/vnd.ogc.wms_xml&CRS=EPSG%3A4326&STYLES=&WIDTH=2880&HEIGHT=1289",
  arealtype:
    "https://wms.nibio.no/cgi-bin/ar50?version=1.1.0&srs=EPSG:4326&feature_count=1&info_format=application/vnd.ogc.gml&layers=Arealtyper&query_layers=Arealtyper&x=699&y=481&height=921&width=1920",
  livsmiljø:
    "https://wms.nibio.no/cgi-bin/skogbruksplan?version=1.1.0&srs=EPSG:4326&feature_count=1&info_format=application/vnd.ogc.gml&layers=Livsmiljoer&query_layers=Livsmiljoer&x=699&y=481&height=921&width=1920",
  vassdrag:
    "https://gis3.nve.no/map/services/VerneplanforVassdrag/MapServer/WmsServer?QUERY_LAYERS=VerneplanforVassdrag&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326",
  landskap:
    "https://wms.artsdatabanken.no/?map=/maps/mapfiles/la.map&version=1.1.1&width=256&height=256&INFO_FORMAT=gml&QUERY_LAYERS=LA&layers=LA&srs=EPSG%3A4326&{x}&{y}"
};

export default layers;
