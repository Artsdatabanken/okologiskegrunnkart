import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen
} from "@testing-library/react";
import "@testing-library/jest-dom";
import GrunnKartlag from "../../../src/Okologiskegrunnkart/GrunnKartlag/GrunnKartlag";
import kartlagMock from "../../tools/kartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;

function renderGrunnKartlag(args) {
  let defaultprops = {
    kartlag: kartlag,
    toggleSublayer: () => {},
    toggleAllSublayers: () => {},
    showSublayerDetails: false,
    legendVisible: false,
    setLegendVisible: () => {},
    legendPosition: "right",
    handleLegendPosition: () => {},
    handleSortKey: () => {},
    handleTagFilter: () => {},
    handleMatchAllFilters: () => {},
    isMobile: false,
    showFavoriteLayers: false,
    toggleShowFavoriteLayers: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<GrunnKartlag {...props} />);
}

it("should render all layer names and buttons in kartlag sorted by tema", () => {
  const {
    getAllByText,
    getByText,
    getAllByRole,
    getByTitle
  } = renderGrunnKartlag();
  getByText("Kartlag");
  getByText("Gruppert på tema");

  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  getByText("Arealressurs");
  getByText("Naturtyper");
  getByText("Skog");
  let arter = getAllByText("Arter");
  expect(arter.length).toBe(2);

  let owner = getAllByText("NIBIO");
  expect(owner.length).toBe(2);
  owner = getAllByText("Miljødirektoratet");
  expect(owner.length).toBe(2);
  getByText("Artsdatabanken");

  // Find all buttons
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // Find buttons with title
  getByTitle("Favoritter");
  getByTitle("Sortere");
  getByTitle("Filtrer");
  getByTitle("Åpne på venstre side");
});

it("should render all layer names and buttons in kartlag sorted alphabetically", async () => {
  const {
    getAllByText,
    getByText,
    getByTitle,
    findByText
  } = renderGrunnKartlag();
  getByText("Kartlag");
  getByText("Gruppert på tema");

  getByText("Arealressurs");
  getByText("Naturtyper");
  getByText("Skog");
  let arter = getAllByText("Arter");
  expect(arter.length).toBe(2);

  // Select sorting alphabetically
  fireEvent.click(getByTitle("Sortere"));
  await waitFor(() => findByText("Alfabetisk"));
  fireEvent.click(getByText("Alfabetisk"));

  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sorting type changed
  let sorting = screen.queryByTitle("Gruppert på tema");
  expect(sorting).toBeNull();
  sorting = getAllByText("Alfabetisk");
  expect(sorting.length).toBe(2);

  // Not visible tema
  let tema = screen.queryByTitle("Arealressurs");
  expect(tema).toBeNull();
  tema = screen.queryByTitle("Naturtyper");
  expect(tema).toBeNull();
  tema = screen.queryByTitle("Skog");
  expect(tema).toBeNull();
  tema = getAllByText("Arter");
  expect(tema.length).toBe(1);
});

it("should render all layer names and buttons in kartlag sorted by data owner", async () => {
  const {
    getAllByText,
    getByText,
    getByTitle,
    findByText
  } = renderGrunnKartlag();
  getByText("Kartlag");
  getByText("Gruppert på tema");

  getByText("Arealressurs");
  getByText("Naturtyper");
  getByText("Skog");
  let arter = getAllByText("Arter");
  expect(arter.length).toBe(2);

  let owner = getAllByText("NIBIO");
  expect(owner.length).toBe(2);
  owner = getAllByText("Miljødirektoratet");
  expect(owner.length).toBe(2);
  getByText("Artsdatabanken");

  // Select sorting by data owner
  fireEvent.click(getByTitle("Sortere"));
  await waitFor(() => findByText("Dataeier"));
  fireEvent.click(getByText("Dataeier"));

  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");

  // Sorting type changed
  let sorting = screen.queryByTitle("Gruppert på tema");
  expect(sorting).toBeNull();
  getByText("Gruppert på dataeier");

  // Data owners visible twice and in subheader
  getByText("Gruppert på dataeier");
  owner = getAllByText("NIBIO");
  expect(owner.length).toBe(3);
  expect(owner[0]).toHaveClass("MuiListSubheader-root");
  owner = getAllByText("Miljødirektoratet");
  expect(owner.length).toBe(3);
  expect(owner[0]).toHaveClass("MuiListSubheader-root");
  owner = getAllByText("Artsdatabanken");
  expect(owner.length).toBe(2);
  expect(owner[0]).toHaveClass("MuiListSubheader-root");
});
