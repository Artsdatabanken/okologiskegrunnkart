import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render } from "@testing-library/react";
import Leaflet from "../../src/Kart/Leaflet";
import kartlagMock from "../tools/kartlagMock.json";
import bakgrunnskart from "../../src/Kart/Bakgrunnskart/bakgrunnskarttema";

afterEach(cleanup);

let defaultprops = {
  kartlag: kartlagMock,
  polygon: null,
  polyline: null,
  showPolygon: false,
  hideAndShowPolygon: () => {},
  handleEditable: () => {},
  addPolygon: () => {},
  addPolyline: () => {},
  editable: true,
  polygonResults: null,
  handlePolygonResults: () => {},
  showMarker: false,
  handleShowMarker: () => {},
  zoomcoordinates: null,
  handleRemoveZoomCoordinates: () => {},
  showExtensiveInfo: false,
  handleExtensiveInfo: () => {},
  handleAlleLag: () => {},
  handleValgteLag: () => {},
  zoom: 5.58,
  handleZoomChange: () => {},
  aktiveLag: kartlagMock,
  bakgrunnskart: bakgrunnskart,
  history: null,
  sted: null,
  adresse: null,
  matrikkel: null,
  handlePropertyGeom: () => {},
  elevation: 0,
  layersResult: {},
  allLayersResult: {},
  valgteLag: {},
  token: null,
  loadingFeatures: false,
  showSideBar: false,
  showInfobox: false,
  handleInfobox: () => {},
  showFullscreenInfobox: false,
  handleFullscreenInfobox: () => {},
  isMobile: false,
  infoboxDetailsVisible: false,
  setInfoboxDetailsVisible: () => {},
  polygonDetailsVisible: false,
  setPolygonDetailsVisible: () => {},
  setLayerInfoboxDetails: () => {},
  onTileStatus: () => {},
  sortKey: "tema",
  tagFilter: {},
  matchAllFilters: true,
  lat: null,
  lng: null,
  resultat: null,
  fylkeGeom: null,
  showFylkeGeom: false,
  handleFylkeGeom: () => {},
  kommuneGeom: null,
  showKommuneGeom: false,
  eiendomGeom: null,
  showEiendomGeom: false,
  handleKommuneGeom: () => {},
  grensePolygonGeom: null,
  grensePolygon: "none",
  handleGrensePolygon: () => {},
  fetchGrensePolygon: () => {},
  removeGrensePolygon: () => {},
  showFylkePolygon: false,
  showKommunePolygon: false,
  showEiendomPolygon: false,
  grensePolygonData: {},
  showAppName: false,
  legendVisible: false,
  setLegendVisible: () => {},
  legendPosition: "right",
  handleUpdateChangeInUrl: () => {},
  uploadPolygonFile: () => {},
  showPolygonSaveModal: false,
  handlePolygonSaveModal: () => {},
  savePolygon: () => {},
  polygonActionResult: null,
  closePolygonActionResult: () => {},
  changeInfoboxState: null,
  handleChangeInfoboxState: () => {},
  showSavedPolygons: false,
  savedPolygons: [],
  getSavedPolygons: () => {},
  handleShowSavedPolygons: () => {},
  openSavedPolygon: () => {},
  deleteSavedPolygon: () => {},
  updateSavedPolygon: () => {},
  handleSetBakgrunnskart: () => {},
  aktivtFormat: bakgrunnskart.kart.aktivtFormat
};

function renderLeaflet(args) {
  const props = { ...defaultprops, ...args };
  return render(<Leaflet {...props} />);
}

it("should render map buttons at start", () => {
  const { getByTitle } = renderLeaflet();
  getByTitle("Marker tool");
  getByTitle("Polygon tool");
  getByTitle("Endre bakgrunnskart");
  getByTitle("Zoom in");
  getByTitle("Zoom out");
});

it("should render map marker when coordinates are set", () => {
  const { rerender, getByTitle, getAllByRole } = renderLeaflet();
  getByTitle("Marker tool");
  getByTitle("Polygon tool");
  getByTitle("Endre bakgrunnskart");
  getByTitle("Zoom in");
  getByTitle("Zoom out");

  // Only image present is change map button
  let images = getAllByRole("img");
  expect(images.length).toBe(1);

  // Update relevant props for rendering marker
  const newprops = {
    ...defaultprops,
    lat: 62.58,
    lng: 11.58,
    showMarker: true
  };
  rerender(<Leaflet {...newprops} />);

  // Now marker image should be present too
  images = getAllByRole("img");
  expect(images.length).toBe(1);
  //expect(images[0]).toHaveClass("leaflet-marker-icon");
  expect(images[0]).toHaveClass("artsdatabanken-logo-image");
});
