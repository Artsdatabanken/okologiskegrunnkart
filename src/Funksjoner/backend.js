class Backend {
  static async getPromise(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(result => {
          if (result && result.status === 200) {
            return result.json();
          }
        })
        .then(json => resolve(json))
        .catch(err => {
          console.error(url, err);
          return {};
        });
    });
  }

  static async hentPunkt(lng, lat) {
    return this.getPromise(
      `https://punkt.artsdatabanken.no/v1/punkt?lng=${lng}&lat=${lat}`
    );
  }

  static async hentStedsnavn(lng, lat) {
    return this.getPromise(
      `https://stedsnavn.artsdatabanken.no/v1/punkt?lng=${lng}&lat=${lat}`
    );
  }
  static async wmsFeatureInfo(url, lat, lng, delta = 0.01) {
    // https://ahocevar.com/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=ne%3Ane&LAYERS=ne%3Ane&INFO_FORMAT=text%2Fhtml&I=67&J=192&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=0%2C0%2C20037508.342789244%2C20037508.342789244

    const url1 =
      url + `&bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    // https://ahocevar.com/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=ne%3Ane&LAYERS=ne%3Ane&INFO_FORMAT=text%2Fhtml&I=67&J=192&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=0%2C0%2C20037508.342789244%2C20037508.342789244
    return new Promise((resolve, reject) => {
      fetch(url1, {
        headers: {}
      })
        .then(result => {
          if (result && result.status === 200) {
            result.text().then(text => resolve({ url: url1, text: text }));
          }
        })
        .catch(err => {
          console.error(url, err);
          reject();
        });
    });
  }
}
export default Backend;
