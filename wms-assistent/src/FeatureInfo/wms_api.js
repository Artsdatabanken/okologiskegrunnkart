/*
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
*/

var XMLParser = require("react-xml-parser");
const parser = new XMLParser();
// WMS XML API
const wms_api = {
  parse: text => {
    try {
      if (!text) return {};
      return parser.parseFromString(text);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};
export default wms_api;
