//import XML from "pixl-xml";
// npm i fast-xml-parser
//const { XMLValidator} = require("../src/fxp");
//fast-xml-parser
//const XMLParser = require('fast-xml-parser')
//const parser = new XMLParser();

//import { XMLParser } from 'fast-xml-parser';
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
/*
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
};*/

export default wms_api;
