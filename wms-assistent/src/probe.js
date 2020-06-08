import json_api from "./FeatureInfo/json_api";
import wms_api from "./FeatureInfo/wms_api";

// Naive format detection
const firstChar2Format = {
  "[": json_api,
  "{": json_api,
  "<": wms_api
};

export async function probe(url) {
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
    r.response = res;
    r.status = response.status;
    r.statusText = response.statusText;
  } catch (e) {
    r.status = 600;
    r.statusText = e.message;
  }
  return r;
}

async function probe_wms(uri) {
  var r = await probe(uri.toString());
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

export async function getFeatureInfo(url) {
  try {
    var uri = new URL(url);
  } catch (e) {
    return { status: 900, statusText: e.message };
  }
  if ((uri.searchParams.get("service") || "").toUpperCase() == "WMS")
    return await probe_wms(uri);
  const r = await probe(uri);
  console.log("xxxxr", r);
  return r.response || r;
}
