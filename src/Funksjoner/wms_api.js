import XML from "pixl-xml";

// WMS XML API
const wms_api = {
  parse: text => XML.parse(text)
};

export default wms_api;
