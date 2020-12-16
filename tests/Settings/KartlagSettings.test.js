import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import "@testing-library/jest-dom";
import KartlagSettings from "../../src/Settings/KartlagSettings";
import kartlagMock from "../tools/kartlagMock.json";

afterEach(cleanup);

function renderKartlagSettings(args) {
  let defaultprops = {
    kartlag: kartlagMock,
    someLayersFavorite: "some",
    handleSomeLayersFavorite: () => {},
    toggleEditLayers: () => {},
    updateFavoriteLayers: () => {},
    handleShowFavoriteLayers: () => {},
    isMobile: false
  };

  const props = { ...defaultprops, ...args };
  return render(<KartlagSettings {...props} />);
}

it("should render tree with layers checked as defined in kartlag", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    queryByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(6);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[4]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[5]).toBeChecked(); // Arter - Rødlista

  // Open layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Arealressurs: AR5 Arealtype"));

  // Sublayers visible
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Some checkboxes checked
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista

  // Close layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitForElementToBeRemoved(() =>
    queryByText("Arealressurs: AR5 Arealtype")
  );

  // Sublayers not visible
  let sublayer = queryByText("Arealressurs: AR5 Arealtype");
  expect(sublayer).toBeNull();
  sublayer = queryByText("Jordbruksareal");
  expect(sublayer).toBeNull();
  sublayer = queryByText("Treslag");
  expect(sublayer).toBeNull();

  // Close tree
  fireEvent.click(getByText("Kartlag"));
  await waitForElementToBeRemoved(() => queryByText("Arealressurs: AR5"));

  // Layers not visible
  let layer = queryByText("Arealressurs: AR5");
  expect(layer).toBeNull();
  layer = queryByText("Livsmiljøer");
  expect(layer).toBeNull();
  layer = queryByText("Naturtyper - NiN Mdir");
  expect(layer).toBeNull();
  layer = queryByText("Naturtyper - DN Håndbok 13");
  expect(layer).toBeNull();
  layer = queryByText("Arter - Rødlista");
  expect(layer).toBeNull();
});

it("should uncheck all sublayers in layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Arealressurs: AR5 Arealtype"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[2]).toHaveAttribute("data-indeterminate", "false"); // Arealsressurs
  expect(boxes[3]).toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista

  // Uncheck sublayers
  fireEvent.click(boxes[3]); // Arealressurs: AR5 Arealtype
  fireEvent.click(boxes[4]); // Jordbruksareal
  fireEvent.click(boxes[5]); // Treslag

  // Checkboxes updated
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).not.toBeChecked(); // Arealressurs
  expect(boxes[2]).toHaveAttribute("data-indeterminate", "false"); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).not.toBeChecked(); // Jordbruksareal
  expect(boxes[5]).not.toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista
});

it("should uncheck some sublayers in layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Arealressurs: AR5 Arealtype"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[2]).toHaveAttribute("data-indeterminate", "false"); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista

  // Uncheck sublayers
  fireEvent.click(boxes[3]); // Arealressurs: AR5 Arealtype
  fireEvent.click(boxes[4]); // Jordbruksareal

  // Checkboxes updated (Arealressurs indeterminated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[2]).toHaveAttribute("data-indeterminate", "true"); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).not.toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista
});

it("should check all sublayers in layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Naturtyper - NiN Mdir"));
  await waitFor(() => findByText("Naturtyper Mdir"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Naturtyper Mdir");
  getByText("Dekningskart");
  getByText("Naturtype NiN - Svært høy lokalitetskvalitet");
  getByText("Naturtype NiN - høy kvalitet");
  getByText("Naturtype NiN - moderat kvalitet");
  getByText("Naturtype NiN - lav kvalitet");
  getByText("Naturtype NiN - ikke kvalitetsvurdert");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[3]).toHaveAttribute("data-indeterminate", "false"); // Naturtyper - NiN Mdir
  expect(boxes[4]).not.toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).not.toBeChecked(); // Dekningskart
  expect(boxes[6]).not.toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).not.toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).not.toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).not.toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).not.toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista

  // Check sublayers
  fireEvent.click(boxes[4]); // Naturtyper Mdir
  fireEvent.click(boxes[5]); // Dekningskart
  fireEvent.click(boxes[6]); // Naturtype NiN - Svært høy lokalitetskvalitet
  fireEvent.click(boxes[7]); // Naturtype NiN - høy kvalitet
  fireEvent.click(boxes[8]); // Naturtype NiN - moderat kvalitet
  fireEvent.click(boxes[9]); // Naturtype NiN - lav kvalitet
  fireEvent.click(boxes[10]); // Naturtype NiN - ikke kvalitetsvurdert

  // Checkboxes updated
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[3]).toHaveAttribute("data-indeterminate", "false"); // Naturtyper - NiN Mdir
  expect(boxes[4]).toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).toBeChecked(); // Dekningskart
  expect(boxes[6]).toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista
});

it("should check some sublayers in layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Naturtyper - NiN Mdir"));
  await waitFor(() => findByText("Naturtyper Mdir"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Naturtyper Mdir");
  getByText("Dekningskart");
  getByText("Naturtype NiN - Svært høy lokalitetskvalitet");
  getByText("Naturtype NiN - høy kvalitet");
  getByText("Naturtype NiN - moderat kvalitet");
  getByText("Naturtype NiN - lav kvalitet");
  getByText("Naturtype NiN - ikke kvalitetsvurdert");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[3]).toHaveAttribute("data-indeterminate", "false"); // Naturtyper - NiN Mdir
  expect(boxes[4]).not.toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).not.toBeChecked(); // Dekningskart
  expect(boxes[6]).not.toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).not.toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).not.toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).not.toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).not.toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista

  // Check sublayers
  fireEvent.click(boxes[4]); // Naturtyper Mdir
  fireEvent.click(boxes[5]); // Dekningskart
  fireEvent.click(boxes[6]); // Naturtype NiN - Svært høy lokalitetskvalitet
  fireEvent.click(boxes[7]); // Naturtype NiN - høy kvalitet
  fireEvent.click(boxes[8]); // Naturtype NiN - moderat kvalitet
  fireEvent.click(boxes[9]); // Naturtype NiN - lav kvalitet

  // Checkboxes updated (Naturtyper - NiN Mdir indeterminated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[3]).toHaveAttribute("data-indeterminate", "true"); // Naturtyper - NiN Mdir
  expect(boxes[4]).toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).toBeChecked(); // Dekningskart
  expect(boxes[6]).toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).not.toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista
});

it("should uncheck layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Arealressurs: AR5 Arealtype"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista

  // Uncheck layer
  fireEvent.click(boxes[2]); // Arealressurs

  // Checkboxes updated (kartlag indeterminated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).not.toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).not.toBeChecked(); // Jordbruksareal
  expect(boxes[5]).not.toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista
});

it("should check layer", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Naturtyper - NiN Mdir"));
  await waitFor(() => findByText("Naturtyper Mdir"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Naturtyper Mdir");
  getByText("Dekningskart");
  getByText("Naturtype NiN - Svært høy lokalitetskvalitet");
  getByText("Naturtype NiN - høy kvalitet");
  getByText("Naturtype NiN - moderat kvalitet");
  getByText("Naturtype NiN - lav kvalitet");
  getByText("Naturtype NiN - ikke kvalitetsvurdert");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[4]).not.toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).not.toBeChecked(); // Dekningskart
  expect(boxes[6]).not.toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).not.toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).not.toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).not.toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).not.toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista

  // Check layer
  fireEvent.click(boxes[3]); // Arealressurs

  // Checkboxes updated (kartlag indeterminated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[4]).toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).toBeChecked(); // Dekningskart
  expect(boxes[6]).toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista
});

it("should uncheck kartlag", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Arealressurs: AR5"));
  await waitFor(() => findByText("Arealressurs: AR5 Arealtype"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Jordbruksareal");
  getByText("Treslag");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).toBeChecked(); // Jordbruksareal
  expect(boxes[5]).toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).toBeChecked(); // Arter - Rødlista

  // Uncheck kartlag
  fireEvent.click(boxes[0]); // Arealressurs

  // Checkboxes updated (kartlag determinated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(9);
  expect(boxes[0]).not.toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "false"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).not.toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Arealressurs: AR5 Arealtype
  expect(boxes[4]).not.toBeChecked(); // Jordbruksareal
  expect(boxes[5]).not.toBeChecked(); // Treslag
  expect(boxes[6]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[7]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[8]).not.toBeChecked(); // Arter - Rødlista
});

it("should check kartlag", async () => {
  // Checked boxes are based on favorite status in kartlagMock
  const {
    getByText,
    findByText,
    getByRole,
    getAllByRole
  } = renderKartlagSettings();
  getByText("Kartlag");

  // Kartlag checkbox checked
  let box = getByRole("checkbox");
  expect(box).toBeChecked();

  // Open tree
  fireEvent.click(getByText("Kartlag"));
  await waitFor(() => findByText("Arealressurs: AR5"));

  // Open layer
  fireEvent.click(getByText("Naturtyper - NiN Mdir"));
  await waitFor(() => findByText("Naturtyper Mdir"));

  // Layers visible
  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sublayers visible
  getByText("Naturtyper Mdir");
  getByText("Dekningskart");
  getByText("Naturtype NiN - Svært høy lokalitetskvalitet");
  getByText("Naturtype NiN - høy kvalitet");
  getByText("Naturtype NiN - moderat kvalitet");
  getByText("Naturtype NiN - lav kvalitet");
  getByText("Naturtype NiN - ikke kvalitetsvurdert");

  // Some checkboxes checked (kartlag indeterminated)
  let boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "true"); // Kartlag
  expect(boxes[1]).not.toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).not.toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[4]).not.toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).not.toBeChecked(); // Dekningskart
  expect(boxes[6]).not.toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).not.toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).not.toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).not.toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).not.toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).not.toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista

  // Uncheck and check kartlag
  fireEvent.click(boxes[0]); // Arealressurs
  fireEvent.click(boxes[0]); // Arealressurs

  // Checkboxes updated (kartlag determinated)
  boxes = getAllByRole("checkbox");
  expect(boxes.length).toBe(13);
  expect(boxes[0]).toBeChecked(); // Kartlag
  expect(boxes[0]).toHaveAttribute("data-indeterminate", "false"); // Kartlag
  expect(boxes[1]).toBeChecked(); // Livsmiljøer
  expect(boxes[2]).toBeChecked(); // Arealressurs
  expect(boxes[3]).toBeChecked(); // Naturtyper - NiN Mdir
  expect(boxes[4]).toBeChecked(); // Naturtyper Mdir
  expect(boxes[5]).toBeChecked(); // Dekningskart
  expect(boxes[6]).toBeChecked(); // Naturtype NiN - Svært høy lokalitetskvalitet
  expect(boxes[7]).toBeChecked(); // Naturtype NiN - høy kvalitet
  expect(boxes[8]).toBeChecked(); // Naturtype NiN - moderat kvalitet
  expect(boxes[9]).toBeChecked(); // Naturtype NiN - lav kvalitet
  expect(boxes[10]).toBeChecked(); // Naturtype NiN - ikke kvalitetsvurdert
  expect(boxes[11]).toBeChecked(); // Naturtyper - DN Håndbok 13
  expect(boxes[12]).toBeChecked(); // Arter - Rødlista
});
