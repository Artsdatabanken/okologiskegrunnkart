import L from "leaflet";

L.TileLayer.CachedOverview = L.TileLayer.WMS.extend({
  getTileUrl: function(coords) {
    console.log(coords.z, "<", this.options.zoomThreshold);
    if (coords.z <= this.options.zoomThreshold) {
      // We should have this cached..
      var url = `https://data.test.artsdatabanken.no/grunnkart/${this.options.id}.mbtiles/${coords.z}/${coords.x}/${coords.y}`;
      console.log({ url });
      console.log({ dat: this });
      return url;
    }
    return L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
  }
  //    getAttribution: function () {
  //        return "<a href='https://placekitten.com/attribution.html'>PlaceKitten</a>"
  //    }
});

L.tileLayer.cachedOverview = function(url, options) {
  const layer = new L.TileLayer.CachedOverview(url, options);
  return layer;
};
