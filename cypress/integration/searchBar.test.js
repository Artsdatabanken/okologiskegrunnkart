/// <reference types="cypress" />

// OBS!!! The slighlest change in search APIs can make this test fail
// (e.g. returning search results in different order).
// Furthermore, after one test fails, the rest will fail too because
// the search bar keeps the previous search term and zoom level may be wrong.

describe("Search Bar Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Search for layers and sublayers", () => {
    cy.wait(1000);
    cy.startDesktop();

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("art");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Arter - Rødlista");
    cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // Delete search
    cy.get(".searchbar .x").click();

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete%20arter*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete%20arter*&treffPerSide=19&side=0"
    ).as("getAddress2");

    // Write search
    cy.get(".searchbar input").type("fredete arter");
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 3);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Fredete arter - områder");
    cy.get(".treffliste").contains("Fredete arter - punkt");
    cy.get(".treffliste .searchbar_item:last").contains("Underlag");
    cy.get(".treffliste .searchbar_item:last").contains("Arter");

    // Delete search
    cy.get(".searchbar .x").click();
  });

  it("Deleting search term removes results", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("art");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Arter - Rødlista");
    cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // Delete search
    cy.get(".searchbar input").clear();

    // No results should be shown
    cy.get(".treffliste").should("not.exist");
  });

  it("Search for layers and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("fredete");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results and select first
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 3);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Fredete arter - områder");
    cy.get(".treffliste").contains("Fredete arter - punkt");
    cy.get(".searchbar input").should("have.attr", "value", "fredete");
    cy.get(".treffliste .searchbar_item:first").click();

    // Should go to layer details
    cy.get(".searchbar input").should("not.have.attr", "value", "fredete");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Valgt lag");
    cy.get(".valgtLag").contains("Arter - fredete");
    cy.get(".valgtLag").contains("Fredete arter - områder");
    cy.get(".valgtLag").contains("Fredete arter - punkt");
    cy.get(".valgtLag")
      .find("#layer-list-item")
      .should("have.length", 1);
    cy.get(".valgtLag")
      .find(".underlag-all")
      .should("have.length", 1);
    cy.get(".valgtLag")
      .find(".underlag")
      .should("have.length", 2);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
    cy.get("#layers-list-wrapper").should("be.visible");
    cy.get("#layers-list-wrapper").contains("Arealressurs: AR5");
    cy.wait(500);

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=19&side=0"
    ).as("getAddress2");

    // Write search
    cy.get(".searchbar input").type("fredete");
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Check search results and select last
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 3);
    cy.get(".treffliste").contains("Fredete arter - områder");
    cy.get(".treffliste").contains("Fredete arter - punkt");
    cy.get(".searchbar input").should("have.attr", "value", "fredete");
    cy.get(".treffliste .searchbar_item:last").click();

    // Should go to layer details
    cy.get(".searchbar input").should("not.have.attr", "value", "fredete");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Valgt lag");
    cy.get(".valgtLag").contains("Arter - fredete");
    cy.get(".valgtLag").should("not.contain", "Fredete arter - områder");
    cy.get(".valgtLag").contains("Fredete arter - punkt");
    cy.get(".valgtLag")
      .find("#layer-list-item")
      .should("have.length", 1);
    cy.get(".valgtLag")
      .find(".underlag-all")
      .should("have.length", 0);
    cy.get(".valgtLag")
      .find(".underlag")
      .should("have.length", 1);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Search for place and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=tautra*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=tautra*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("tautra");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results and select first
    cy.get(".treffliste")
      .find(".searchbar_item")
      .its("length")
      .should("be.gt", 2);
    cy.get(".treffliste").contains("Tautra");

    // Infobox and marker should not be visible, and URL not have correct coordinates
    cy.get(".infobox-container-side.infobox-open").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("not.exist");
    cy.url().should("not.include", "lng=10.62210");
    cy.url().should("not.include", "lat=63.58419");

    // Intercept requests
    cy.intercept(
      "ttps://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=tautra%20kloster*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=tautra%20kloster*&treffPerSide=19&side=0"
    ).as("getAddress2");

    // Refine search and select only result
    cy.get(".searchbar input").type(" kloster");
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Check results and select
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 1);
    cy.wait(500);
    cy.get(".searchbar input").should("have.attr", "value", "tautra kloster");
    cy.get(".treffliste .searchbar_item:first").click();
    cy.wait(1500);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "tautra kloster"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=10.62210");
    cy.url().should("include", "lat=63.58419");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains("Tautra");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Frosta");
    cy.get(".infobox-container-side.infobox-open").contains("5036");
    cy.get(".infobox-container-side").contains("63.5842° N 10.6221° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("17 moh");

    // Wait for map zoom
    cy.wait(4000);
  });

  it("Search for address and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg%20gate%207*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg%20gate%207&treffPerSide=19&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("øvre møllenberg gate 7");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // URL should not have correct coordinates
    cy.url().should("not.include", "lng=10.40908");
    cy.url().should("not.include", "lat=63.42941");

    // Check search results and select first
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 1);
    cy.get(".treffliste .searchbar_item:first").contains(
      "Øvre Møllenberg gate 7"
    );
    cy.get(".treffliste .searchbar_item:first").contains(
      "Adresse 7014 TRONDHEIM"
    );
    cy.wait(500);
    cy.get(".searchbar input").should(
      "have.attr",
      "value",
      "øvre møllenberg gate 7"
    );
    cy.get(".treffliste .searchbar_item:first").click();
    cy.wait(1500);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "øvre møllenberg gate 7"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=10.40908");
    cy.url().should("include", "lat=63.42941");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Øvre Møllenberg gate"
    );
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Trondheim");
    cy.get(".infobox-container-side.infobox-open").contains("5001");
    cy.get(".infobox-container-side").contains("63.4294° N 10.4091° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("32 moh");

    // Wait for map zoom
    cy.wait(4000);
  });

  it("Search for property and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=19&side=0"
    ).as("getProperty");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=19&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("5025-33-25");
    cy.wait("@getProperty");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // URL should not have correct coordinates
    cy.url().should("not.include", "lng=11.33768");
    cy.url().should("not.include", "lat=62.60752");

    // Check search results and select first
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 2);
    cy.get(".treffliste .searchbar_item:last").contains("Rørosgårdveien 280");
    cy.get(".treffliste").contains("KNR-GNR-BNR 7375 RØROS");
    cy.wait(500);
    cy.get(".searchbar input").should("have.attr", "value", "5025-33-25");
    cy.get(".treffliste .searchbar_item:last").click();
    cy.wait(1500);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33-25");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=11.33768");
    cy.url().should("include", "lat=62.60752");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Rørosgårdveien 280"
    );
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Røros");
    cy.get(".infobox-container-side.infobox-open").contains("5025");
    cy.get(".infobox-container-side").contains("62.6075° N 11.3377° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("633 moh");

    // Wait for map zoom
    cy.wait(4000);
  });

  it("Search for coordinates and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=60.258%2012.2561*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=60.258%2012.2561*&treffPerSide=19&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("60.258-12.2561");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // URL should not have correct coordinates
    cy.url().should("not.include", "lng=12.2561");
    cy.url().should("not.include", "lat=60.258");

    // Check search results and select first
    cy.get(".treffliste")
      .find(".searchbar_item")
      .its("length")
      .should("be.gt", 0);
    cy.get(".treffliste .searchbar_item:first").contains(
      "60.2580° N / 12.2561° Ø"
    );
    cy.get(".treffliste .searchbar_item:first").contains("Punktkoordinater");
    cy.wait(500);
    cy.get(".searchbar input").should("have.attr", "value", "60.258-12.2561");
    cy.get(".treffliste .searchbar_item:first").click();
    cy.wait(1500);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "60.258-12.2561"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=12.2561");
    cy.url().should("include", "lat=60.258");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains("Tussberget");
    cy.get(".infobox-container-side").contains("Innlandet");
    cy.get(".infobox-container-side.infobox-open").contains("34");
    cy.get(".infobox-container-side.infobox-open").contains("Kongsvinger");
    cy.get(".infobox-container-side.infobox-open").contains("3401");
    cy.get(".infobox-container-side").contains("60.258° N 12.2561° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("381 moh");

    // Wait for map zoom
    cy.wait(1000);
  });

  it("Search for layers in detailed search and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=19&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("fredete");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 3);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Fredete arter - områder");
    cy.get(".treffliste").contains("Fredete arter - punkt");
    cy.get("#search-button").click();

    // Should go to layer search details
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Kartlag");
    cy.get(".valgtLag").contains("(3)");
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 3);

    // Select first result
    cy.get(".searchbar input").should("have.attr", "value", "fredete");
    cy.get(".treffliste.searchresultpage .searchbar_item:first").click();
    cy.get(".searchbar input").should("not.have.attr", "value", "fredete");
    cy.get(".valgtLag").contains("Arter - fredete");
    cy.get(".valgtLag").contains("Fredete arter - områder");
    cy.get(".valgtLag").contains("Fredete arter - punkt");
    cy.get(".valgtLag")
      .find("#layer-list-item")
      .should("have.length", 1);
    cy.get(".valgtLag")
      .find(".underlag-all")
      .should("have.length", 1);
    cy.get(".valgtLag")
      .find(".underlag")
      .should("have.length", 2);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Search for property in detailed search. Slow search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=19&side=0"
    ).as("getProperty1");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("5025-33-25");
    cy.wait("@getProperty1");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=14&side=0"
    ).as("getProperty2");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Should go to layer details
    cy.get("#search-button").click();
    cy.wait("@getProperty2");
    cy.wait("@getName2");
    cy.wait("@getAddress2");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Adresse");
    cy.get(".valgtLag").contains("Eiendom");
    cy.get(".valgtLag").contains("(1)");

    // Select eiendom
    cy.get(".search-page-options-content button:last").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:last").click();
    cy.get(".search-page-options-content button:last").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 1);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33-25");
  });

  it("Search for property in detailed search and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=14&side=0"
    ).as("getProperty");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=14&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("5025-33-25");
    cy.get("#search-button").click();
    cy.wait("@getProperty");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Should go to layer details
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Adresse");
    cy.get(".valgtLag").contains("Eiendom");
    cy.get(".valgtLag").contains("(1)");

    // Select eiendom
    cy.get(".search-page-options-content button:last").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:last").click();
    cy.get(".search-page-options-content button:last").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 1);

    // URL should not have correct coordinates
    cy.url().should("not.include", "lng=11.33768");
    cy.url().should("not.include", "lat=62.60752");

    // Check search results and select first
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 1);
    cy.get(".treffliste.searchresultpage .searchbar_item:first").contains(
      "Rørosgårdveien 280"
    );
    cy.get(".treffliste.searchresultpage").contains("KNR-GNR-BNR 7375 RØROS");
    cy.wait(500);
    cy.get(".searchbar input").should("have.attr", "value", "5025-33-25");
    cy.get(".treffliste.searchresultpage .searchbar_item:first").click();
    cy.wait(1500);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33-25");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=11.33768");
    cy.url().should("include", "lat=62.60752");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Rørosgårdveien 280"
    );
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Røros");
    cy.get(".infobox-container-side.infobox-open").contains("5025");
    cy.get(".infobox-container-side").contains("62.6075° N 11.3377° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("633 moh");

    // Wait for map zoom
    cy.wait(2500);
  });

  it("Layers pagination in detailed search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("art");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Arter - Rødlista");
    cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to details
    cy.get("#search-button").click();
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Should go to layer search details
    cy.get(".searchbar input").should("have.attr", "value", "art");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Stedsnavn");
    cy.get(".valgtLag").contains("(93)");
    cy.get(".treffliste.searchresultpage").should("be.visible");

    // Check results
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);
    cy.get(".treffliste.searchresultpage").contains("Arter - fredete");
    cy.get(".treffliste.searchresultpage").contains("Arter - Rødlista");
    cy.get(".treffliste.searchresultpage").contains("Ultramafiske bergarter");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "9");

    // Click on page 2
    cy.wait(500);
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.get(".treffliste.searchresultpage").contains("Naturvernområder");
    cy.get(".treffliste.searchresultpage").contains("Ramsarområder");
    cy.get(".treffliste.searchresultpage").contains("Villreinområder");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);

    // Click on last page (page 7)
    cy.get(".MuiPagination-ul li:nth-child(8)").click();
    cy.get(".treffliste.searchresultpage").contains("Dekningskart");
    cy.get(".treffliste.searchresultpage").contains(
      "Marin grense - alle kartlag"
    );
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 0);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Places pagination in detailed search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=trondheim*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=trondheim&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("trondheim");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Trondheim");
    cy.get(".treffliste").contains("Trondheim kommune");
    cy.get(".treffliste .searchbar_item:first").contains("Trondheim");
    cy.get(".treffliste .searchbar_item:first").contains(
      "Stedsnavn, By i Trondheim"
    );

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=trondheim*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=trondheim&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to details
    cy.get("#search-button").click();
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Should go to search details
    cy.get(".searchbar input").should("have.attr", "value", "trondheim");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Kartlag");
    cy.get(".valgtLag").contains("(84)");

    // Select places
    cy.get(".search-page-options-content button:nth-child(3)").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:nth-child(3)").click();
    cy.get(".search-page-options-content button:nth-child(3)").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );

    // Check results
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 5);
    cy.get(".treffliste.searchresultpage").contains("Trondheim");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "8");

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=trondheim*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=1"
    ).as("getPlacePage1");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.wait("@getPlacePage1");
    cy.get(".treffliste.searchresultpage").contains("Trondheim");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 5);

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=trondheim*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=5"
    ).as("getPlacePage1");

    // Click on last page (page 6)
    cy.get(".MuiPagination-ul li:nth-child(7)").click();
    cy.get(".treffliste.searchresultpage").contains("Trondheim");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 0);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Addresses pagination in detailed search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("øvre møllenberg");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Øvre Møllenberg gate");
    cy.get(".treffliste").contains("Adresse 7043 TRONDHEIM");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to details
    cy.get("#search-button").click();
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Should go to search details
    cy.get(".searchbar input").should("have.attr", "value", "øvre møllenberg");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Adresse");
    cy.get(".valgtLag").contains("(97)");

    // Select addresses
    cy.get(".search-page-options-content button:nth-child(4)").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:nth-child(4)").click();
    cy.get(".search-page-options-content button:nth-child(4)").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );

    // Check results
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "8");

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg&treffPerSide=14&side=1"
    ).as("getAddressPage1");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.wait("@getAddressPage1");
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg&treffPerSide=14&side=5"
    ).as("getAddressPage5");

    // Click on last page (page 6)
    cy.get(".MuiPagination-ul li:nth-child(7)").click();
    cy.wait("@getAddressPage5");
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 0);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Properties pagination in detailed search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=19&side=0"
    ).as("getProperty1");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("5025-33");
    cy.wait("@getProperty1");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Mælan 33");
    cy.get(".treffliste").contains("Stormoveien 33");
    cy.get(".treffliste").contains("Adresse 7374 RØROS");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=14&side=0"
    ).as("getProperty2");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to details
    cy.get("#search-button").click();
    cy.wait("@getProperty2");
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Should go to search details
    cy.get(".searchbar input").should("have.attr", "value", "5025-33");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Eiendom");
    cy.get(".valgtLag").contains("(29)");

    // Select properties
    cy.get(".search-page-options-content button:last").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:last").click();
    cy.get(".search-page-options-content button:last").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );

    // Check results
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien");
    cy.get(".treffliste.searchresultpage").contains("KNR-GNR-BNR 7375 RØROS");
    cy.get(".treffliste.searchresultpage").contains("5025-33");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "5");

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=14&side=1"
    ).as("getPropertyPage1");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.wait("@getPropertyPage1");
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien");
    cy.get(".treffliste.searchresultpage").contains("5025-33");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);

    // Intercept request
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=14&side=2"
    ).as("getPropertyPage2");

    // Click on last page (page 3)
    cy.get(".MuiPagination-ul li:nth-child(4)").click();
    cy.wait("@getPropertyPage2");
    cy.get(".treffliste.searchresultpage").contains("5025-33");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 0);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Click outside closes popup window and deletes search term", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=19&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("art");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Arter - Rødlista");
    cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=62.60727528514941&lng=11.336903572082521"
    ).as("getAddressData");

    // Delete search
    cy.get(".searchbar input").should("have.attr", "value", "art");
    cy.get(".leaflet-container").click(650, 650);
    cy.wait("@getAddressData");

    // No search results should be shown
    cy.get(".treffliste").should("not.exist");
    cy.get(".searchbar input").should("have.attr", "value", "");
  });

  it("Click outside has no effect when in detailed search", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("art");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Arter - fredete");
    cy.get(".treffliste").contains("Arter - Rødlista");
    cy.get(".treffliste .searchbar_item:first").contains("Kartlag");
    cy.get(".treffliste .searchbar_item:first").contains("Arter");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to search details
    cy.get("#search-button").click();
    cy.wait("@getName2");
    cy.wait("@getAddress2");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Kartlag");
    cy.get(".valgtLag").contains("(93)");

    // Delete search
    cy.get(".searchbar input").should("have.attr", "value", "art");
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".infobox-container-side.infobox-open").should("not.exist");

    // No changes in search results
    cy.get(".treffliste.searchresultpage").should("be.visible");
    cy.get(".searchbar input").should("have.attr", "value", "art");

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Should navigate in popup window with arrows and select with enter", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg%20gate*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg%20gate&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("øvre møllenberg gate");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Øvre Møllenberg gate");
    cy.get(".treffliste").contains("Adresse 7043 TRONDHEIM");
    cy.get(".searchbar input").should(
      "have.attr",
      "value",
      "øvre møllenberg gate"
    );

    // Navigate down with arrows
    cy.get(".searchbar input").type("{downarrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(4) .searchlist-item-wrapper"
    ).should("have.focus");

    // Navigate up with arrows
    cy.get(
      ".treffliste .searchbar_item:nth-child(4) .searchlist-item-wrapper"
    ).type("{uparrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).type("{uparrow}", { force: true });
    cy.get(
      ".treffliste .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).should("have.focus");

    // Make sure Øvre Møllenberg gate 74 is the first search result
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg%20gate%2074*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg%20gate%2074&treffPerSide=19&side=0"
    ).as("getAddress2");
    cy.get(".searchbar input").type(" 74");
    cy.wait("@getName2");
    cy.wait("@getAddress2");

    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=63.43465904942166&lng=10.42046562146669"
    ).as("getAddressData");

    // Select first result with Enter
    cy.get(
      ".treffliste .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).type("{enter}", { force: true });
    cy.wait("@getAddressData");

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "øvre møllenberg gate"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=10.42046");
    cy.url().should("include", "lat=63.43465");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains("Trondheim");
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Trondheim");
    cy.get(".infobox-container-side.infobox-open").contains("5001");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Øvre Møllenberg gate 74"
    );
    cy.get(".infobox-container-side.infobox-open").contains("410 / 340");
    cy.get(".infobox-container-side").contains("63.4347° N 10.4205° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("15 moh");

    // Wait for map zoom
    cy.wait(4000);
  });

  it("Should navigate in search details with arrows and select with enter", () => {
    let count = 0;

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=19&side=0"
    ).as("getProperty1");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033*&eksakteForst=true&antPerSide=19&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033&treffPerSide=19&side=0"
    ).as("getAddress1");

    // Write search
    cy.get(".searchbar input").type("5025-33");
    cy.wait("@getProperty1");
    cy.wait("@getName1");
    cy.wait("@getAddress1");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Mælan 33");
    cy.get(".treffliste").contains("Stormoveien 33");
    cy.get(".treffliste").contains("Adresse 7374 RØROS");

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=14&side=0"
    ).as("getProperty2");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033*&eksakteForst=true&antPerSide=14&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033&treffPerSide=14&side=0"
    ).as("getAddress2");

    // Go to search details with Enter
    cy.get(".searchbar input").type("{enter}");
    cy.wait("@getProperty2");
    cy.wait("@getName2");
    cy.wait("@getAddress2");
    cy.get(".searchbar input").should("have.attr", "value", "5025-33");
    cy.get(".valgtLag").should("be.visible");
    cy.get(".valgtLag").contains("Søkeresultater");
    cy.get(".valgtLag").contains("Eiendom");
    cy.get(".valgtLag").contains("(29)");

    // Select eiendom
    cy.get(".search-page-options-content button:last").should(
      "not.have.attr",
      "id",
      "filter-search-button-selected"
    );
    cy.get(".search-page-options-content button:last").click();
    cy.get(".search-page-options-content button:last").should(
      "have.attr",
      "id",
      "filter-search-button-selected"
    );

    // Navigate down with arrows
    cy.get(".searchbar input").type("{downarrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).type("{downarrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(4) .searchlist-item-wrapper"
    ).should("have.focus");

    // Navigate up with arrows
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(4) .searchlist-item-wrapper"
    ).type("{uparrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(3) .searchlist-item-wrapper"
    ).type("{uparrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).should("have.focus");
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(2) .searchlist-item-wrapper"
    ).type("{uparrow}", { force: true });
    cy.get(
      ".treffliste.searchresultpage .searchbar_item:nth-child(1) .searchlist-item-wrapper"
    ).should("have.focus");

    // In case Rørosgårdveien 280 is not in forst page, go to page 2 and 3
    // until it is found
    let checkCount1 = 0;
    cy.get(".treffliste")
      .find(".searchbar_item")
      .each($el => {
        checkCount1 += 1;
        if ($el.text().includes("Rørosgårdveien 280")) {
          return false;
        }
        if (checkCount1 === 14) {
          checkCount1 = 0;
          cy.get(".MuiPagination-ul li:nth-child(3)").click();
        }
      });

    let checkCount2 = 0;
    cy.get(".treffliste")
      .find(".searchbar_item")
      .each($el => {
        if (checkCount1 !== 0) return false;
        checkCount2 += 1;
        if ($el.text().includes("Rørosgårdveien 280")) {
          return false;
        }
        if (checkCount2 === 14) {
          cy.get(".MuiPagination-ul li:nth-child(4)").click();
        }
      });

    // Intercept requests
    cy.intercept(
      Cypress.env("baseapi") +
        "/rpc/punkt?lat=62.6075215964786&lng=11.337683436497148"
    ).as("getAddressData");

    // Loop through results and find Rørosgårdveien 280
    cy.get(".treffliste")
      .find(".searchbar_item")
      .each($el => {
        count += 1;
        if ($el.text().includes("Rørosgårdveien 280")) {
          cy.get(
            `.treffliste.searchresultpage .searchbar_item:nth-child(${count}) .searchlist-item-wrapper`
          ).type("{enter}", { force: true });
          cy.wait("@getAddressData");
          return false;
        }
      });

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon", { timeout: 6000 }).should("be.visible");
    cy.url().should("include", "lng=11.33768");
    cy.url().should("include", "lat=62.60752");

    // Should open infobox with selected place
    cy.get(".infobox-container-side.infobox-open").should("be.visible");
    cy.get(".infobox-container-side.infobox-open").contains(
      "Rørosgårdveien 280"
    );
    cy.get(".infobox-container-side").contains("Trøndelag - Trööndelage");
    cy.get(".infobox-container-side.infobox-open").contains("50");
    cy.get(".infobox-container-side.infobox-open").contains("Røros");
    cy.get(".infobox-container-side.infobox-open").contains("5025");
    cy.get(".infobox-container-side").contains("62.6075° N 11.3377° Ø");
    cy.get(".infobox-container-side.infobox-open").contains("633 moh");
  });
});
