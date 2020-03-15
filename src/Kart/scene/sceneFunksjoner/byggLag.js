import lagTegner from "./lagTegner";

export default function byggLag(lag, config) {
  if (!lag.kart) lag.kart = {};
  if (!lag.kart.format) lag.kart.format = {};
  if (!lag.kart.aktivtFormat)
    lag.kart.aktivtFormat = Object.keys(lag.kart.format)[0];
  const viz = lag.kart.format[lag.kart.aktivtFormat];
  // console.log( "visualiseringen er: ", viz)
  if (!viz) return console.warn("No visualisation availiable for " + lag.url);
  let drawArgs = {
    kode: lag.kode,
    bbox: lag.bbox,
    aktivtFormat: lag.kart.aktivtFormat,
    format: lag.kart.format,
    opacity: lag.opacity || "1",
    blendmode: lag.blendmode || "overlay"
  };

  lagTegner(drawArgs, config);
}
