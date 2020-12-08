import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import KartlagFanen from "../../src/Okologiskegrunnkart/KartlagFanen";
import kartlagMock from "../tools/kartlagMock.json";
import favorittkartlagMock from "../tools/favorittkartlagMock.json";

afterEach(cleanup);

const kartlag = kartlagMock;
const favorittkartlag = favorittkartlagMock;

function renderKartlagFanen(args) {
  let defaultprops = {
    searchResultPage: false,
    removeValgtLag: () => {},
    valgtLag: null,
    onUpdateLayerProp: () => {},
    changeVisibleSublayers: () => {},
    kartlag: kartlag,
    showSideBar: true,
    handleSideBar: () => {},
    sublayerDetailsVisible: false,
    setSublayerDetailsVisible: () => {},
    legendVisible: false,
    setLegendVisible: () => {},
    legendPosition: "right",
    handleLegendPosition: () => {},
    updateIsMobile: () => {},
    updateWindowHeight: () => {},
    handleSelectSearchResult: () => {},
    handleSortKey: () => {},
    handleTagFilter: () => {},
    handleMatchAllFilters: () => {},
    showFavoriteLayers: false,
    toggleShowFavoriteLayers: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<KartlagFanen {...props} />);
}

it("should render all layer names and data owners in kartlag", () => {
  const { getByText, getAllByText } = renderKartlagFanen();
  getByText("Kartlag");
  getByText("Gruppert på tema");

  getByText("Livsmiljøer");
  getByText("Arealressurs: AR5");
  getByText("Naturtyper - NiN Mdir");
  getByText("Naturtyper - DN Håndbok 13");
  getByText("Arter - Rødlista");
  let owner = getAllByText("NIBIO");
  expect(owner.length).toBe(2);
  owner = getAllByText("Miljødirektoratet");
  expect(owner.length).toBe(2);
  getByText("Artsdatabanken");
});

it("should render only favorites when favorites are selected", () => {
  const { getByText } = renderKartlagFanen({
    kartlag: favorittkartlag,
    showFavoriteLayers: true
  });
  getByText("Favorittkartlag");
  getByText("Gruppert på tema");

  getByText("Arealressurs: AR5");
  getByText("Arter - Rødlista");
  getByText("NIBIO");
  getByText("Artsdatabanken");

  let layer = screen.queryByText("Livsmiljøer");
  expect(layer).toBeNull();

  layer = screen.queryByText("Naturtyper - NiN Mdir");
  expect(layer).toBeNull();

  layer = screen.queryByText("Naturtyper - DN Håndbok 13");
  expect(layer).toBeNull();

  layer = screen.queryByText("Miljødirektoratet");
  expect(layer).toBeNull();
});
