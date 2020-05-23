function drawAll({ kode, order }) {
  return {
    [kode]: {
      draw: {
        [kode]: {
          order: order
        }
      },
      data: { source: kode }
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

function lagStyle(format, { kode, blendmode }) {
  return {
    name: kode,
    value: {
      base: "raster",
      blend: blendmode
    }
  };
}

export default { drawAll, lagSource, lagStyle };
