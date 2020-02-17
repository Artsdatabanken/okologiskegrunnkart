const fancy_liste = {
  bioklimatisk: {
    url: "https://artsdatabanken.no/Pages/182001/Regional_naturvariasjon",
    subelement: true
  },
  kalk: {
    url: "https://www.artsdatabanken.no/Pages/137908/Kalkinnhold",
    subelement: true
  },
  løsmasse: {
    url: "",
    url_replace: [
      "info_format=application/vnd.ogc.gml",
      "info_format=text/html"
    ],
    subelement: false,
    layer: "Losmasse_flate_layer",
    feature: "Losmasse_flate_feature",
    feature_text: "losmassetype_tekst",
    object_text: "Løsmasse "
  }
};
export default fancy_liste;
