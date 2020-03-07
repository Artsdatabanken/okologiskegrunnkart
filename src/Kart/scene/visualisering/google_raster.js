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
  console.warn(url);
  return {
    type: "Raster",
    url: url,
    max_zoom: zoom[1]
  };
}

function lagStyle(format, drawArgs) {
  return {
    name: "googleshade",
    value: {
      base: "raster",
      shaders: {
        blocks: {
          color: `
            color.rgb = sampleRaster(0).rgb;
            color.a=1.0;
    `
        }
      }
    }
  };
}

export default { drawAll, lagSource, lagStyle };
