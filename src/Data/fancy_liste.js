const fancy_liste = {
  bioklimatiske_soner: {
    url: "https://artsdatabanken.no/Pages/181901/Bioklimatiske_soner",
    tittel: "Bioklimatiske soner",
    subelement: true
  },
  bioklimatiske_seksjoner: {
    url: "https://artsdatabanken.no/Pages/181900/Bioklimatiske_seksjoner",
    tittel: "Bioklimatiske seksjoner",
    subelement: true
  },
  kalk: {
    url: "https://www.artsdatabanken.no/Pages/137908/Kalkinnhold",
    tittel: "Kalkinnhold",
    subelement: true
  },
  landskap: {
    url: "https://artsdatabanken.no/nin/",
    tittel: "Landskap"
  },
  vassdrag: {
    url: "https://www.nve.no/vann-vassdrag-og-miljo/verneplan-for-vassdrag/",
    tittel: "Verneplan for vassdrag"
  },
  laksefjord: {
    url: "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/",
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "layer_388_layer",
    feature: "layer_388_feature",
    tittel: "Laksefjord"
  },
  naturtype: {
    url: "https://nin-faktaark.miljodirektoratet.no/naturtyper/",
    tittel: "Naturtype"
  },
  arealtype: {
    url: "https://www.nibio.no/tema/jord/arealressurser/arealressurskart-ar5/",
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "Arealtyper_layer",
    feature: "Arealtyper_feature",
    feature_text: "artype_beskrivelse",
    tittel: "AR5 Arealtype "
  },
  løsmasse: {
    url: "", /// er denne samme som i layers? isåfall kan den jo ... bo her
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    layer: "Losmasse_flate_layer",
    feature: "Losmasse_flate_feature",
    feature_text: "losmassetype_tekst",
    tittel: "Løsmasse"
  }
};
export default fancy_liste;
