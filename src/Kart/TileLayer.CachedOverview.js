import L from "leaflet";

L.TileLayer.CachedOverview = L.TileLayer.WMS.extend({
  getTileUrl: function(coords) {
    if (coords.z <= this.options.zoomThreshold) {
      // We should have this cached..
      const host = window.location.host;
      let apiSettings = "https://data.test.artsdatabanken.no";
      if (host === "okologiskegrunnkart.artsdatabanken.no") {
        apiSettings = "https://data.artsdatabanken.no";
      }
      var url = `${apiSettings}/grunnkart/${this.options.id}.mbtiles/${coords.z}/${coords.x}/${coords.y}?nocontent=false`;
      return url;
    }
    return L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
  }
});

L.tileLayer.cachedOverview = function(url, options) {
  const layer = new L.TileLayer.CachedOverview(url, options);
  return layer;
};
