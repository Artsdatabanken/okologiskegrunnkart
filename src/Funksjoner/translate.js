// NOTE: layerkeys are the kartlag name, converted to
// lower case and with all spaces, `-`and `:` symbols removed.
// For example, `Arter - fredete` becomes `arterfredete`.
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
  flomsoner: "flomsoner",
  grusogpukk: "grus",
  gyteområder: "gyteområder",
  innsjødatabase: "innsjødatabase",
  kulturlandskaputvalgte: "kulturlandskap",
  kulturlandskapverdifulle: "kulturlandskap",
  kulturminnerlokaliteter: "kulturminner",
  landskapnin: "landskapnin",
  livsmiljøer: "livsmiljøer",
  løsmasse: "løsmasse",
  maringrense: "marin",
  marinleiremuligforekomst: "marin",
  marinebunnsedimenter: "marin",
  naturtyperutvalgte: "naturtyper",
  naturvernområder: "naturvern",
  naturvernområderforeslåtte: "naturvern",
  nedbørfelt: "nedbørfelt",
  nøkkelbiotoper: "nøkkelbiotoper",
  ramsaromrader: "ramsaromrader",
  skredtype: "skredtype",
  vannforekomster: "vannforekomster",
  vannkraftikkeutbygd: "vannkraft",
  vannkraftutbygd: "vannkraft",
  verneplanforvassdrag: "verneplan",
  vernskog: "vernskog",
  villreinområder: "villreinområder",
  ultramafiskebergarter: "berggrunn",
  kalkinnholdberggrunn: "berggrunn",
  korallrev: "marinedata",
  sårbarehabitatmarint: "marinedata"
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
    gmlname: "Type",
    scientificname: "Vitenskapelig navn"
  },
  berggrunn: {
    hbergnavn: "Bergart",
    gmlname: "Type",
    hovedbergart_tekst: "Bergart",
    tilleggsbergart1_tekst: "Tilleggsbergart",
    tilleggsbergart2_tekst: "Tilleggsbergart 2",
    tilleggsbergart3_tekst: "Tilleggsbergart 3",
    dekkekompleks_tekst: "Dekkekompleks",
    dekke_tekst: "Dekke",
    gruppe_tekst: "Gruppe",
    dannelsesminalder_tekst: "Dannelsesalder, minimum",
    ultramafisk: "Ultramafisk",
    kalkinnhold_hovedbergart: "Kalkinnhold hovedbergart",
    kalkinnhold_tillegsbergart1: "Kalkinnhold tilleggsbergart",
    kalkinnhold_tillegsbergart2: "Kalkinnhold tilleggsbergart 2",
    kalkinnhold_tillegsbergart3: "Kalkinnhold tilleggsbergart 3"
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
    objtype: "Objekttype",
    elvehierarki: "Elvehierarki",
    elvenavn: "Elvenavn"
  },
  fiskeregulering: {
    gmlname: "Navn"
  },
  flomsoner: {
    objekttype: "Objekttype",
    flomsonenavn: "Flomsone navn",
    kartlagteflommer: "Kartlagte flommer",
    gjentaksinterval: "Gjentaksintervall"
  },
  grus: {
    navn: "Navn",
    srsName: "Projeksjonsnavn",
    gmlcoordinates: "Koordinater"
  },
  gyteområder: {
    gmlname: "Navn",
    stedsnavn: "Stedsnavn"
  },
  innsjødatabase: {
    navn: "Navn",
    objtype: "Objekt type",
    dybde_m: "Dybde(m)"
  },
  kulturlandskap: {
    navn: "Navn",
    objtype: "Objekttype"
  },
  kulturminner: {
    navn: "Navn",
    kulturminneLokalitetArt: "Kulturminne Lokalitet",
    informasjon: "Informasjon"
  },
  landskapnin: {
    name: "Navn",
    area: "Areal (m²)"
  },
  livsmiljøer: {
    hkl_klasse: "Klasse",
    vegtype_beskr: "Vegtype beskrivelse",
    topografi: "Topografi",
    livsm_beskr: "Livsmiljø beskrivelse",
    gmlname: "Type"
  },
  løsmasse: {
    losmassetype_tekst: "Løsmassetype",
    objekttype: "Objekttype"
  },
  marin: {
    annkvtema_navn: "Navn",
    objekttype: "Objekttype",
    losmassetype_tekst: "Løsmassetype",
    losmasse_text: "Løsmasse",
    muligmarinleire_text: "Mulig marin leire",
    jordart: "Jordart", // ???`
    sedimentkornst: "Sediment kornstørrelse", // ???
    1: "Sedimentasjon", // ???
    gmlname: "Type"
  },
  naturtyper: {
    denavn: "Navn"
  },
  naturvern: {
    offisieltnavn: "Offisielt navn",
    verneplan: "Verneplan",
    navn: "Navn",
    verneform: "Verneform",
    objekttype: "Objekttype"
  },
  nedbørfelt: {
    navnnedbf: "Navn felt",
    navnvassomr: "Navn område",
    navn1orden: "Navn 1 orden", // ???
    navnofelt: "Navn o felt", // ???
    areal: "Areal (km²)",
    arealtotal: "Areal (km²)",
    areal_km2: "Areal (km²)"
  },
  nøkkelbiotoper: {
    forv_besk: "Beskrivelse",
    opphav: "Opphav", // ???
    areal: "Areal (km²)"
  },
  ramsaromrader: {
    norsknavn: "Norsk navn",
    debeskrivelse: "Beskrivelse"
  },
  skredtype: {
    skredtype: "Skredtype",
    skrednavn: "Skred navn",
    skredtidspunkt: "Skred tidspunkt"
  },
  vannforekomster: {
    vannforekomstnavn: "Vannforekomst navn",
    økologisk_tilstand_potensial: "Økologisk tilstand potensial"
  },
  vannkraft: {
    objtype: "Objekttype",
    konsstatus: "Konstruksjon status",
    status: "Status",
    vvformal: "Vannvei formål",
    medium: "Medium",
    damnavn: "Dam navn",
    hovedtype: "Damtype",
    damformal: "Dam formål",
    dkategori: "Dam kategori",
    inntaktyp: "Inntakstype",
    utloptyp: "Utløpstype",
    magformal: "Magasin formål",
    vannkrv: "Navn"
  },
  verneplan: {
    objektnavn: "Navn",
    verneplan: "Verneplan"
  },
  vernskog: {
    gmlname: "Type",
    beskrivelse: "Beskrivelse"
  },
  villreinområder: {
    omraadenavn: "Navn område",
    funksjon: "Funksjon",
    funksjonsperiode: "Funksjonsperiode"
  },
  marinedata: {
    mareano_dataVME_indica: "Habitattype",
    vulnerable_areasOBJTYPE: "Habitattype",
    mareano_dataVME_indi_1: "Engelsk",
    vulnerable_areasOBS_STED: "Sted"
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
