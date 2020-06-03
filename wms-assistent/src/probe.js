import XML from "pixl-xml";

export async function probe(url) {
  var r = { url: url };
  try {
    //console.log('probing', r)
    const response = await fetch(url);
    var contentType = response.headers.get("content-type");
    contentType = contentType.split(";")[0];
    r.status = response.status;
    r.statusText = response.statusText;
    r.contentType = contentType;
    r.response = response;
    //console.log('probed', r)
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
    delete r.response;
    const text = await response.text();
    const doc = XML.parse(text);
    if (doc.ServiceException) {
      r.status = doc.ServiceException.code;
      r.statusText = doc.ServiceException._Data;
    }
    r = { ...r, ...doc };
  }
  return r;
}

async function getCapabilities(url) {
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
  return probe_wms(uri);
}

export default getCapabilities;
