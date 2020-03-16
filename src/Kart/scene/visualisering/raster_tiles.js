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

function lagSource({ url, zoom }, drawArgs) {
  return {
    type: "Raster",
    url: url.replace("{gkt}", drawArgs.token),
    max_zoom: zoom[1]
  };
}

function lagStyle(format) {
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
