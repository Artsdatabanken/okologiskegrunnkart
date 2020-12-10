import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import InfoboxSide from "../../../src/Okologiskegrunnkart/FeatureInfo/InfoboxSide";
import kartlagMock from "../../tools/kartlagMock.json";
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

const kartlag = kartlagMock;
const emptyPointResults = emptyPointResultsMock;
const pointResults = pointResultsMock;
const geometry = [
  [64.88626540914477, 11.535644531250002],
  [64.71787992684128, 12.875976562500002],
  [63.927717045495136, 12.216796875000002],
  [64.13936944203154, 11.381835937500002]
];

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
  let badge = screen.queryByText("1");
  expect(badge).toBeNull();
  badge = screen.queryByText("3");
  expect(badge).toBeNull();
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
  getByText("1");
  getByText("3");
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
  results = screen.queryByText("1");
  expect(results).toBeNull();
  results = screen.queryByText("3");
  expect(results).toBeNull();
});

// ---------------------------------------------------------------- //
// ----------------------- POLYGON TESTS -------------------------- //
// ---------------------------------------------------------------- //
it("should render no polygon data when no polygon is defined", () => {
  const { getByText, getAllByText } = renderInfoboxSide({
    markerType: "polygon"
  });
  // Only headers
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
    polyline: geometry
  });
  // Only headers
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
    polygon: geometry
  });
  // Only headers
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
