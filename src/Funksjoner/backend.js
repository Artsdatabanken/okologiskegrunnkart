import json_api from "./json_api";
import wms_api from "./wms_api";
import { getFeatureInfoUrl } from "./url_formatter";

class Backend {
  static async getPromise(url) {
    try {
      const response = await fetch(url, {
        method: "GET",
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

  static async getPromiseText(url) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      const json = await response.text();
      return json;
    } catch (e) {
      console.error(url, e);
      return null;
    }
  }

  static async hentLokalFil(filnavn) {
    try {
      const response = await fetch(filnavn, {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        cache: "no-cache"
      });
      const json = await response.json();
      return json;
    } catch (e) {
      console.error(filnavn, e);
      return null;
    }
  }

  static async hentStedsnavn(lng, lat, zoom) {
    const host = window.location.host;
    let apiSettings = "https://okologiskegrunnkartapi.test.artsdatabanken.no";
    if (host === "okologiskegrunnkart.artsdatabanken.no") {
      apiSettings = "https://okologiskegrunnkartapi.artsdatabanken.no";
    }
    return this.getPromise(
      `${apiSettings}/rpc/stedsnavn?lng=${lng}&lat=${lat}&zoom=${zoom}`
    );
  }

  static async hentHoydedata(lng, lat) {
    const host = window.location.host;
    let apiSettings = "https://okologiskegrunnkartapi.test.artsdatabanken.no";
    if (host === "okologiskegrunnkart.artsdatabanken.no") {
      apiSettings = "https://okologiskegrunnkartapi.artsdatabanken.no";
    }
    return this.getPromise(
      `${apiSettings}/rpc/elevasjon?lat=${lat}&lng=${lng}`
    );
  }

  static async hentKommune(knr) {
    return this.getPromise(
      `https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=t*&fylkeKommuneListe=${knr}&antPerSide=1&epsgKode=4326`
    );
  }

  static async hentSteder(bokstav, side = 0, numberPerPage = 20) {
    return this.getPromise(
      `https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=${bokstav}*&eksakteForst=true&antPerSide=${numberPerPage}&epsgKode=4326&side=${side}`
    );
  }

  static async hentAdresse(bokstav, side = 0, numberPerPage = 20) {
    return this.getPromise(
      `https://ws.geonorge.no/adresser/v1/sok?sok=${bokstav}&treffPerSide=${numberPerPage}&side=${side}`
    );
  }

  static async getUserManualWiki() {
    return this.getPromiseText(
      `https://raw.githubusercontent.com/wiki/Artsdatabanken/okologiskegrunnkart/Brukermanual.md`
    );
  }

  static async getAboutPageWiki() {
    return this.getPromiseText(
      `https://raw.githubusercontent.com/wiki/Artsdatabanken/okologiskegrunnkart/Om-"Økologiske-grunnkart".md`
    );
  }

  static async hentKnrGnrBnr(knr, gnr, bnr, side = 0, numberPerPage = 20) {
    let url = "https://ws.geonorge.no/adresser/v1/sok?";
    if (knr) {
      url += "kommunenummer=" + knr.replace(/[^0-9]/g, "");
    }
    if (gnr) {
      if (knr) {
        url += "&";
      }
      url += "gardsnummer=" + gnr.replace(/[^0-9]/g, "");
    }
    if (bnr) {
      if (gnr || knr & !gnr) {
        url += "&";
      }
      url += "bruksnummer=" + bnr.replace(/[^0-9]/g, "");
    }

    url += `&treffPerSide=${numberPerPage}&side=${side}`;
    return this.getPromise(url);
  }

  // static async hentAdressePunktSok(lng, lat, radius) {
  //   return this.getPromise(
  //     `https://ws.geonorge.no/adresser/v1/punktsok?radius=${radius}&lat=${lat}&lon=${lng}`
  //   );
  // }

  static async hentAdresseSok(knr, gnr, bnr) {
    return this.getPromise(
      `https://ws.geonorge.no/adresser/v1/sok?kommunenummer=${knr}&gardsnummer=${gnr}&bruksnummer=${bnr}&treffPerSide=100`
    );
  }

  static async hentMatrikkel(lng, lat) {
    const host = window.location.host;
    let apiSettings = "https://okologiskegrunnkartapi.test.artsdatabanken.no";
    if (host === "okologiskegrunnkart.artsdatabanken.no") {
      apiSettings = "https://okologiskegrunnkartapi.artsdatabanken.no";
    }
    return this.getPromise(`${apiSettings}/rpc/punkt?lat=${lat}&lng=${lng}`);
  }

  static async getFeatureInfo(layer, sublayer, coords) {
    var url = getFeatureInfoUrl(layer, sublayer, coords);
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

    // TODO: Fjernes når alle lag er oppdatert i django
    function collapseLayerFeature(i) {
      const layerKey = Object.keys(i).find(e => e.endsWith("_layer"));
      if (!layerKey) return i;
      const sub = i[layerKey];
      const featureKey = Object.keys(sub).find(e => e.endsWith("_feature"));
      if (!featureKey) return { ...i, ...sub };
      return { ...i, ...i[featureKey] };
    }

    // Modify response JSON if info format is "application/vnd.esri.wms_raw_xml"
    function modifyXmlResponse(response) {
      let res = response["esri_wms:FeatureInfoCollection"];
      let result;
      if (!res) return response;
      if (Array.isArray(res)) {
        for (const item of res) {
          const tempRes = modifyObject(item);
          result = { ...result, ...tempRes };
        }
      } else {
        result = modifyObject(res);
      }
      return result;
    }

    function modifyObject(object) {
      const layerName = object.layername;
      let content = object["esri_wms:FeatureInfo"];
      if (!layerName || !content) return object;
      let contentResult = {};
      content = content["esri_wms:Field"];
      if (!content) return object;
      if (Array.isArray(content) && content.length > 0) {
        for (const item of content) {
          const name = item["esri_wms:FieldName"];
          const value = item["esri_wms:FieldValue"];
          contentResult = { ...contentResult, [name]: value };
        }
      }
      const result = { [layerName]: contentResult };
      return result;
    }

    // Naive format detection
    const firstChar2Format = {
      "[": json_api,
      "{": json_api,
      "<": wms_api
    };

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.status !== 200)
            return reject("HTTP status " + response.status);
          response.text().then(text => {
            const api = firstChar2Format[text[0]] || json_api;
            var res = api.parse(text);
            res = res.FIELDS || res;
            res = collapseLayerFeature(res);
            if (layer.wmsinfoformat === "application/vnd.esri.wms_raw_xml") {
              res = modifyXmlResponse(res);
            }
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
