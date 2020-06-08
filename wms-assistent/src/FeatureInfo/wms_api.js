import XML from "pixl-xml";

// WMS XML API
const wms_api = {
  parse: text => {
    try {
      if (!text) return {};
      return XML.parse(text);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};

export default wms_api;
