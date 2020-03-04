export default function url_formatter(url, lat, lng, delta = 0.01) {
  url = url.replace("{x}", "&x=" + lng);
  url = url.replace("{y}", "&y=" + lat);
  url = url.replace("{lng}", lng);
  url = url.replace("{lat}", lat);
  url = url.replace("{bbox}", `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`);
  return url;
}
