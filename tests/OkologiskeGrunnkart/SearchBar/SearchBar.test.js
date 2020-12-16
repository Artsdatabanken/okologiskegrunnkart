import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen
} from "@testing-library/react";
import SearchBar from "../../../src/Okologiskegrunnkart/SearchBar/SearchBar";
import kartlagMock from "../../tools/kartlagMock.json";
import backend from "../../../src/Funksjoner/backend"; // the function to mock
jest.mock("../../../src/Funksjoner/backend.js"); // jest mocks everything in that file

afterEach(cleanup);

function renderSearchBar(args) {
  let defaultprops = {
    onSelectSearchResult: () => {},
    searchResultPage: false,
    handleGeoSelection: () => {},
    kartlag: kartlagMock,
    addValgtLag: () => {},
    removeValgtLag: () => {},
    onUpdateLayerProp: () => {},
    toggleEditLayers: () => {},
    showFavoriteLayers: false,
    toggleShowFavoriteLayers: () => {},
    isMobile: false,
    windowHeight: 0,
    showSideBar: true,
    handleSideBar: () => {},
    handleInfobox: () => {},
    handleFullscreenInfobox: () => {},
    loadingFeatures: false,
    handleAboutModal: () => {},
    uploadPolygonFile: () => {},
    getSavedPolygons: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<SearchBar {...props} />);
}

it("should render empty searchbar at start", () => {
  const { getByText, getByPlaceholderText, getAllByRole } = renderSearchBar();
  getByText("Søk");
  getByPlaceholderText("Søk etter kartlag eller område...");
  // Buttons: search & menu
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);
});

it("should render X-button when something is written in the search field", () => {
  backend.hentKommune.mockResolvedValue(null);
  backend.hentKnrGnrBnr.mockResolvedValue(null);
  backend.hentSteder.mockResolvedValue(null);
  backend.hentAdresse.mockResolvedValue(null);

  const { getByText, getByPlaceholderText, getAllByRole } = renderSearchBar();

  const input = getByPlaceholderText("Søk etter kartlag eller område...");
  fireEvent.change(input, { target: { value: "123" } });

  // Buttons: search, menu & X-button
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(3);
  getByText("X");
});

it("should render 3 layer results when 'arter' is written in the search field", () => {
  backend.hentKommune.mockResolvedValue(null);
  backend.hentKnrGnrBnr.mockResolvedValue(null);
  backend.hentSteder.mockResolvedValue(null);
  backend.hentAdresse.mockResolvedValue(null);

  const { getByText, getByPlaceholderText, getAllByRole } = renderSearchBar();

  const input = getByPlaceholderText("Søk etter kartlag eller område...");
  fireEvent.change(input, { target: { value: "arter" } });

  // Buttons: search, menu, X-button & 1 result
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(4);
  getByText("Arter - Rødlista");
  getByText("Kartlag");
});

it("should remove search results and X-button after clicking X-button", () => {
  backend.hentKommune.mockResolvedValue(null);
  backend.hentKnrGnrBnr.mockResolvedValue(null);
  backend.hentSteder.mockResolvedValue(null);
  backend.hentAdresse.mockResolvedValue(null);

  const { getByText, getByPlaceholderText, getAllByRole } = renderSearchBar();

  const input = getByPlaceholderText("Søk etter kartlag eller område...");
  fireEvent.change(input, { target: { value: "arter" } });

  // Buttons: search, menu & X-button
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(4);
  getByText("X");
  getByText("Arter - Rødlista");

  // Click X-button
  fireEvent.click(getByText("X"));
  let xButton = screen.queryByText("X");
  expect(xButton).toBeNull();
  let inputText = screen.queryByText("Arter - Rødlista");
  expect(inputText).toBeNull();
});

it("should render drawer menu when clicking help button", async () => {
  const {
    getByText,
    getAllByRole,
    queryByText,
    findByText
  } = renderSearchBar();

  // Buttons: search & menu
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(2);

  // Drawer header not visible
  let drawer = queryByText("Økologiske grunnkart");
  expect(drawer).not.toBeNull();

  // Click menu button and openm drawer
  fireEvent.click(buttons[1]);
  await waitFor(() => findByText("Økologiske grunnkart"));

  // Check relevant fields exist in drawer
  getByText('Om "Økologiske Grunnkart"');
  getByText("Brukermanual");
  getByText("Vis favorittkartlag");
  getByText("Vis alle kartlag");
  getByText("Endre favorittkartlag");
  getByText("Last opp polygon");
  getByText("Åpne lagret polygon");
  getByText("Last ned data");
  getByText("Kildekode");
  getByText("Tilbakemeldinger");
  getByText("Artsdatabanken");
});
