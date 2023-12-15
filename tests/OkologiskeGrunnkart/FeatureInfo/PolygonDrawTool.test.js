import React from "react";
import { cleanup, getByTestId, render, screen } from "@testing-library/react";
import PolygonDrawTool from "../../../src/Okologiskegrunnkart/FeatureInfo/PolygonDrawTool";
import { geometry1 } from "../../tools/polygonDataMock";

afterEach(cleanup);

const geometry = geometry1();

function renderPolygonDrawTool(args) {
  let defaultprops = {
    polygon: null,
    polyline: null,
    showPolygon: false,
    hideAndShowPolygon: () => {},
    handleEditable: () => {},
    addPolygon: () => {},
    addPolyline: () => {},
    handlePolygonResults: () => {},
    grensePolygon: "none",
    handleGrensePolygon: () => {},
    removeGrensePolygon: () => {},
    showPolygonOptions: false,
    setShowPolygonOptions: () => {},
    showFylkePolygon: false,
    showKommunePolygon: false,
    showEiendomPolygon: false,
    uploadPolygonFile: () => {},
    handlePolygonSaveModal: () => {},
    getSavedPolygons: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<PolygonDrawTool {...props} />);
}

it("should render only 6 buttons and header button when polygon options are closed", () => {
  const { getByText, getAllByRole, getByTitle } = renderPolygonDrawTool();
  // Headers
  getByText("Velg polygon");
  getByText("Geometri");
  // No polygon options
  let option = screen.queryByText("Definer polygon fra grenser");
  expect(option).toBeNull();
  option = screen.queryByText("Ingen (selvtegnet)");
  expect(option).toBeNull();
  option = screen.queryByText("Fylke");
  expect(option).toBeNull();
  option = screen.queryByText("Kommune");
  expect(option).toBeNull();
  option = screen.queryByText("Eiendom");
  expect(option).toBeNull();
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(7);
  //console.log("Dette er knappen", buttons[0]);
  screen.getByLabelText("Last opp polygon");
  screen.getByLabelText("Last opp polygon");
  screen.getByLabelText("Åpne lagret polygon");
  screen.getByLabelText("Angre sist");
  screen.getByLabelText("Ferdig");
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");

  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
});

it("should render 6 buttons, header button and options when polygon options are open", () => {
  const { getByText, getAllByRole, getByTitle } = renderPolygonDrawTool({
    showPolygonOptions: true
  });
  // Headers
  getByText("Velg polygon");
  getByText("Geometri");
  // Polygon options
  getByText("Definer polygon fra grenser");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(7);
  screen.getByLabelText("Last opp polygon");
  screen.getByLabelText("Åpne lagret polygon");
  screen.getByLabelText("Angre sist");
  screen.getByLabelText("Ferdig");
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");
  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
});

it("should render 2 buttons and header button when fylke is selected", () => {
  const { getByText, getAllByRole, getByTitle } = renderPolygonDrawTool({
    showPolygonOptions: true,
    grensePolygon: "fylke"
  });
  // Headers
  getByText("Velg polygon");
  getByText("Geometri");
  // Polygon options
  getByText("Definer polygon fra grenser");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(3);
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");
  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Last opp polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Åpne lagret polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Angre sist");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Ferdig");
  expect(buttons).toBeNull();
});

it("should render 2 buttons and header button when kommune is selected", () => {
  const { getByText, getAllByRole, getByTitle } = renderPolygonDrawTool({
    showPolygonOptions: true,
    grensePolygon: "kommune"
  });
  // Headers
  getByText("Velg polygon");
  getByText("Geometri");
  // Polygon options
  getByText("Definer polygon fra grenser");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(3);
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");
  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Last opp polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Åpne lagret polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Angre sist");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Ferdig");
  expect(buttons).toBeNull();
});

it("should render 2 buttons and header button when eiendom is selected", () => {
  const { getByText, getAllByRole, getByTitle } = renderPolygonDrawTool({
    showPolygonOptions: true,
    grensePolygon: "eiendom"
  });
  // Headers
  getByText("Velg polygon");
  getByText("Geometri");
  // Polygon options
  getByText("Definer polygon fra grenser");
  getByText("Ingen (selvtegnet)");
  getByText("Fylke");
  getByText("Kommune");
  getByText("Eiendom");
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(3);
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");
  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Last opp polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Åpne lagret polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Angre sist");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Ferdig");
  expect(buttons).toBeNull();
});

it("should render undo and done polygon when polyline is selected", () => {
  const { getAllByRole, getByTitle } = renderPolygonDrawTool({
    polyline: geometry
  });
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(7);
  /* getByTitle("Last opp polygon");
  getByTitle("Åpne lagret polygon");
  getByTitle("Angre sist");
  getByTitle("Ferdig");
  getByTitle("Vis/Gjem");
  getByTitle("Fjern"); */
  // Not visible buttons
  buttons = screen.queryByTitle("Lagre polygon");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Rediger");
  expect(buttons).toBeNull();
});

it("should render save and edit polygon when polygon is selected", () => {
  const { getAllByRole, getByTitle } = renderPolygonDrawTool({
    polygon: geometry
  });
  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(7);
  screen.getByLabelText("Last opp polygon");
  screen.getByLabelText("Åpne lagret polygon");
  screen.getByLabelText("Lagre polygon");
  screen.getByLabelText("Rediger");
  screen.getByLabelText("Vis/Gjem");
  screen.getByLabelText("Fjern");
  // Not visible buttons
  buttons = screen.queryByTitle("Angre sist");
  expect(buttons).toBeNull();
  buttons = screen.queryByTitle("Ferdig");
  expect(buttons).toBeNull();
});
