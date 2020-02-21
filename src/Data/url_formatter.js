export default function url_formatter(url, lat, lng) {
  url += "&request=GetFeatureInfo";
  url += "&service=WMS";
  url = url.replace("{x}", "&x=" + lng);
  url = url.replace("{y}", "&y=" + lat);
  url = url.replace("{lng}", lng);
  url = url.replace("{lat}", lat);
  return url;
}
