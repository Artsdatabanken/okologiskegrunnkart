export default function url_formatter(url, lat, lng, delta = 0.01) {
  url = url.replace(/{x}/gi, "&x=" + lng);
  url = url.replace(/{y}/gi, "&y=" + lat);
  url = url.replace(/{lng}/gi, lng);
  url = url.replace(/{lat}/gi, lat);
  url = url.replace(
    /{bbox}/gi,
    `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  );
  return url;
}
