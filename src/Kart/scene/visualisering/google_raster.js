import tinycolor from "tinycolor2";

function drawAll() {
  return {
    google: {
      draw: {
        googleshade: {
          order: 0
        }
      },
      data: { source: "bakgrunnskart" }
    }
  };
}

function lagSource({ url, zoom }) {
  return {
    type: "Raster",
    url: url,
    max_zoom: zoom[1]
  };
}

function lagStyle(format, drawArgs) {
  const tint = tinycolor(format.tint);
  const tintar = [tint._r / 255, tint._g / 255, tint._b / 255, 1.0 - tint._a];

  return {
    name: "googleshade",
    value: {
      base: "raster",
      shaders: {
        uniforms: { tint: tintar },
        blocks: {
          color: `
            color.rgb = sampleRaster(0).rgb;
            color.rgb *= tint.rgb;
            color.rgb = mix(color.rgb,vec3(1.),tint.a);
    `
        }
      }
    }
  };
}

export default { drawAll, lagSource, lagStyle };
