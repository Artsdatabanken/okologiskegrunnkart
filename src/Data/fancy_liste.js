const fancy_liste = {
  bioklimatisk: {
    url: "https://artsdatabanken.no/Pages/182001/Regional_naturvariasjon",
    subelement: true
  },
  kalk: {
    url: "https://www.artsdatabanken.no/Pages/137908/Kalkinnhold",
    subelement: true
  },
  vassdrag: {
    url: "https://www.nve.no/vann-vassdrag-og-miljo/verneplan-for-vassdrag/",
    subelement: false,
    object_text: "Verneplan for vassdrag "
  },
  laksefjord: {
    url: "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/",
    subelement: false,
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "layer_388_layer",
    feature: "layer_388_feature",
    object_text: "Laksefjord i  "
  },
  naturtype: {
    url: "https://nin-faktaark.miljodirektoratet.no/naturtyper/"
  },
  landskap: {
    url: "https://artsdatabanken.no/nin/"
  },
  arealtype: {
    url: "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/",
    subelement: false,
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "Arealtyper_layer",
    feature: "Arealtyper_feature",
    feature_text: "artype_beskrivelse",
    object_text: "AR5 Arealtype "
  },
  løsmasse: {
    url: "", /// er denne samme som i layers? isåfall kan den jo ... bo her
    subelement: false,
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "Losmasse_flate_layer",
    feature: "Losmasse_flate_feature",
    feature_text: "losmassetype_tekst",
    object_text: "Løsmasse "
  }
};
export default fancy_liste;
