import React from "react";
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen
} from "@testing-library/react";
import TreffListe from "../../../src/Okologiskegrunnkart/SearchBar/TreffListe";
import {
  numberMatches,
  treffliste_lag,
  treffliste_underlag,
  treffliste_sted,
  treffliste_adresse,
  treffliste_kommune,
  treffliste_knr,
  treffliste_gnr,
  treffliste_bnr,
  treffliste_knrgnrbnr,
  treffliste_koord
} from "../../tools/trefflisteMock.js";
jest.mock("../../../src/Funksjoner/backend.js"); // jest mocks everything in that file

afterEach(cleanup);

function renderTreffListe(args) {
  let defaultprops = {
    onSelectSearchResult: () => {},
    searchResultPage: false,
    searchTerm: null,
    handleSearchBar: () => {},
    treffliste_lag: null,
    treffliste_underlag: null,
    treffliste_sted: null,
    treffliste_kommune: null,
    treffliste_knr: null,
    treffliste_gnr: null,
    treffliste_bnr: null,
    treffliste_adresse: null,
    treffliste_knrgnrbnr: null,
    treffliste_koord: null,
    number_places: 0,
    number_knrgnrbnr: 0,
    number_kommune: 0,
    number_knr: 0,
    number_gnr: 0,
    number_bnr: 0,
    number_addresses: 0,
    number_layers: 0,
    number_coord: 0,
    removeValgtLag: () => {},
    addValgtLag: () => {},
    handleGeoSelection: () => {},
    handleRemoveTreffliste: () => {},
    isMobile: false,
    windowHeight: 970,
    handleSideBar: () => {},
    handleInfobox: () => {},
    handleFullscreenInfobox: () => {}
  };

  const props = { ...defaultprops, ...args };
  return render(<TreffListe {...props} />);
}

it("should render search results on pop-up window", () => {
  const { getByText, getAllByRole } = renderTreffListe({
    treffliste_lag: treffliste_lag(),
    treffliste_underlag: treffliste_underlag()
  });
  getByText("Arealressurs: AR5");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Treslag");
  getByText("Naturtyper - NiN Mdir");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");

  // Buttons: search results
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
});
