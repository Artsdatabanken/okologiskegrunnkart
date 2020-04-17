import json_api from "./json_api";
import wms_api from "./wms_api";

class Backend {
  static async getPromise(url) {
    try {
      const response = await fetch(url, {
        method: "get",
        headers: {
          Accept: "application/json"
        }
      });
      const json = await response.json();
      return json;
    } catch (e) {
      console.error(url, e);
      return null;
    }
  }

  static async hentLokalFil(filnavn) {
    return this.getPromise("/" + filnavn);
  }

  static async hentStedsnavn(lng, lat) {
    return this.getPromise(
      `https://stedsnavn.artsdatabanken.no/v1/punkt?lng=${lng}&lat=${lat}`
    );
  }

  static async hentSteder(bokstav) {
    return this.getPromise(
      `https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=${bokstav}*&antPerSide=5&eksakteForst=true&epsgKode=4326`
    );
  }

  static async hentFylkePolygon(nr) {
    return this.getPromise(
      `https://forvaltningsportalapi.test.artsdatabanken.no/rpc/fylke?nummer=` +
        nr +
        ""
    );
  }

  static async hentFylker() {
    return this.getPromise(`https://ws.geonorge.no/kommuneinfo/v1/fylker`);
  }

  static async hentKommuner() {
    return this.getPromise(`https://ws.geonorge.no/kommuneinfo/v1/kommuner`);
  }

  static async hentKommunePolygon(nr) {
    return this.getPromise(
      `https://ws.geonorge.no/kommuneinfo/v1/kommuner/` + nr + "/omrade"
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

    function collapseLayerFeature(i) {
      const layerKey = Object.keys(i).find(e => e.endsWith("_layer"));
      if (!layerKey) return i;
      i = i[layerKey];
      const featureKey = Object.keys(i).find(e => e.endsWith("_feature"));
      if (!featureKey) return i;
      return i[featureKey];
    }

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.status !== 200)
            return reject("HTTP status " + response.status);
          response.text().then(text => {
            const api = text[0] === "{" ? json_api : wms_api;
            var res = api.parse(text);
            res = res.FIELDS || res;
            res = collapseLayerFeature(res);
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
