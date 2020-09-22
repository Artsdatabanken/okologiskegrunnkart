const layerKeys = {
  arealressursar5: "arealressurs",
  bioklimatiskseksjon: "bioklimatiskseksjon",
  bioklimatisksone: "bioklimatisksone",
  arterfredete: "arter",
  arterprioriterte: "arter",
  arterrødlista: "arter"
};

const infoboxKeys = {
  arealressurs: {
    enkel_beskrivelse: "Enkel beskrivelse",
    vanlig_beskrivelse: "Vanlig beskrivelse",
    artreslag_beskrivelse: "Artreslag beskrivelse"
  },
  bioklimatiskseksjon: {
    tittelnb: "Tittel",
    v: "PCA1",
    beskrivelsenb: "Beskrivelse"
  },
  bioklimatisksone: {
    tittelnb: "Tittel",
    v: "PCA2",
    beskrivelsenb: "Beskrivelse"
  },
  arter: {
    navn: "Navn",
    vitenskapelig_navn: "Vitenskapelig navn",
    kriterier_kombinert: "Kombinert kriterier",
    norsknavn: "Norsk navn",
    species: "Species",
    gmlname: "Type"
  }
};

function translateInfobox(string, layertittle, key) {
  layertittle = layertittle.toLowerCase();
  key = key.toLowerCase();
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
