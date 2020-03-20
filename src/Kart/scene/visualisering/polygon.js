import tinycolor from "tinycolor2";
import sysconfig from "../../../Funksjoner/config";

function drawAll(drawArgs) {
  const { kode, barn, farge, visBarn, visEtiketter } = drawArgs;
  const layer = {};
  if (visBarn) {
    barn.forEach(dac => {
      let barnkode = dac.kode;
      if (dac.hasOwnProperty("erSynlig") && !dac.erSynlig) return;
      const visEtiketter = barnkode;
      layer[barnkode] = draw({
        kode: barnkode,
        forelderkode: kode,
        farge: dac.farge,
        visEtiketter: visEtiketter
      });
    });
  }
  layer[sysconfig.hack(kode)] = draw({
    kode: kode,
    forelderkode: kode,
    farge: farge,
    visEtiketter: visEtiketter
  });

  return {
    [kode]: { layer, data: { source: kode, layer: "polygons" } }
  };
}

function draw(args) {
  let { kode, farge, visEtiketter } = args;
  const layer = {
    draw: {
      mu_polygons: {
        order: 800,
        color: tinycolor(farge).toHexString()
      },
      lines: {
        order: 800,
        color: tinycolor(farge)
          .darken(50)
          .toHexString(),
        width: "1.0px"
      },
      po: {
        size: 500,
        collide: true,
        color: farge
      }
    }
  };
  layer.filter = { code: sysconfig.hack(kode) };

  if (visEtiketter) {
    layer.draw.text = {
      text_source: ["name", "title"],
      font: {
        family: "Roboto",
        fill: "hsla(0, 0%, 100%, 1.0)",
        stroke: { color: "hsla(0, 0%, 0%, 0.7)", width: 2 },
        size: "13px"
      }
    };
  }
  return layer;
}

function lagSource({ url, zoom }, { bbox }) {
  return sysconfig.createTileSource(url, "MVT", zoom, bbox);
}

export default { drawAll, lagSource };
