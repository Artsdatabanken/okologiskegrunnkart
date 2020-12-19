import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  getByDisplayValue,
  waitFor
} from "@testing-library/react";
import "@testing-library/jest-dom";
import PolygonActions from "../../src/Kart/PolygonActions";
import { savedGeometries } from "../tools/polygonDataMock";

afterEach(cleanup);

function renderPolygonActions(args) {
  let defaultprops = {
    showPolygonSaveModal: false,
    handlePolygonSaveModal: () => {},
    polygonActionResult: null,
    closePolygonActionResult: () => {},
    savePolygon: () => {},
    showSavedPolygons: false,
    savedPolygons: [],
    handleShowSavedPolygons: () => {},
    openSavedPolygon: () => {},
    deleteSavedPolygon: () => {},
    updateSavedPolygon: () => {},
    polylineError: false,
    handlePolylineError: () => {},
    isMobile: false
  };

  const props = { ...defaultprops, ...args };
  return render(<PolygonActions {...props} />);
}

it("should render error snackbar", () => {
  const { getByText } = renderPolygonActions({
    polygonActionResult: [
      "test_error",
      "This is a test that should render an error"
    ]
  });
  // Content
  let snackbar = getByText("This is a test that should render an error");
  expect(snackbar).toHaveClass("polygon-action-error");
});

it("should render success snackbar", () => {
  const { getByText } = renderPolygonActions({
    polygonActionResult: [
      "test_success",
      "This is a test that should render a success"
    ]
  });
  // Content
  let snackbar = getByText("This is a test that should render a success");
  expect(snackbar).toHaveClass("polygon-action-success");
});

it("should render a polyline error snackbar", () => {
  const { getByText } = renderPolygonActions({
    polylineError: true
  });
  // Content
  let snackbar = getByText("Polygon kanter kan ikke krysse");
  expect(snackbar).toHaveClass("polygon-action-error");
});

it("should render the save polygon modal", () => {
  const { getByText, getByLabelText, getAllByRole } = renderPolygonActions({
    showPolygonSaveModal: true
  });
  // Content
  getByText("Lagre polygon");
  getByText("Lagre");
  getByLabelText("Navn");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");
  expect(buttons[1]).toHaveAttribute("id", "confirm-save-polygon");
});

it("should render the open-edit-delete polygon modal", () => {
  const { getByText, getAllByRole } = renderPolygonActions({
    showSavedPolygons: true,
    savedPolygons: savedGeometries()
  });
  // Content
  getByText("Åpne lagret polygon");
  getByText("Test 1");
  getByText("Test 2");
  getByText("Test 3");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  expect(buttons[1]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[2]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[3]).toHaveAttribute("id", "delete-polygon-button");

  // Second row
  expect(buttons[4]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[5]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[6]).toHaveAttribute("id", "delete-polygon-button");

  // Third row
  expect(buttons[7]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[8]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[9]).toHaveAttribute("id", "delete-polygon-button");
});

it("should render editing options in open-edit-delete polygon modal", () => {
  const {
    getByText,
    getByLabelText,
    getByDisplayValue,
    getAllByRole
  } = renderPolygonActions({
    showSavedPolygons: true,
    savedPolygons: savedGeometries()
  });
  // Content
  getByText("Åpne lagret polygon");
  getByText("Test 1");
  getByText("Test 2");
  getByText("Test 3");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // Edit first polygon
  fireEvent.click(buttons[2]);

  // Buttons changed
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  getByLabelText("Navn");
  getByDisplayValue("Test 1");
  expect(buttons[1]).toHaveAttribute("id", "save-edited-polygon-button");
  expect(buttons[2]).toHaveAttribute("id", "delete-polygon-button");

  // Second row
  expect(buttons[3]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[4]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[5]).toHaveAttribute("id", "delete-polygon-button");

  // Third row
  expect(buttons[6]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[7]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[8]).toHaveAttribute("id", "delete-polygon-button");
});

it("edit and save polygon without changes in open-edit-delete polygon modal", () => {
  const {
    getByText,
    getByLabelText,
    getByDisplayValue,
    getAllByRole
  } = renderPolygonActions({
    showSavedPolygons: true,
    savedPolygons: savedGeometries()
  });
  // Content
  getByText("Åpne lagret polygon");
  getByText("Test 1");
  getByText("Test 2");
  getByText("Test 3");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // Edit first polygon
  expect(buttons[2]).toHaveAttribute("id", "edit-polygon-button");
  fireEvent.click(buttons[2]);

  // Buttons changed
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  getByLabelText("Navn");
  getByDisplayValue("Test 1");
  expect(buttons[1]).toHaveAttribute("id", "save-edited-polygon-button");
  expect(buttons[2]).toHaveAttribute("id", "delete-polygon-button");

  // Save polygon without changes
  fireEvent.click(buttons[1]);

  // Original status
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  expect(buttons[1]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[2]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[3]).toHaveAttribute("id", "delete-polygon-button");

  // Second row
  expect(buttons[4]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[5]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[6]).toHaveAttribute("id", "delete-polygon-button");

  // Third row
  expect(buttons[7]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[8]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[9]).toHaveAttribute("id", "delete-polygon-button");
});

it("edit and edit another polygon without saving in open-edit-delete polygon modal", () => {
  const {
    getByText,
    getByLabelText,
    getByDisplayValue,
    getAllByRole
  } = renderPolygonActions({
    showSavedPolygons: true,
    savedPolygons: savedGeometries()
  });
  // Content
  getByText("Åpne lagret polygon");
  getByText("Test 1");
  getByText("Test 2");
  getByText("Test 3");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // Edit first polygon
  expect(buttons[2]).toHaveAttribute("id", "edit-polygon-button");
  fireEvent.click(buttons[2]);

  // Buttons changed
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  getByLabelText("Navn");
  let input = getByDisplayValue("Test 1");
  expect(buttons[1]).toHaveAttribute("id", "save-edited-polygon-button");
  expect(buttons[2]).toHaveAttribute("id", "delete-polygon-button");

  // Change input
  fireEvent.change(input, { target: { value: "123" } });

  // Change to edit another polygon without saving changes
  expect(buttons[7]).toHaveAttribute("id", "edit-polygon-button");
  fireEvent.click(buttons[7]);

  // Different status
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  expect(buttons[0]).toHaveClass("polygon-modal-button-wrapper");

  // First row
  expect(buttons[1]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[2]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[3]).toHaveAttribute("id", "delete-polygon-button");

  // Second row
  expect(buttons[4]).toHaveAttribute("id", "saved-polygons-row");
  expect(buttons[5]).toHaveAttribute("id", "edit-polygon-button");
  expect(buttons[6]).toHaveAttribute("id", "delete-polygon-button");

  // Third row
  getByLabelText("Navn");
  input = getByDisplayValue("Test 3");
  expect(buttons[7]).toHaveAttribute("id", "save-edited-polygon-button");
  expect(buttons[8]).toHaveAttribute("id", "delete-polygon-button");
});

it("should render confirm delete polygon modal", async () => {
  const { getByText, getAllByRole, findByText } = renderPolygonActions({
    showSavedPolygons: true,
    savedPolygons: savedGeometries()
  });
  // Content
  getByText("Åpne lagret polygon");
  getByText("Test 1");
  getByText("Test 2");
  getByText("Test 3");

  // Buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // Delete first polygon
  expect(buttons[3]).toHaveAttribute("id", "delete-polygon-button");
  fireEvent.click(buttons[3]);
  await waitFor(() => findByText("Slette polygon"));

  getByText('Vil du slette "Test 1"?');
  getByText("Avbryt");
  getByText("Slett");

  // Buttons in delete modal
  let modalbuttons = getAllByRole("button");
  expect(modalbuttons.length).toBe(3);
  expect(modalbuttons[0]).toHaveClass("polygon-delete-modal-button-wrapper");
  expect(modalbuttons[1]).toHaveAttribute("id", "cancel-delete-polygon");
  expect(modalbuttons[2]).toHaveAttribute("id", "confirm-delete-polygon");
});
