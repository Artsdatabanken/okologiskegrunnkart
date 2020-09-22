const layerKeys = {
  ArealressursAR5: "arealressurs",
  Bioklimatiskseksjon: "bioklimatiskseksjon"
};
const infoboxKeys = {
  arealressurs: {
    enkel_beskrivelse: "Enkel beskrivelse",
    vanlig_beskrivelse: "Vanlig beskrivelse",
    artreslag_beskrivelse: "Artreslag beskrivelse"
  },
  bioklimatiskseksjon: {
    nb: "Tittel",
    v: "PCA1"
  }
};

function translateInfobox(string, layertittle, key) {
  let layerkey = layertittle.replace(/:/g, "");
  layerkey = layerkey.replace(/-/g, "");
  layerkey = layerkey.replace(/ /g, "");
  const sublayer = layerKeys[layerkey];
  if (!sublayer) return string;
  let result = infoboxKeys[sublayer];
  if (!result) return string;
  result = result[key];
  if (!result) return string;
  return result;
}

export { translateInfobox };
