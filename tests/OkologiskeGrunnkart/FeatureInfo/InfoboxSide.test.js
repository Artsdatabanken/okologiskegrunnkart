import React from "react";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved
} from "@testing-library/react";
import "@testing-library/jest-dom";
import InfoboxSide from "../../../src/Okologiskegrunnkart/FeatureInfo/InfoboxSide";
import kartlagMock from "../../tools/kartlagMock.json";
import emptyPointResultsMock from "../../tools/emptyPointResultsMock.json";
import pointResultsMock from "../../tools/pointResultsMock.json";
import polygonResultsMock from "../../tools/polygonResultsMock.json";
import { geometry1, geometry2 } from "../../tools/polygonDataMock";
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

const kartlag = kartlagMock;
const emptyPointResults = emptyPointResultsMock;
const pointResults = pointResultsMock;
const polygonResults = polygonResultsMock;
const geom1 = geometry1();
const geom2 = geometry2();

function renderInfoboxSide(args) {
  let defaultprops = {
    markerType: "klikk",
    coordinates_area: null,
    getBackendData: () => {},
    showInfobox: true,
    handleInfobox: () => {},
    showFullscreenInfobox: false,
    handleFullscreenInfobox: () => {},
    layersResult: {},
    allLayersResult: {},
    valgteLag: {},
    sted: null,
    adresse: null,
    matrikkel: null,
    elevation: null,
    resultat: null,
    kartlag: kartlag,
    showExtensiveInfo: false,
    loadingFeatures: false,
    isMobile: false,
    infoboxDetailsVisible: false,
    setInfoboxDetailsVisible: () => {},
    polygonDetailsVisible: false,
    setPolygonDetailsVisible: () => {},
    setLayerInfoboxDetails: () => {},
    polygon: null,
    polyline: null,
    showPolygon: false,
    hideAndShowPolygon: () => {},
    handleEditable: () => {},
    addPolygon: () => {},
    addPolyline: () => {},
    polygonResults: null,
    handlePolygonResults: () => {},
    sortKey: "tema",
    tagFilter: {},
    matchAllFilters: true,
    showEiendomGeom: false,
    handlePropertyGeom: () => {},
    showFylkeGeom: false,
    handleFylkeGeom: () => {},
    showKommuneGeom: false,
    handleKommuneGeom: () => {},
    grensePolygon: "none",
    grensePolygonGeom: null,
    handleGrensePolygon: () => {},
    removeGrensePolygon: () => {},
    showFylkePolygon: false,
    showKommunePolygon: false,
    showEiendomPolygon: false,
    grensePolygonData: {},
    legendVisible: false,
    setLegendVisible: () => {},
    legendPosition: "right",
    uploadPolygonFile: () => {},
    handlePolygonSaveModal: () => {},
    getSavedPolygons: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<InfoboxSide {...props} />);
}

// ---------------------------------------------------------------- //
// ------------------------ POINT TESTS --------------------------- //
// ---------------------------------------------------------------- //
it("should render no point data when no coordinates are defined", () => {
  const { getByText } = renderInfoboxSide();
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

it("should render data with empty point results", () => {
  let valgteLag = {};
  for (const layerId in emptyPointResults) {
    const layer = kartlag[layerId];
    valgteLag[layerId] = layer;
  }

  const { getByText, getAllByText } = renderInfoboxSide({
    coordinates_area: emptyPointCoordinates(),
    valgteLag: valgteLag,
    sted: emptyPointPlace(),
    adresse: null,
    matrikkel: null,
    elevation: null,
    layersResult: emptyPointResults
  });
  // Point results
  getByText("Steinan");
  getByText("Sjø");
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

it("should render data with point results", () => {
  let valgteLag = {};
  for (const layerId in pointResults) {
    const layer = kartlag[layerId];
    valgteLag[layerId] = layer;
  }

  const { getByText } = renderInfoboxSide({
    coordinates_area: pointCoordinates(),
    valgteLag: valgteLag,
    sted: pointPlace(),
    adresse: pointAddress(),
    matrikkel: pointMatrikkel(),
    elevation: pointElevation(),
    layersResult: pointResults
  });
  // Point results
  getByText("Langfjorden");
  getByText("Fjord");
  getByText("Nordland");
  getByText("18");
  getByText("Brønnøy");
  getByText("1813");
  getByText("175 / 1 / 0");
  getByText("175 / 1");
  getByText("65.3516° N 12.7198° Ø");
  getByText("40 moh");
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
  getByText("Gubbeskjegg. Alectoria sarmentosa");
  getByText("Produktiv skog");
  // Badges
  let badge = getByText("1");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
  badge = getByText("3");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
});

it("should render no results with selected layers but receives results for all layers only and showExtensiveInfo is false", () => {
  let valgteLag = {};
  for (const layerId in pointResults) {
    const layer = kartlag[layerId];
    valgteLag[layerId] = layer;
  }

  const { getByText } = renderInfoboxSide({
    coordinates_area: pointCoordinates(),
    valgteLag: valgteLag,
    sted: pointPlace(),
    adresse: pointAddress(),
    matrikkel: pointMatrikkel(),
    elevation: pointElevation(),
    allLayersResult: pointResults
  });
  // Point results
  getByText("Langfjorden");
  getByText("Fjord");
  getByText("Nordland");
  getByText("18");
  getByText("Brønnøy");
  getByText("1813");
  getByText("175 / 1 / 0");
  getByText("175 / 1");
  getByText("65.3516° N 12.7198° Ø");
  getByText("40 moh");
  getByText("Marker grenser");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
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

it("should render errors when error is returned from layer results", () => {
  let valgteLag = {};
  let errorResults = {};
  for (const layerId in emptyPointResults) {
    const layer = kartlag[layerId];
    valgteLag[layerId] = layer;
    errorResults[layerId] = { ...emptyPointResults[layerId], error: "Error" };
  }

  const { getByText, getAllByText } = renderInfoboxSide({
    coordinates_area: emptyPointCoordinates(),
    valgteLag: valgteLag,
    sted: emptyPointPlace(),
    adresse: null,
    matrikkel: null,
    elevation: null,
    layersResult: errorResults
  });
  // Point results
  getByText("Steinan");
  getByText("Sjø");
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
  let result = getAllByText("Kunne ikke hente data");
  expect(result.length).toBe(2);
  // Badges
  let badges = getAllByText("!");
  expect(badges.length).toBe(2);
  expect(badges[0]).toHaveClass("MuiBadge-colorError");
  expect(badges[1]).toHaveClass("MuiBadge-colorError");
});

// ---------------------------------------------------------------- //
// ----------------------- POLYGON TESTS -------------------------- //
// ---------------------------------------------------------------- //
it("should render no polygon data when no polygon is defined", () => {
  const { getByText, getAllByText } = renderInfoboxSide({
    markerType: "polygon"
  });
  // Only headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("Areal");
  getByText("Arealrapport (polygon ikke definert)");
  let empty = getAllByText("---");
  expect(empty.length).toBe(2);
});

it("should render polyline data when polyline is defined", () => {
  const { getByText } = renderInfoboxSide({
    markerType: "polygon",
    polyline: geom1
  });
  // Only headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("207.2 km");
  getByText("Areal");
  getByText("---");
  getByText("Arealrapport (polygon ikke definert)");
});

it("should render polygon data when polygon is defined", () => {
  const { getByText } = renderInfoboxSide({
    markerType: "polygon",
    polygon: geom1
  });
  // Only headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("290.8 km");
  getByText("Areal");
  getByText("4894.9 km²");
  getByText("Arealrapport");
});

it("should render results with polygon and polygon results defined", async () => {
  const { getByText, getAllByText, queryByText } = renderInfoboxSide({
    markerType: "polygon",
    polygon: geom2,
    polygonResults: polygonResults
  });
  // Headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("155.4 km");
  getByText("Areal");
  getByText("1464.2 km²");
  getByText("Arealrapport");
  // Close expander
  getByText("Lag arealrapport");
  fireEvent.click(getByText("Arealrapport"));
  await waitForElementToBeRemoved(() => queryByText("Lag arealrapport"));
  // Polygon results
  getByText("Fylker");
  getByText("Kommuner");
  getByText("Eiendommer");
  getByText("Arter Nasjonal Forvaltningsinteresse");
  getByText("Breer i Norge");
  getByText("Naturtyper - DN Håndbook 13");
  getByText("Naturtyper - DN Håndbook 19");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturvernområder");
  getByText("Innsjødatabase");
  getByText("Vannkraft - Magasin");
  getByText("Verneplan for Vassdrag");
  let owners = getAllByText("Kartverket");
  expect(owners.length).toBe(3);
  owners = getAllByText("Miljødirektoratet");
  expect(owners.length).toBe(6);
  owners = getAllByText("Norges vassdrags- og energidirektorat");
  expect(owners.length).toBe(3);
  // Badges
  let badge = getByText("16");
  expect(badge).toHaveClass("MuiBadge-colorPrimary");
  getByText("10");
  getByText("15");
  getByText("24");
  getByText("8");
  getByText("6");
  getByText("3");
  getByText("2");
  let badges = getAllByText("1");
  expect(badges.length).toBe(4);
  expect(badges[0]).toHaveClass("MuiBadge-colorPrimary");
  expect(badges[1]).toHaveClass("MuiBadge-colorPrimary");
});

it("should render no results with polygon and empty polygon results", async () => {
  const results = {
    ANF: null,
    BRE: null,
    FYL: null,
    ISJ: null,
    KOM: null,
    MAG: null,
    MAT: null,
    N13: null,
    NIN: null,
    NMA: null,
    VRN: null,
    VVS: null
  };
  const { getByText, getAllByText, queryByText } = renderInfoboxSide({
    markerType: "polygon",
    polygon: geom2,
    polygonResults: results
  });
  // Headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("155.4 km");
  getByText("Areal");
  getByText("1464.2 km²");
  getByText("Arealrapport");
  // Close expander
  getByText("Lag arealrapport");
  fireEvent.click(getByText("Arealrapport"));
  await waitForElementToBeRemoved(() => queryByText("Lag arealrapport"));
  // Polygon results
  getByText("Fylker");
  getByText("Kommuner");
  getByText("Eiendommer");
  getByText("Arter Nasjonal Forvaltningsinteresse");
  getByText("Breer i Norge");
  getByText("Naturtyper - DN Håndbook 13");
  getByText("Naturtyper - DN Håndbook 19");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturvernområder");
  getByText("Innsjødatabase");
  getByText("Vannkraft - Magasin");
  getByText("Verneplan for Vassdrag");
  let owners = getAllByText("Kartverket");
  expect(owners.length).toBe(3);
  owners = getAllByText("Miljødirektoratet");
  expect(owners.length).toBe(6);
  owners = getAllByText("Norges vassdrags- og energidirektorat");
  expect(owners.length).toBe(3);
  // Badges
  let badges = screen.queryByText("16");
  expect(badges).toBeNull();
  badges = screen.queryByText("16");
  expect(badges).toBeNull();
  badges = screen.queryByText("15");
  expect(badges).toBeNull();
  badges = screen.queryByText("24");
  expect(badges).toBeNull();
  badges = screen.queryByText("8");
  expect(badges).toBeNull();
  badges = screen.queryByText("6");
  expect(badges).toBeNull();
  badges = screen.queryByText("3");
  expect(badges).toBeNull();
  badges = screen.queryByText("2");
  expect(badges).toBeNull();
  badges = screen.queryByText("1");
  expect(badges).toBeNull();
});

it("should render error when error is returned from polygon results", async () => {
  const results = {
    ANF: { error: true },
    BRE: { error: true },
    FYL: { error: true },
    ISJ: { error: true },
    KOM: { error: true },
    MAG: { error: true },
    MAT: { error: true },
    N13: { error: true },
    NIN: { error: true },
    NMA: { error: true },
    VRN: { error: true },
    VVS: { error: true }
  };
  const { getByText, getAllByText, queryByText } = renderInfoboxSide({
    markerType: "polygon",
    polygon: geom2,
    polygonResults: results
  });
  // Headers
  getByText("Mitt Polygon");
  getByText("Velg polygon");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Geometri");
  getByText("Omkrets / perimeter");
  getByText("155.4 km");
  getByText("Areal");
  getByText("1464.2 km²");
  getByText("Arealrapport");
  // Close expander
  getByText("Lag arealrapport");
  fireEvent.click(getByText("Arealrapport"));
  await waitForElementToBeRemoved(() => queryByText("Lag arealrapport"));
  // Polygon results
  getByText("Fylker");
  getByText("Kommuner");
  getByText("Eiendommer");
  getByText("Arter Nasjonal Forvaltningsinteresse");
  getByText("Breer i Norge");
  getByText("Naturtyper - DN Håndbook 13");
  getByText("Naturtyper - DN Håndbook 19");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturvernområder");
  getByText("Innsjødatabase");
  getByText("Vannkraft - Magasin");
  getByText("Verneplan for Vassdrag");
  let owners = getAllByText("Kartverket");
  expect(owners.length).toBe(3);
  owners = getAllByText("Miljødirektoratet");
  expect(owners.length).toBe(6);
  owners = getAllByText("Norges vassdrags- og energidirektorat");
  expect(owners.length).toBe(3);
  // Badges
  let badges = getAllByText("!");
  expect(badges.length).toBe(12);
  expect(badges[0]).toHaveClass("MuiBadge-colorError");
  expect(badges[1]).toHaveClass("MuiBadge-colorError");
});
