import json_api from './json_api'
import wms_api from './wms_api'

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

  static async featureInfo(protokoll, url, lat, lng, delta = 0.01) {
    const api = protokoll === "json" ? json_api : wms_api
    url = api.makeUrl(url, lat, lng, delta)
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.status !== 200)
            return reject("HTTP status " + response.status)
          api.parse(response).then(res => {
            res.url = url;
            resolve(res);
          })
        })
        .catch(err => {
          console.error(url, err);
          reject(err);
        });
    });
  }
}

export default Backend;
