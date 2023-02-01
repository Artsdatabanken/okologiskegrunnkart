import React from "react";
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TreffListe from "../../../src/Okologiskegrunnkart/SearchBar/TreffListe";
import XML from "pixl-xml";
import {
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
} from "../../tools/trefflisteMock.js";
jest.mock("../../../src/Funksjoner/backend.js"); // jest mocks everything in that file

afterEach(cleanup);
//var XMLParser = require("react-xml-parser");

const numbers = numberMatches();

function renderTreffListe(args) {
  let defaultprops = {
    onSelectSearchResult: () => {},
    searchResultPage: false,
    searchTerm: null,
    handleSearchBar: () => {},
    treffliste_lag: null,
    treffliste_underlag: null,
    treffliste_sted: null,
    treffliste_kommune: null,
    treffliste_knr: null,
    treffliste_gnr: null,
    treffliste_bnr: null,
    treffliste_adresse: null,
    treffliste_knrgnrbnr: null,
    treffliste_koord: null,
    number_places: 0,
    number_knrgnrbnr: 0,
    number_kommune: 0,
    number_knr: 0,
    number_gnr: 0,
    number_bnr: 0,
    number_addresses: 0,
    number_layers: 0,
    number_coord: 0,
    removeValgtLag: () => {},
    addValgtLag: () => {},
    handleGeoSelection: () => {},
    handleRemoveTreffliste: () => {},
    isMobile: false,
    windowHeight: 970,
    handleSideBar: () => {},
    handleInfobox: () => {},
    handleFullscreenInfobox: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<TreffListe {...props} />);
}

// -------------------------------------------------------------- //
// ------------------------- POP-UP LIST ------------------------ //
// -------------------------------------------------------------- //
it("should render layer search results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_lag: treffliste_lag(),
      treffliste_underlag: treffliste_underlag()
    }
  );
  // Search results content
  getByText("Arealressurs: AR5");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Treslag");
  getByText("Naturtyper - NiN Mdir");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");

  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  let layers = getAllByText("Kartlag");
  expect(layers.length).toBe(3);
  let sublayers = getAllByText("Underlag");
  expect(sublayers.length).toBe(6);
  let tema = getAllByText("Arealressurs");
  expect(tema.length).toBe(3);
  tema = getAllByText("Naturtyper");
  expect(tema.length).toBe(1);
  tema = getAllByText("Arter");
  expect(tema.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

/*
it("should try this", () => {
  console.log("Only I was run ?!");
  var xmltxt = '<?xml version="1.0" encoding="UTF-8"?> <FeatureInfoResponse xmlns:esri_wms="http://www.esri.com/wms" xmlns="http://www.esri.com/wms"><FIELDS OBJECTID="27993" lokalId="VV00003233" cddaId="555595979" navn="Gaulosen" offisieltnavn="Gaulosen marine verneområde" faktaark="https://faktaark.naturbase.no/?id=VV00003233" verneform="marint verneområde (naturmangfoldloven)" verneformAggregert="marintVerneområde" verneforskrift="https://lovdata.no/forskrift/2016-06-17-690" vernedato="17.06.2016" førstegangVernet="Null" verneplan="Marin verneplan" kommune="Melhus (5028),Trondheim (5001),Skaun (5029)" forvaltningsmyndighet="Statsforvalteren i Trøndelag" forvaltningsmyndighetType="Statsforvalter" iucn="Ingen - ikke vurdert" revisjon="Ikke revidert" majorEcosystemType="Marin" NaturvernFKID="{E50693A6-AC05-4583-839A-86D02BF1ED94}" GlobalId="{0B9368D7-28AC-489D-9782-BE119B1E73F6}" Shape="Polygon" SHAPE.STArea="10866386,6644" SHAPE.STLength="14549,657285"></FIELDS></FeatureInfoResponse>';  
  // 1: pixl-xml variant 
  const wms_api_pixl = {
    parse: text => {
      try {
        if (!text) return {};
        return XML.parse(text);
      } catch (e) {
        console.error(e);
        return {};
      }
    }
  };
//const fastparser = new fastXMLParser();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const options = {
  ignoreAttributes: false,
  attributeNamePrefix : "",
  allowBooleanAttributes: true
};
const parser = new XMLParser(options);
const wms_api_fast = {
  parse: text =>{
    try {
      if (!text) return {};
      var parsed =  parser.parse(text);
      var hasFeatureInfoResponseTag = parsed.hasOwnProperty('FeatureInfoResponse');
      if(hasFeatureInfoResponseTag){
        return parsed.FeatureInfoResponse;
      }else{
        //return the second attribute in gml this will commonly be the body
        return parsed[Object.keys(parsed)[1]];
      }
      return parsed;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
  
  
};
  var pixl_response = wms_api_pixl.parse(xmltxt);
  //var react_xml_response = wms_api_react.parse(xmltxt);
  var fast_xml_response = wms_api_fast.parse(xmltxt);
  const dummyXmlDataStr = `
  <?xml version="1.0" encoding="UTF-8"?>

  <msGMLOutput 
     xmlns:gml="http://www.opengis.net/gml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Bergart_flate_layer>
    <gml:name>Bedrock surface 1:250 000</gml:name>
      <Bergart_flate_feature>
        <gml:boundedBy>
          <gml:Box srsName="EPSG:4326">
            <gml:coordinates>14.188593,67.451717 15.417771,67.685319</gml:coordinates>
          </gml:Box>
        </gml:boundedBy>
        <objectid>36396</objectid>
        <objekttype>BergartFlate</objekttype>
        <mref>250000</mref>
        <oppdateringsdato>2021-10-18</oppdateringsdato>
        <hovedbergkode_old>82</hovedbergkode_old>
        <hovedbergkode_old_tekst>Diorittisk til granittisk gneis, migmatitt</hovedbergkode_old_tekst>
        <bergnavn_old></bergnavn_old>
        <bergnavn_nord_old>Granitt og granodioritt, stedvis forgneiset</bergnavn_nord_old>
        <geolkartnummer>121</geolkartnummer>
        <geokartnr_tekst_old></geokartnr_tekst_old>
        <tegnforklaring>Granitt, overveiende grovporfyrisk, lys grå</tegnforklaring>
        <tegnforklaring_engelsk></tegnforklaring_engelsk>
        <alderbeskrivelse_old></alderbeskrivelse_old>
        <cmykfargekode>3,12,7,0</cmykfargekode>
        <cyan>3</cyan>
        <magenta>12</magenta>
        <yellow>7</yellow>
        <black>0</black>
        <kartbladindeks>SULITJELMA</kartbladindeks>
        <hovedbergart>102</hovedbergart>
        <hovedbergart_tekst>Granitt</hovedbergart_tekst>
        <tegnforklaringnummer>2954</tegnforklaringnummer>
        <tilleggsbergart1></tilleggsbergart1>
        <tilleggsbergart1_tekst></tilleggsbergart1_tekst>
        <tilleggsbergart2></tilleggsbergart2>
        <tilleggsbergart2_tekst></tilleggsbergart2_tekst>
        <tilleggsbergart3></tilleggsbergart3>
        <tilleggsbergart3_tekst></tilleggsbergart3_tekst>
        <dekkesystem>10</dekkesystem>
        <dekkesystem_tekst>Øverste Dekkeserie</dekkesystem_tekst>
        <dekkekompleks>240</dekkekompleks>
        <dekkekompleks_tekst>Rödingsfjälldekkekomplekset</dekkekompleks_tekst>
        <dekke></dekke>
        <dekke_tekst></dekke_tekst>
        <overgruppe></overgruppe>
        <overgruppe_tekst></overgruppe_tekst>
        <gruppe></gruppe>
        <gruppe_tekst></gruppe_tekst>
        <formasjon></formasjon>
        <formasjon_tekst></formasjon_tekst>
        <kompleks></kompleks>
        <kompleks_tekst></kompleks_tekst>
        <suite></suite>
        <suite_tekst></suite_tekst>
        <litodem>2860</litodem>
        <litodem_tekst>Heggmovassmassivet</litodem_tekst>
        <dannelsesalder>154</dannelsesalder>
        <dannelsesalder_tekst>Neoproterozoikum (1000-541.0 Ma)</dannelsesalder_tekst>
        <dannelsesminalder></dannelsesminalder>
        <dannelsesminalder_tekst></dannelsesminalder_tekst>
        <dannelsesmaksalder></dannelsesmaksalder>
        <dannelsesmaksalder_tekst></dannelsesmaksalder_tekst>
        <metamorffacies>80</metamorffacies>
        <metamorffacies_tekst>Amfibolittfacies</metamorffacies_tekst>
        <metamorfalder>120</metamorfalder>
        <metamorfalder_tekst>Silur (443.8-419.2 Ma)</metamorfalder_tekst>
        <metamorffacies2></metamorffacies2>
        <metamorffacies2_tekst></metamorffacies2_tekst>
        <metamorfalder2></metamorfalder2>
        <metamorfalder2_tekst></metamorfalder2_tekst>
        <opphav></opphav>
        <oppdatertav>TORGERSEN_ESPEN_SDE</oppdatertav>
        <rgbfargekode></rgbfargekode>
        <omkodingsfelt>DekkeEnhetNavn= Grunnfjell</omkodingsfelt>
        <tektoniskhovedinndeling>70</tektoniskhovedinndeling>
        <tektoniskhovedinndeling_tekst>Kaledonsk orogen</tektoniskhovedinndeling_tekst>
        <geologiskform></geologiskform>
        <geologiskform_tekst></geologiskform_tekst>
        <tektoniskenhet>10</tektoniskenhet>
        <tektoniskenhet_tekst>Øverste kaledonske dekkeserie</tektoniskenhet_tekst>
        <dekkekompleks_geninoid>148238</dekkekompleks_geninoid>
        <dekke_geninoid></dekke_geninoid>
        <gruppe_geninoid></gruppe_geninoid>
        <overgruppe_geninoid></overgruppe_geninoid>
        <formasjon_geninoid></formasjon_geninoid>
        <kompleks_geninoid></kompleks_geninoid>
        <suite_geninoid></suite_geninoid>
      </Bergart_flate_feature>
    </Bergart_flate_layer>
    <Bergart_flate_tektoniskhovedinndeling_layer>
    <gml:name>Bergartsflate 1:250 000 tektonisk hovedinndeling</gml:name>
      <Bergart_flate_tektoniskhovedinndeling_feature>
        <gml:boundedBy>
          <gml:Box srsName="EPSG:4326">
            <gml:coordinates>14.188593,67.451717 15.417771,67.685319</gml:coordinates>
          </gml:Box>
        </gml:boundedBy>
        <objectid>36396</objectid>
        <tektoniskhovedinndeling>70</tektoniskhovedinndeling>
      </Bergart_flate_tektoniskhovedinndeling_feature>
    </Bergart_flate_tektoniskhovedinndeling_layer>
    <Bergart_flate_dannelsesalder_layer>
    <gml:name>Bergartsflate 1:250 000 dannelsesalder</gml:name>
      <Bergart_flate_dannelsesalder_feature>
        <gml:boundedBy>
          <gml:Box srsName="EPSG:4326">
            <gml:coordinates>14.188593,67.451717 15.417771,67.685319</gml:coordinates>
          </gml:Box>
        </gml:boundedBy>
        <objectid>36396</objectid>
        <dannelsesalder>154</dannelsesalder>
        <dannelsesminalder_tekst>Neoproterozoikum (1000-541.0 Ma)</dannelsesminalder_tekst>
      </Bergart_flate_dannelsesalder_feature>
    </Bergart_flate_dannelsesalder_layer>
  </msGMLOutput>
  `;
  var fast2_response = wms_api_fast.parse(dummyXmlDataStr);
  var pixl2_resp = wms_api_pixl.parse(dummyXmlDataStr);
  //var attributes = react_xml_response.attributes
  console.log("PIXL", pixl_response);
  //console.log("REACT", react_xml_response);
  var dummy;
});
*/

it("should render place results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_sted: treffliste_sted()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(4);

  getByText("Sarpsborg");
  getByText("Stedsnavn, By i Sarpsborg");
  getByText("487975");

  getByText("Svelvik");
  getByText("Stedsnavn, By i Drammen");
  getByText("124591");

  getByText("Suortá");
  getByText("685163");

  let places = getAllByText("Stedsnavn, By i Sortland - Suortá");
  expect(places.length).toBe(1);

  getByText("Stokmarknes");
  getByText("Stedsnavn, By i Hadsel");
  getByText("260956");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render address results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_adresse: treffliste_adresse()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(5);

  getByText("Ospelia s. 44");
  getByText("4202-172-322");

  getByText("Ospelia s. 47");
  getByText("4202-172-313");

  getByText("Ospelia s. 42");
  getByText("4202-172-323");

  getByText("Ospelia s. 53");
  getByText("4202-172-316");

  getByText("Ospelia s. 55");
  getByText("4202-172-317");

  let addresses = getAllByText("Adresse 4888 HOMBORSUND");
  expect(addresses.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render kommune results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_kommune: treffliste_kommune()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  getByText("Trondheim");
  getByText("Kommune");
  getByText("5001");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render knr, gnr, bnr results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR
  getByText("Stallmannsvingen 27");

  getByText("Stallmannsvingen 23");

  getByText("Stallmannsvingen 21");

  addresses = getAllByText("BNR 3716 SKIEN");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("3807-300-");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("5001");
  expect(addresses.length).toBe(9);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render knrgnrbnr results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_knrgnrbnr: treffliste_knrgnrbnr()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  // KNR
  getByText("Malvikvegen 2");
  getByText("KNR-GNR-BNR 7055 RANHEIM");
  getByText("5001-25-1");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render coordinates results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_koord: treffliste_koord()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  // KNR
  getByText("62.165° N / 11.950° Ø");
  getByText("Punktkoordinater");
  getByText("EPSG:4326");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

// -------------------------------------------------------------- //
// --------------------- SEARCH RESULTS PAGE -------------------- //
// -------------------------------------------------------------- //
it("should render empty page when there are no results", () => {
  const { container, getByText, getAllByText } = renderTreffListe({
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");

  let number = getAllByText("(0)");
  expect(number.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });
});

it("should render layer search results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_lag: treffliste_lag(),
    treffliste_underlag: treffliste_underlag(),
    number_layers: numbers.number_layers,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(9)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Search results content
  getByText("Arealressurs: AR5");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Treslag");
  getByText("Naturtyper - NiN Mdir");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");

  // Buttons: 9 layer results, 3 pagination, 6 tabs
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(18);

  // Layer results
  let layers = getAllByText("Kartlag");
  expect(layers.length).toBe(4);
  let sublayers = getAllByText("Underlag");
  expect(sublayers.length).toBe(6);
  let tema = getAllByText("Arealressurs");
  expect(tema.length).toBe(3);
  tema = getAllByText("Naturtyper");
  expect(tema.length).toBe(1);
  tema = getAllByText("Arter");
  expect(tema.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render place results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_sted: treffliste_sted(),
      number_places: numbers.number_places,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(16043)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on places tab
  fireEvent.click(getByText("Stedsnavn"));

  // Buttons: 5 place results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(18);

  // Layer results
  getByText("Sarpsborg");
  getByText("Stedsnavn, By i Sarpsborg");
  getByText("487975");

  getByText("Svelvik");
  getByText("Stedsnavn, By i Drammen");
  getByText("124591");

  getByText("Suortá");
  getByText("685163");

  let places = getAllByText("Stedsnavn, By i Sortland - Suortá");
  expect(places.length).toBe(1);

  getByText("Stokmarknes");
  getByText("Stedsnavn, By i Hadsel");
  getByText("260956");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("1146");
});

it("should render address results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_adresse: treffliste_adresse(),
      number_addresses: numbers.number_addresses,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(10000)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on address tab
  fireEvent.click(getByText("Adresse"));

  // Buttons: 5 address results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(19);

  getByText("Ospelia s. 44");
  getByText("4202-172-322");

  getByText("Ospelia s. 47");
  getByText("4202-172-313");

  getByText("Ospelia s. 42");
  getByText("4202-172-323");

  getByText("Ospelia s. 53");
  getByText("4202-172-316");

  getByText("Ospelia s. 55");
  getByText("4202-172-317");

  let addresses = getAllByText("Adresse 4888 HOMBORSUND");
  expect(addresses.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("714");
});

it("should render kommune results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_kommune: treffliste_kommune(),
    number_kommune: numbers.number_kommune,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on paces tab
  fireEvent.click(getByText("Stedsnavn"));

  // Buttons: 1 place results, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  getByText("Trondheim");
  getByText("Kommune");
  getByText("5001");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render knr, gnr, bnr results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr(),
      number_knr: numbers.number_knr,
      number_gnr: numbers.number_gnr,
      number_bnr: numbers.number_bnr,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(4239)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 9 results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(23);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR
  getByText("Stallmannsvingen 27");

  getByText("Stallmannsvingen 23");

  getByText("Stallmannsvingen 21");

  addresses = getAllByText("BNR 3716 SKIEN");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("3807-300-");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("5001");
  expect(addresses.length).toBe(9);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  // Last page calculated separatedly for KNR, GNR, BNR and added
  // KNR = 215, GNR = 88, BNR = 2
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("305");
});

it("should render knrgnrbnr results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_knrgnrbnr: treffliste_knrgnrbnr(),
    number_knrgnrbnr: numbers.number_knrgnrbnr,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 1 result, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // KNR
  getByText("Malvikvegen 2");
  getByText("KNR-GNR-BNR 7055 RANHEIM");
  getByText("5001-25-1");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render coordinates results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_koord: treffliste_koord(),
    number_coord: numbers.number_coord,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on point tab
  fireEvent.click(getByText("Punkt"));

  // Buttons: 1 result, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // KNR
  getByText("62.165° N / 11.950° Ø");
  getByText("Punktkoordinater");
  getByText("EPSG:4326");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("changing window height changes number of results per page and pagination", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr(),
      number_knr: numbers.number_knr,
      number_gnr: numbers.number_gnr,
      number_bnr: numbers.number_bnr,
      searchResultPage: true,
      windowHeight: 580
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(4239)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 7 results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(21);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR (only one due to window height)
  getByText("Stallmannsvingen 27");
  getByText("BNR 3716 SKIEN");
  getByText("3807-300-");

  addresses = getAllByText("5001");
  expect(addresses.length).toBe(7);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  // Last page calculated separatedly for KNR, GNR, BNR and added
  // KNR = 215, GNR = 88, BNR = 2
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("607");
});
