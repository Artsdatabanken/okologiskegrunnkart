import React from "react";
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
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

const numbers = numberMatches();

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

// -------------------------------------------------------------- //
// ------------------------- POP-UP LIST ------------------------ //
// -------------------------------------------------------------- //
it("should render layer search results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_lag: treffliste_lag(),
      treffliste_underlag: treffliste_underlag()
    }
  );
  // Search results content
  getByText("Arealressurs: AR5");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Treslag");
  getByText("Naturtyper - NiN Mdir");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");

  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);
  let layers = getAllByText("Kartlag");
  expect(layers.length).toBe(3);
  let sublayers = getAllByText("Underlag");
  expect(sublayers.length).toBe(6);
  let tema = getAllByText("Arealressurs");
  expect(tema.length).toBe(3);
  tema = getAllByText("Naturtyper");
  expect(tema.length).toBe(1);
  tema = getAllByText("Arter");
  expect(tema.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render place results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_sted: treffliste_sted()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(4);

  getByText("Sarpsborg");
  getByText("Stedsnavn, By i Sarpsborg");
  getByText("487975");

  getByText("Svelvik");
  getByText("Stedsnavn, By i Drammen");
  getByText("124591");

  getByText("Suortá");
  getByText("685163");

  let places = getAllByText("Stedsnavn, By i Sortland - Suortá");
  expect(places.length).toBe(1);

  getByText("Stokmarknes");
  getByText("Stedsnavn, By i Hadsel");
  getByText("260956");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render address results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_adresse: treffliste_adresse()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(5);

  getByText("Ospelia s. 44");
  getByText("4202-172-322");

  getByText("Ospelia s. 47");
  getByText("4202-172-313");

  getByText("Ospelia s. 42");
  getByText("4202-172-323");

  getByText("Ospelia s. 53");
  getByText("4202-172-316");

  getByText("Ospelia s. 55");
  getByText("4202-172-317");

  let addresses = getAllByText("Adresse 4888 HOMBORSUND");
  expect(addresses.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render kommune results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_kommune: treffliste_kommune()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  getByText("Trondheim");
  getByText("Kommune");
  getByText("5001");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render knr, gnr, bnr results on pop-up list", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr()
    }
  );
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR
  getByText("Stallmannsvingen 27");

  getByText("Stallmannsvingen 23");

  getByText("Stallmannsvingen 21");

  addresses = getAllByText("BNR 3716 SKIEN");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("3807-300-");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("5001");
  expect(addresses.length).toBe(9);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render knrgnrbnr results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_knrgnrbnr: treffliste_knrgnrbnr()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  // KNR
  getByText("Malvikvegen 2");
  getByText("KNR-GNR-BNR 7055 RANHEIM");
  getByText("5001-25-1");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

it("should render coordinates results on pop-up list", () => {
  const { container, getByText, getAllByRole } = renderTreffListe({
    treffliste_koord: treffliste_koord()
  });
  // Search results content
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(1);

  // KNR
  getByText("62.165° N / 11.950° Ø");
  getByText("Punktkoordinater");
  getByText("EPSG:4326");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste", { exact: true });
});

// -------------------------------------------------------------- //
// --------------------- SEARCH RESULTS PAGE -------------------- //
// -------------------------------------------------------------- //
it("should render empty page when there are no results", () => {
  const { container, getByText, getAllByText } = renderTreffListe({
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");

  let number = getAllByText("(0)");
  expect(number.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });
});

it("should render layer search results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_lag: treffliste_lag(),
    treffliste_underlag: treffliste_underlag(),
    number_layers: numbers.number_layers,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(9)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Search results content
  getByText("Arealressurs: AR5");
  getByText("Arealressurs: AR5 Arealtype");
  getByText("Treslag");
  getByText("Naturtyper - NiN Mdir");
  getByText("Arter - Rødlista");
  getByText("RE - Regionalt utdødd");
  getByText("CR - Kritisk truet");
  getByText("EN - Sterkt truet");
  getByText("VU - Sårbar");

  // Buttons: 9 layer results, 3 pagination, 6 tabs
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(18);

  // Layer results
  let layers = getAllByText("Kartlag");
  expect(layers.length).toBe(4);
  let sublayers = getAllByText("Underlag");
  expect(sublayers.length).toBe(6);
  let tema = getAllByText("Arealressurs");
  expect(tema.length).toBe(3);
  tema = getAllByText("Naturtyper");
  expect(tema.length).toBe(1);
  tema = getAllByText("Arter");
  expect(tema.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render place results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_sted: treffliste_sted(),
      number_places: numbers.number_places,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(16043)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on places tab
  fireEvent.click(getByText("Stedsnavn"));

  // Buttons: 5 place results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(18);

  // Layer results
  getByText("Sarpsborg");
  getByText("Stedsnavn, By i Sarpsborg");
  getByText("487975");

  getByText("Svelvik");
  getByText("Stedsnavn, By i Drammen");
  getByText("124591");

  getByText("Suortá");
  getByText("685163");

  let places = getAllByText("Stedsnavn, By i Sortland - Suortá");
  expect(places.length).toBe(1);

  getByText("Stokmarknes");
  getByText("Stedsnavn, By i Hadsel");
  getByText("260956");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("1146");
});

it("should render address results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_adresse: treffliste_adresse(),
      number_addresses: numbers.number_addresses,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(10000)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on address tab
  fireEvent.click(getByText("Adresse"));

  // Buttons: 5 address results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(19);

  getByText("Ospelia s. 44");
  getByText("4202-172-322");

  getByText("Ospelia s. 47");
  getByText("4202-172-313");

  getByText("Ospelia s. 42");
  getByText("4202-172-323");

  getByText("Ospelia s. 53");
  getByText("4202-172-316");

  getByText("Ospelia s. 55");
  getByText("4202-172-317");

  let addresses = getAllByText("Adresse 4888 HOMBORSUND");
  expect(addresses.length).toBe(5);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("714");
});

it("should render kommune results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_kommune: treffliste_kommune(),
    number_kommune: numbers.number_kommune,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on paces tab
  fireEvent.click(getByText("Stedsnavn"));

  // Buttons: 1 place results, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  getByText("Trondheim");
  getByText("Kommune");
  getByText("5001");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render knr, gnr, bnr results on search results page", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr(),
      number_knr: numbers.number_knr,
      number_gnr: numbers.number_gnr,
      number_bnr: numbers.number_bnr,
      searchResultPage: true
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(4239)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 9 results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(23);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR
  getByText("Stallmannsvingen 27");

  getByText("Stallmannsvingen 23");

  getByText("Stallmannsvingen 21");

  addresses = getAllByText("BNR 3716 SKIEN");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("3807-300-");
  expect(addresses.length).toBe(3);
  addresses = getAllByText("5001");
  expect(addresses.length).toBe(9);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  // Last page calculated separatedly for KNR, GNR, BNR and added
  // KNR = 215, GNR = 88, BNR = 2
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("305");
});

it("should render knrgnrbnr results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_knrgnrbnr: treffliste_knrgnrbnr(),
    number_knrgnrbnr: numbers.number_knrgnrbnr,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 1 result, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // KNR
  getByText("Malvikvegen 2");
  getByText("KNR-GNR-BNR 7055 RANHEIM");
  getByText("5001-25-1");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("should render coordinates results on search results page", () => {
  const {
    container,
    getByText,
    getAllByRole,
    getAllByText,
    queryByText
  } = renderTreffListe({
    treffliste_koord: treffliste_koord(),
    number_coord: numbers.number_coord,
    searchResultPage: true
  });
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(1)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on point tab
  fireEvent.click(getByText("Punkt"));

  // Buttons: 1 result, 3 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(10);

  // KNR
  getByText("62.165° N / 11.950° Ø");
  getByText("Punktkoordinater");
  getByText("EPSG:4326");

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  getByText("1");
  let page = queryByText("2");
  expect(page).toBeNull();
});

it("changing window height changes number of results per page and pagination", () => {
  const { container, getByText, getAllByRole, getAllByText } = renderTreffListe(
    {
      treffliste_knr: treffliste_knr(),
      treffliste_gnr: treffliste_gnr(),
      treffliste_bnr: treffliste_bnr(),
      number_knr: numbers.number_knr,
      number_gnr: numbers.number_gnr,
      number_bnr: numbers.number_bnr,
      searchResultPage: true,
      windowHeight: 580
    }
  );
  // Search results content
  getByText("Søkeresultater");
  getByText("Kartlag");
  getByText("Punkt");
  getByText("Stedsnavn");
  getByText("Adresse");
  getByText("Eiendom");
  let number = getAllByText("(4239)");
  expect(number.length).toBe(1);
  number = getAllByText("(0)");
  expect(number.length).toBe(4);

  // Buttons: 6 tabs, 3 pagination
  let buttons = getAllByRole("button");
  expect(buttons.length).toBe(9);

  // Click on property tab
  fireEvent.click(getByText("Eiendom"));

  // Buttons: 7 results, 8 pagination, 6 tabs
  buttons = getAllByRole("button");
  expect(buttons.length).toBe(21);

  // KNR
  getByText("Vinterlebakken 10");
  getByText("-520-9");

  getByText("Vinterlebakken 15");
  getByText("-520-15");

  getByText("Vinterlebakken 6");
  getByText("-520-7");

  let addresses = getAllByText("KNR 7540 KLÆBU");
  expect(addresses.length).toBe(3);

  // GNR
  getByText("Brunla allé 9");
  getByText("3805--358");

  getByText("Rådhusgaten 52");
  getByText("3805--127");

  getByText("Rådhusgaten 46");
  getByText("3805--125");

  addresses = getAllByText("GNR 3290 STAVERN");
  expect(addresses.length).toBe(3);

  // BNR (only one due to window height)
  getByText("Stallmannsvingen 27");
  getByText("BNR 3716 SKIEN");
  getByText("3807-300-");

  addresses = getAllByText("5001");
  expect(addresses.length).toBe(7);

  // Div class
  let div = container.querySelector("#treffliste");
  expect(div).toHaveClass("treffliste searchresultpage", { exact: true });

  // Pagination buttons
  // Last page calculated separatedly for KNR, GNR, BNR and added
  // KNR = 215, GNR = 88, BNR = 2
  getByText("1");
  getByText("2");
  getByText("3");
  getByText("4");
  getByText("5");
  getByText("607");
});
