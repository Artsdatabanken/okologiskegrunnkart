import XML from "pixl-xml";

// WMS XML API
const wms_api = {
  parse: async response => XML.parse(await response.text())
};

export default wms_api;
