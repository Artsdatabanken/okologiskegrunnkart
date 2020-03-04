import XML from "pixl-xml";

// WMS XML API 
const wms_api = {
    makeUrl: (url, lat, lng, delta = 0.01) => url + `&bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    parse: async response => XML.parse(await response.text())
}

export default wms_api;
