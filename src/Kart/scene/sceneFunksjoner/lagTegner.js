import draw from "../visualisering/draw";

export default function lagTegner(drawArgs, config) {
  const renderer = draw[drawArgs.aktivtFormat];
  const format = drawArgs.format[drawArgs.aktivtFormat];
  console.log("dadada", drawArgs.aktivtFormat);
  drawArgs.format = format;
  if (!renderer) {
    console.warn("Unknown kart format", drawArgs.aktivtFormat);
    return;
  }
  console.log("fadada", drawArgs.aktivtFormat);
  const source = renderer.lagSource(format, drawArgs);
  console.log("qadada", source);

  if (renderer.lagStyle) {
    const style = renderer.lagStyle(format, drawArgs);
    config.styles[style.name] = style.value;
  }
  config.sources[drawArgs.kode] = source;
  config.layers = Object.assign(config.layers, renderer.drawAll(drawArgs));
}
