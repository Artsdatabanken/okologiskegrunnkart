import json_api from "./json_api";
import wms_api from "./wms_api";

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

  static async hentStedsnavn(lng, lat) {
    return this.getPromise(
      `https://stedsnavn.artsdatabanken.no/v1/punkt?lng=${lng}&lat=${lat}`
    );
  }

  static async getFeatureInfo(url) {
    const boringkeys = [
      "gml:boundedBy",
      "gml:Box",
      "srsName",
      "gml:coordinates",
      "xmlns",
      "xmlns:gml",
      "xmlns:xlink",
      "xmlns:xsi",
      "xsi:schemaLocation",
      "version"
    ];

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.status !== 200)
            return reject("HTTP status " + response.status);
          response.text().then(text => {
            const api = text[0] === "{" ? json_api : wms_api;
            var res = api.parse(text);
            res = res.FIELDS || res;
            for (var key of boringkeys) delete res[key];
            resolve(res);
          });
        })
        .catch(err => {
          console.error(url, err);
          reject(err);
        });
    });
  }
}

export default Backend;
