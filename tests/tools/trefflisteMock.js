import kartlagMock from "./kartlagMock.json";

function numberMatches() {
  return {
    number_places: 16043,
    number_knrgnrbnr: 1,
    number_kommune: 1,
    number_knr: 3000,
    number_gnr: 1222,
    number_bnr: 17,
    number_addresses: 10000,
    number_layers: 9,
    number_coord: 1
  };
}

function treffliste_lag() {
  // Arealressurs
  const layer1 = { ...kartlagMock[" 2"], trefftype: "Kartlag" };
  // Naturtyper - NiN Mdir
  const layer2 = { ...kartlagMock[" 3"], trefftype: "Kartlag" };
  // Arter - Rødlista
  const layer3 = { ...kartlagMock[" 31"], trefftype: "Kartlag" };
  const result = [];
  result.push(layer1);
  result.push(layer2);
  result.push(layer3);
  return result;
}

function treffliste_underlag() {
  const sublayer1 = {
    ...kartlagMock[" 2"].underlag["ArealressursAR5_ArealressursAR5Arealtype"],
    trefftype: "Underlag"
  };
  const sublayer2 = {
    ...kartlagMock[" 2"].underlag["ArealressursAR5_Treslag"],
    trefftype: "Underlag"
  };
  const sublayer3 = {
    ...kartlagMock[" 31"].underlag["ArterRdlista_RERegionaltutddd"],
    trefftype: "Underlag"
  };
  const sublayer4 = {
    ...kartlagMock[" 31"].underlag["ArterRdlista_CRKritisktruet"],
    trefftype: "Underlag"
  };
  const sublayer5 = {
    ...kartlagMock[" 31"].underlag["ArterRdlista_ENSterkttruet"],
    trefftype: "Underlag"
  };
  const sublayer6 = {
    ...kartlagMock[" 31"].underlag["ArterRdlista_VUSrbar"],
    trefftype: "Underlag"
  };
  const result = [];
  result.push(sublayer1);
  result.push(sublayer2);
  result.push(sublayer3);
  result.push(sublayer4);
  result.push(sublayer5);
  result.push(sublayer6);
  return result;
}

function treffliste_sted() {
  return [
    {
      aust: "11.1097",
      epsgKode: "4326",
      fylkesnavn: "Viken",
      kommunenavn: "Sarpsborg",
      navnetype: "By",
      nord: "59.28388333333331",
      skrivemaatenavn: "Sarpsborg",
      skrivemaatestatus: "Godkjent",
      spraak: "NO",
      ssrId: "48340",
      ssrpri: "0",
      stedsnavn: "Sarpsborg",
      stedsnummer: "487975",
      trefftype: "Stedsnavn"
    },
    {
      aust: "10.4087472222222",
      epsgKode: "4326",
      fylkesnavn: "Viken",
      kommunenavn: "Drammen",
      navnetype: "By",
      nord: "59.6136805555556",
      skrivemaatenavn: "Svelvik",
      skrivemaatestatus: "Godkjent",
      spraak: "NO",
      ssrId: "59787",
      ssrpri: "1",
      stedsnavn: "Svelvik",
      stedsnummer: "124591",
      trefftype: "Stedsnavn"
    },
    {
      aust: "15.4138194444444",
      epsgKode: "4326",
      fylkesnavn: "Nordland",
      kommunenavn: "Sortland - Suortá",
      navnetype: "By",
      nord: "68.6982",
      skrivemaatenavn: "Sortland",
      skrivemaatestatus: "Godkjent",
      spraak: "NO",
      ssrId: "287228",
      ssrpri: "2",
      stedsnavn: "Sortland",
      stedsnummer: "685163",
      trefftype: "Stedsnavn"
    },
    {
      aust: "15.4138194444444",
      epsgKode: "4326",
      fylkesnavn: "Nordland",
      kommunenavn: "Sortland - Suortá",
      navnetype: "By",
      nord: "68.6982",
      skrivemaatenavn: "Suortá",
      skrivemaatestatus: "Uvurdert",
      spraak: "SN",
      ssrId: "1329929",
      ssrpri: "3",
      stedsnavn: "Suortá",
      stedsnummer: "685163",
      trefftype: "Stedsnavn"
    },
    {
      aust: "14.9045479029965",
      epsgKode: "4326",
      fylkesnavn: "Nordland",
      kommunenavn: "Hadsel",
      navnetype: "By",
      nord: "68.5655245685718",
      skrivemaatenavn: "Stokmarknes",
      skrivemaatestatus: "Godkjent",
      spraak: "NO",
      ssrId: "286770",
      ssrpri: "4",
      stedsnavn: "Stokmarknes",
      stedsnummer: "260956",
      trefftype: "Stedsnavn"
    }
  ];
}

function treffliste_adresse() {
  return [
    {
      adressekode: 1634,
      adressenavn: "Ospelia s.",
      adressetekst: "Ospelia s. 44",
      adressetekstutenadressetilleggsnavn: "Ospelia s. 44",
      adressetilleggsnavn: null,
      bokstav: "",
      bruksenhetsnummer: [],
      bruksnummer: 322,
      festenummer: 0,
      gardsnummer: 172,
      kommunenavn: "GRIMSTAD",
      kommunenummer: "4202",
      nummer: 44,
      objtype: "Vegadresse",
      oppdateringsdato: "2020-06-15T15:57:57",
      postnummer: "4888",
      poststed: "HOMBORSUND",
      representasjonspunkt: {
        epsg: "EPSG:4258",
        lat: 58.2737976230279,
        lon: 8.500929249533318
      },
      stedfestingverifisert: false,
      trefftype: "Adresse",
      undernummer: null
    },
    {
      adressekode: 1634,
      adressenavn: "Ospelia s.",
      adressetekst: "Ospelia s. 47",
      adressetekstutenadressetilleggsnavn: "Ospelia s. 47",
      adressetilleggsnavn: null,
      bokstav: "",
      bruksenhetsnummer: [],
      bruksnummer: 313,
      festenummer: 0,
      gardsnummer: 172,
      kommunenavn: "GRIMSTAD",
      kommunenummer: "4202",
      nummer: 47,
      objtype: "Vegadresse",
      oppdateringsdato: "2020-06-15T15:57:57",
      postnummer: "4888",
      poststed: "HOMBORSUND",
      representasjonspunkt: {
        epsg: "EPSG:4258",
        lat: 58.273337578127936,
        lon: 8.500424272158082
      },
      stedfestingverifisert: false,
      trefftype: "Adresse",
      undernummer: null
    },
    {
      adressekode: 1634,
      adressenavn: "Ospelia s.",
      adressetekst: "Ospelia s. 42",
      adressetekstutenadressetilleggsnavn: "Ospelia s. 42",
      adressetilleggsnavn: null,
      bokstav: "",
      bruksenhetsnummer: [],
      bruksnummer: 323,
      festenummer: 0,
      gardsnummer: 172,
      kommunenavn: "GRIMSTAD",
      kommunenummer: "4202",
      nummer: 42,
      objtype: "Vegadresse",
      oppdateringsdato: "2020-06-15T15:57:57",
      postnummer: "4888",
      poststed: "HOMBORSUND",
      representasjonspunkt: {
        epsg: "EPSG:4258",
        lat: 58.27372714492484,
        lon: 8.500452192278244
      },
      stedfestingverifisert: false,
      trefftype: "Adresse",
      undernummer: null
    },
    {
      adressekode: 1634,
      adressenavn: "Ospelia s.",
      adressetekst: "Ospelia s. 53",
      adressetekstutenadressetilleggsnavn: "Ospelia s. 53",
      adressetilleggsnavn: null,
      bokstav: "",
      bruksenhetsnummer: [],
      bruksnummer: 316,
      festenummer: 0,
      gardsnummer: 172,
      kommunenavn: "GRIMSTAD",
      kommunenummer: "4202",
      nummer: 53,
      objtype: "Vegadresse",
      oppdateringsdato: "2020-06-15T15:57:57",
      postnummer: "4888",
      poststed: "HOMBORSUND",
      representasjonspunkt: {
        epsg: "EPSG:4258",
        lat: 58.27377513021134,
        lon: 8.499770271801514
      },
      stedfestingverifisert: false,
      trefftype: "Adresse",
      undernummer: null
    },
    {
      adressekode: 1634,
      adressenavn: "Ospelia s.",
      adressetekst: "Ospelia s. 55",
      adressetekstutenadressetilleggsnavn: "Ospelia s. 55",
      adressetilleggsnavn: null,
      bokstav: "",
      bruksenhetsnummer: [],
      bruksnummer: 317,
      festenummer: 0,
      gardsnummer: 172,
      kommunenavn: "GRIMSTAD",
      kommunenummer: "4202",
      nummer: 55,
      objtype: "Vegadresse",
      oppdateringsdato: "2020-06-15T15:57:57",
      postnummer: "4888",
      poststed: "HOMBORSUND",
      representasjonspunkt: {
        epsg: "EPSG:4258",
        lat: 58.273972719339405,
        lon: 8.499767486613228
      },
      stedfestingverifisert: false,
      trefftype: "Adresse",
      undernummer: null
    }
  ];
}

function treffliste_kommune() {
  return {
    sokStatus: { melding: "", ok: "true" },
    stedsnavn: {
      aust: "10.3950561470148",
      epsgKode: "4326",
      fylkesnavn: "Trøndelag - Trööndelage",
      knr: "5001",
      kommunenavn: "Trondheim",
      navnetype: "By",
      nord: "63.4304847814225",
      skrivemaatenavn: "Trondheim",
      skrivemaatestatus: "Godkjent",
      spraak: "NO",
      ssrId: "212924",
      stedsnavn: "Trondheim",
      stedsnummer: "558690",
      trefftype: "Kommune"
    },
    totaltAntallTreff: "590"
  };
}

function treffliste_knr() {
  return {
    adresser: [
      {
        adressekode: 1315,
        adressenavn: "Vinterlebakken",
        adressetekst: "Vinterlebakken 10",
        adressetekstutenadressetilleggsnavn: "Vinterlebakken 10",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 9,
        festenummer: 0,
        gardsnummer: 520,
        kommunenavn: "TRONDHEIM",
        kommunenummer: "5001",
        nummer: 10,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:09:09",
        postnummer: "7540",
        poststed: "KLÆBU",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 63.29648121369209,
          lon: 10.469455512102938
        },
        stedfestingverifisert: false,
        trefftype: "KNR",
        undernummer: null
      },
      {
        adressekode: 1315,
        adressenavn: "Vinterlebakken",
        adressetekst: "Vinterlebakken 15",
        adressetekstutenadressetilleggsnavn: "Vinterlebakken 15",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 15,
        festenummer: 0,
        gardsnummer: 520,
        kommunenavn: "TRONDHEIM",
        kommunenummer: "5001",
        nummer: 15,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:09:09",
        postnummer: "7540",
        poststed: "KLÆBU",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 63.29702628084981,
          lon: 10.4684798282629
        },
        stedfestingverifisert: true,
        trefftype: "KNR",
        undernummer: null
      },
      {
        adressekode: 1315,
        adressenavn: "Vinterlebakken",
        adressetekst: "Vinterlebakken 6",
        adressetekstutenadressetilleggsnavn: "Vinterlebakken 6",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 7,
        festenummer: 0,
        gardsnummer: 520,
        kommunenavn: "TRONDHEIM",
        kommunenummer: "5001",
        nummer: 6,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:09:09",
        postnummer: "7540",
        poststed: "KLÆBU",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 63.29624477935265,
          lon: 10.470620440643376
        },
        stedfestingverifisert: false,
        trefftype: "KNR",
        undernummer: null
      }
    ],
    metadata: {
      asciiKompatibel: true,
      side: 0,
      sokeStreng: "kommunenummer=5001&treffPerSide=20&side=0",
      totaltAntallTreff: 10000,
      treffPerSide: 20,
      viserFra: 0,
      viserTil: 20
    }
  };
}

function treffliste_gnr() {
  return {
    adresser: [
      {
        adressekode: 51130,
        adressenavn: "Brunla allé",
        adressetekst: "Brunla allé 9",
        adressetekstutenadressetilleggsnavn: "Brunla allé 9",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 358,
        festenummer: 0,
        gardsnummer: 5001,
        kommunenavn: "LARVIK",
        kommunenummer: "3805",
        nummer: 9,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:28:28",
        postnummer: "3290",
        poststed: "STAVERN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 58.99838544031573,
          lon: 10.026852010771803
        },
        stedfestingverifisert: true,
        trefftype: "GNR",
        undernummer: null
      },
      {
        adressekode: 51420,
        adressenavn: "Rådhusgaten",
        adressetekst: "Rådhusgaten 52",
        adressetekstutenadressetilleggsnavn: "Rådhusgaten 52",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 127,
        festenummer: 0,
        gardsnummer: 5001,
        kommunenavn: "LARVIK",
        kommunenummer: "3805",
        nummer: 52,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:28:28",
        postnummer: "3290",
        poststed: "STAVERN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 58.99772433942772,
          lon: 10.029350961482601
        },
        stedfestingverifisert: false,
        trefftype: "GNR",
        undernummer: null
      },
      {
        adressekode: 51420,
        adressenavn: "Rådhusgaten",
        adressetekst: "Rådhusgaten 46",
        adressetekstutenadressetilleggsnavn: "Rådhusgaten 46",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 125,
        festenummer: 0,
        gardsnummer: 5001,
        kommunenavn: "LARVIK",
        kommunenummer: "3805",
        nummer: 46,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T15:28:28",
        postnummer: "3290",
        poststed: "STAVERN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 58.99766963447355,
          lon: 10.029453764006579
        },
        stedfestingverifisert: false,
        trefftype: "GNR",
        undernummer: null
      }
    ],
    metadata: {
      asciiKompatibel: true,
      side: 0,
      sokeStreng: "gardsnummer=5001&treffPerSide=20&side=0",
      totaltAntallTreff: 1222,
      treffPerSide: 20,
      viserFra: 0,
      viserTil: 20
    }
  };
}

function treffliste_bnr() {
  return {
    adresser: [
      {
        adressekode: 79100,
        adressenavn: "Stallmannsvingen",
        adressetekst: "Stallmannsvingen 27",
        adressetekstutenadressetilleggsnavn: "Stallmannsvingen 27",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 5001,
        festenummer: 0,
        gardsnummer: 300,
        kommunenavn: "SKIEN",
        kommunenummer: "3807",
        nummer: 27,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T14:08:08",
        postnummer: "3716",
        poststed: "SKIEN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 59.21899458122146,
          lon: 9.592783710718487
        },
        stedfestingverifisert: false,
        trefftype: "BNR",
        undernummer: null
      },
      {
        adressekode: 79100,
        adressenavn: "Stallmannsvingen",
        adressetekst: "Stallmannsvingen 23",
        adressetekstutenadressetilleggsnavn: "Stallmannsvingen 23",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 5001,
        festenummer: 0,
        gardsnummer: 300,
        kommunenavn: "SKIEN",
        kommunenummer: "3807",
        nummer: 23,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T14:08:08",
        postnummer: "3716",
        poststed: "SKIEN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 59.218832784100854,
          lon: 9.592815940305053
        },
        stedfestingverifisert: false,
        trefftype: "BNR",
        undernummer: null
      },
      {
        adressekode: 79100,
        adressenavn: "Stallmannsvingen",
        adressetekst: "Stallmannsvingen 21",
        adressetekstutenadressetilleggsnavn: "Stallmannsvingen 21",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: [],
        bruksnummer: 5001,
        festenummer: 0,
        gardsnummer: 300,
        kommunenavn: "SKIEN",
        kommunenummer: "3807",
        nummer: 21,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T14:08:08",
        postnummer: "3716",
        poststed: "SKIEN",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 59.21884152447416,
          lon: 9.59286864426384
        },
        stedfestingverifisert: false,
        trefftype: "BNR",
        undernummer: null
      }
    ],
    metadata: {
      asciiKompatibel: true,
      side: 0,
      sokeStreng: "bruksnummer=5001&treffPerSide=20&side=0",
      totaltAntallTreff: 17,
      treffPerSide: 20,
      viserFra: 0,
      viserTil: 20
    }
  };
}

function treffliste_knrgnrbnr() {
  return {
    adresser: [
      {
        adressekode: 9395,
        adressenavn: "Malvikvegen",
        adressetekst: "Malvikvegen 2",
        adressetekstutenadressetilleggsnavn: "Malvikvegen 2",
        adressetilleggsnavn: null,
        bokstav: "",
        bruksenhetsnummer: ["H0101", "H0201"],
        bruksnummer: 1,
        festenummer: 0,
        gardsnummer: 25,
        kommunenavn: "TRONDHEIM",
        kommunenummer: "5001",
        nummer: 2,
        objtype: "Vegadresse",
        oppdateringsdato: "2020-06-15T16:00:00",
        postnummer: "7055",
        poststed: "RANHEIM",
        representasjonspunkt: {
          epsg: "EPSG:4258",
          lat: 63.42640281076123,
          lon: 10.551553893213269
        },
        stedfestingverifisert: false,
        trefftype: "KNR-GNR-BNR",
        undernummer: null
      }
    ],
    metadata: {
      asciiKompatibel: true,
      side: 0,
      sokeStreng:
        "kommunenummer=5001&gardsnummer=25&bruksnummer=1&treffPerSide=20&side=0",
      totaltAntallTreff: 1,
      treffPerSide: 20,
      viserFra: 0,
      viserTil: 20
    }
  };
}

function treffliste_koord() {
  return [
    {
      id: 1,
      name: "62.165° N / 11.950° Ø",
      projection: "EPSG:4326",
      representasjonspunkt: { lat: 62.165, lon: 11.95 },
      trefftype: "Punkt"
    }
  ];
}

export {
  numberMatches,
  treffliste_lag,
  treffliste_underlag,
  treffliste_sted,
  treffliste_adresse,
  treffliste_kommune,
  treffliste_knr,
  treffliste_gnr,
  treffliste_bnr,
  treffliste_knrgnrbnr,
  treffliste_koord
};
