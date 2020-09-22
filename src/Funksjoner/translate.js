const layerKeys = {
  arealressursar5: "arealressurs",
  bioklimatiskseksjon: "bioklimatiskseksjon",
  bioklimatisksone: "bioklimatisksone",
  arterfredete: "arter",
  arterfremmedearter2018: "arter",
  arterprioriterte: "arter",
  arterrødlista: "arter",
  arteravnasjonalforvaltningsinteresse: "arter",
  berggrunnn250: "berggrunn",
  berggrunnn50: "berggrunn",
  breerinorge: "breer",
  elvenettelvis: "elvenett",
  fiskereguleringerogvern: "fiskeregulering",
  flomsoner: "flomsoner"
};

const infoboxKeys = {
  arealressurs: {
    enkel_beskrivelse: "Enkel beskrivelse",
    vanlig_beskrivelse: "Vanlig beskrivelse",
    artreslag_beskrivelse: "Artreslag beskrivelse"
  },
  arter: {
    navn: "Navn",
    vitenskapelig_navn: "Vitenskapelig navn",
    kriterier_kombinert: "Kombinert kriterier",
    norsknavn: "Norsk navn",
    species: "Species",
    gmlname: "Type"
  },
  berggrunn: {
    hbergnavn: "Bergnavn",
    gmlname: "Type"
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
  breer: {
    hovedbrenavn: "Hovedbrenavn",
    brenavn: "Brenavn",
    shape: "Form type",
    productid: "Produkt ID",
    proc_desc: "Prosedyr",
    datafangstdato: "Datafangstdato",
    areal_km2: "Areal (km²)"
  },
  elvenett: {
    objtype: "Objekt type",
    elvehierarki: "Elvehierarki",
    elvenavn: "Elvenavn"
  },
  fiskeregulering: {
    gmlname: "Navn"
  },
  flomsoner: {
    objekttype: "Objekt type",
    flomsonenavn: "Flomsone navn",
    kartlagteflommer: "Kartlagte flommer",
    gjentaksinterval: "Gjentaksinterval"
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
