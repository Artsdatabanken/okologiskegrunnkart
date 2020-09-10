import json_api from "./FeatureInfo/json_api";
import wms_api from "./FeatureInfo/wms_api";

// Naive format detection
const firstChar2Format = {
  "[": json_api,
  "{": json_api,
  "<": wms_api
};

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

export async function probe(layer, url) {
  var r = { url: url };
  try {
    const response = await fetch(url);
    var contentType = response.headers.get("content-type");
    contentType = contentType.split(";")[0];
    r.contentType = contentType;
    const text = await response.text();
    const api = firstChar2Format[text[0]] || json_api;
    var res = api.parse(text);
    res = res.FIELDS || res;
    if (layer.wmsinfoformat === "application/vnd.esri.wms_raw_xml") {
      res = modifyXmlResponse(res);
    }
    r.response = res;
    r.status = response.status;
    r.statusText = response.statusText;
  } catch (e) {
    r.status = 600;
    r.statusText = e.message;
  }
  return r;
}

async function probe_wms(layer, uri) {
  var r = await probe(layer, uri.toString());
  if (r.status === 200) {
    const response = r.response;
    if (response.ServiceException) {
      r.status = response.ServiceException.code;
      r.statusText = response.ServiceException._Data;
    }
  }

  return { ...r.response, ...r };
}

export async function getCapabilities(url) {
  try {
    var uri = new URL(url);
  } catch (e) {
    return { status: 900, statusText: e.message };
  }
  if (!uri.searchParams.get("request"))
    uri.searchParams.set("request", "GetCapabilities");
  if (!uri.searchParams.get("service")) uri.searchParams.set("service", "WMS");

  return probe_wms(uri);
}

export async function getFeatureInfo(layer, url) {
  try {
    var uri = new URL(url);
  } catch (e) {
    return { status: 900, statusText: e.message };
  }
  if ((uri.searchParams.get("service") || "").toUpperCase() === "WMS")
    return await probe_wms(layer, uri);
  const r = await probe(layer, uri);
  return r.response || r;
}
