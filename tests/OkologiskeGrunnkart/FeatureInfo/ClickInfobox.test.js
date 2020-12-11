import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import ClickInfobox from "../../../src/Okologiskegrunnkart/FeatureInfo/ClickInfobox";
import favorittkartlagMock from "../../tools/favorittkartlagMock.json";
import emptyPointResultsMock from "../../tools/emptyPointResultsMock.json";
import pointResultsMock from "../../tools/pointResultsMock.json";
import {
  emptyPointCoordinates,
  emptyPointPlace
} from "../../tools/emptyPointDataMock.js";
import {
  pointCoordinates,
  pointPlace,
  pointAddress,
  pointMatrikkel,
  pointElevation
} from "../../tools/pointDataMock.js";

afterEach(cleanup);

const kartlag = favorittkartlagMock;
const emptyPointResults = emptyPointResultsMock;
const pointResults = pointResultsMock;

function renderClickInfobox(args) {
  let defaultprops = {
    coordinates_area: null,
    getBackendData: () => {},
    layersResult: {},
    allLayersResult: {},
    valgteLag: {},
    sted: null,
    adresse: null,
    matrikkel: null,
    elevation: null,
    resultat: null,
    kartlag: kartlag,
    showExtensiveInfo: true,
    loadingFeatures: false,
    infoboxDetailsVisible: false,
    setInfoboxDetailsVisible: () => {},
    setLayerInfoboxDetails: () => {},
    sortKey: "tema",
    tagFilter: {},
    matchAllFilters: true,
    showEiendomGeom: false,
    handlePropertyGeom: () => {},
    showFylkeGeom: false,
    handleFylkeGeom: () => {},
    showKommuneGeom: false,
    handleKommuneGeom: () => {},
    showMarkerOptions: false,
    setShowMarkerOptions: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<ClickInfobox {...props} />);
}

// These tests could also have been done in InfoboxSide component.
// They are run here to distribute them in different components
it("should render no border options when panle is collapsed", () => {
  const { getByText } = renderClickInfobox();
  // Only headers
  getByText("--° N --° Ø");
  getByText("- / -");
  getByText("Marker grenser");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
  // Border options not visible
  let options = screen.queryByText("Fylke");
  expect(options).toBeNull();
  options = screen.queryByText("Kommune");
  expect(options).toBeNull();
  options = screen.queryByText("Eiendom");
  expect(options).toBeNull();
});

it("should render border options when panle is expanded", () => {
  const { getByText } = renderClickInfobox({ showMarkerOptions: true });
  // Only headers
  getByText("--° N --° Ø");
  getByText("- / -");
  getByText("Marker grenser");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
});

it("should render data with empty point results and all layers", () => {
  const { getByText, getAllByText } = renderClickInfobox({
    coordinates_area: emptyPointCoordinates(),
    sted: emptyPointPlace(),
    adresse: null,
    matrikkel: null,
    elevation: null,
    allLayersResult: emptyPointResults,
    showMarkerOptions: true
  });
  // Point results
  getByText("Nordland");
  getByText("18");
  getByText("Vega");
  getByText("1815");
  getByText("65.5278° N 10.2859° Ø");
  getByText("Marker grenser");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
  // Layer results
  getByText("Arter");
  getByText("Arealressurs");
  getByText("Arter - Rødlista");
  getByText("Artsdatabanken");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  let result = getAllByText("Ingen treff");
  expect(result.length).toBe(2);
  // Badges
  let badges = screen.queryByText("1");
  expect(badges).toBeNull();
  badges = screen.queryByText("3");
  expect(badges).toBeNull();
});

it("should render data with point results and all layers", () => {
  const { getByText } = renderClickInfobox({
    coordinates_area: pointCoordinates(),
    sted: pointPlace(),
    adresse: pointAddress(),
    matrikkel: pointMatrikkel(),
    elevation: pointElevation(),
    allLayersResult: pointResults
  });
  // Point results
  getByText("Nordland");
  getByText("18");
  getByText("Brønnøy");
  getByText("1813");
  getByText("175 / 1 / 0");
  getByText("175 / 1");
  getByText("65.3516° N 12.7198° Ø");
  getByText("40 moh");
  getByText("Marker grenser");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
  // Border options not visible
  let options = screen.queryByText("Fylke");
  expect(options).toBeNull();
  options = screen.queryByText("Kommune");
  expect(options).toBeNull();
  options = screen.queryByText("Eiendom");
  expect(options).toBeNull();
  // Layer results
  getByText("Arter");
  getByText("Arealressurs");
  getByText("Arter - Rødlista");
  getByText("Artsdatabanken");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  getByText("Gubbeskjegg. Alectoria sarmentosa");
  getByText("Produktiv skog");
  // Badges
  getByText("1");
  getByText("3");
});

it("should render no results with all layers but receives results for selected layers only and showExtensiveInfo is true", () => {
  const { getByText } = renderClickInfobox({
    coordinates_area: pointCoordinates(),
    sted: pointPlace(),
    adresse: pointAddress(),
    matrikkel: pointMatrikkel(),
    elevation: pointElevation(),
    layersResult: pointResults
  });
  // Point results
  getByText("Nordland");
  getByText("18");
  getByText("Brønnøy");
  getByText("1813");
  getByText("175 / 1 / 0");
  getByText("175 / 1");
  getByText("65.3516° N 12.7198° Ø");
  getByText("40 moh");
  getByText("Marker grenser");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
  // Border options not visible
  let options = screen.queryByText("Fylke");
  expect(options).toBeNull();
  options = screen.queryByText("Kommune");
  expect(options).toBeNull();
  options = screen.queryByText("Eiendom");
  expect(options).toBeNull();
  // Layer results
  let results = screen.queryByText("Arter");
  expect(results).toBeNull();
  results = screen.queryByText("Arealressurs");
  expect(results).toBeNull();
  results = screen.queryByText("Arter - Rødlista");
  expect(results).toBeNull();
  results = screen.queryByText("Artsdatabanken");
  expect(results).toBeNull();
  results = screen.queryByText("Arealressurs: AR5");
  expect(results).toBeNull();
  results = screen.queryByText("NIBIO");
  expect(results).toBeNull();
  results = screen.queryByText("Gubbeskjegg. Alectoria sarmentosa");
  expect(results).toBeNull();
  results = screen.queryByText("Produktiv skog");
  expect(results).toBeNull();
  // Badges
  let badges = screen.queryByText("1");
  expect(badges).toBeNull();
  badges = screen.queryByText("3");
  expect(badges).toBeNull();
});
