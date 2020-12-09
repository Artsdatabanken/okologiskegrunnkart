import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  screen,
  waitFor
} from "@testing-library/react";
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
// import favorittkartlagMock from "../../tools/favorittkartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;
const emptyPointResults = emptyPointResultsMock;
const pointResults = pointResultsMock;
const resultCoordinates = [12.719764709472658, 65.35159239323426];

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

it("should render no point data when no coordinates are defined", () => {
  const { getByText } = renderInfoboxSide();
  getByText("--° N --° Ø");
  getByText("- / -");
  getByText("Marker grenser");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  getByText("Valgte kartlag");
  getByText("Alle kartlag");
});

it("should render no polygon data when no coordinates are defined", () => {
  const { getByText, getAllByText } = renderInfoboxSide({
    markerType: "polygon"
  });
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

  getByText("Arter");
  getByText("Arealressurs");
  getByText("Arter - Rødlista");
  getByText("Artsdatabanken");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");

  let result = getAllByText("Ingen treff");
  expect(result.length).toBe(2);

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

  getByText("Arter");
  getByText("Arealressurs");
  getByText("Arter - Rødlista");
  getByText("Artsdatabanken");
  getByText("Arealressurs: AR5");
  getByText("NIBIO");
  getByText("Gubbeskjegg. Alectoria sarmentosa");
  getByText("Produktiv skog");

  getByText("1");
  getByText("3");
});
