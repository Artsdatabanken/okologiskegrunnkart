/// <reference types="cypress" />

// NOTE: due to the search APIs not being very stable, this test may fails randomly.
// It may require running it again without changes to double check.

describe("Search Bar Tests", () => {
  before(() => {
    // Delete indexed DB
    indexedDB.deleteDatabase("GrunnkartDB");
  });

  it("Search for layers and sublayers", () => {
    cy.startDesktop();

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=20&side=0"
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete%20arter*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete%20arter*&treffPerSide=20&side=0"
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=20&side=0"
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=20&side=0"
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

    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=20&side=0"
    ).as("getAddress2");

    // Write search
    cy.get(".searchbar input").click();
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=tautra*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=tautra*&treffPerSide=20&side=0"
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
    cy.get("img.leaflet-marker-icon").should("not.exist");
    cy.url().should("not.include", "lng=10.62210");
    cy.url().should("not.include", "lat=63.58419");

    // Intercept requests
    cy.intercept(
      "ttps://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=tautra%20kloster*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName2");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=tautra%20kloster*&treffPerSide=20&side=0"
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
    cy.wait(1000);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "tautra kloster"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("be.visible");
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg%20gate%207*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg%20gate%207&treffPerSide=20&side=0"
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
    cy.wait(1000);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "øvre møllenberg gate 7"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("be.visible");
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
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=20&side=0"
    ).as("getProperty");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=20&side=0"
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
    cy.wait(1000);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33-25");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("be.visible");
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=60.258%2012.2561*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=60.258%2012.2561*&treffPerSide=20&side=0"
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
    cy.wait(1000);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should(
      "not.have.attr",
      "value",
      "60.258-12.2561"
    );
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("be.visible");
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=fredete*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=fredete*&treffPerSide=20&side=0"
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

  it("Search for property in detailed search and select", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&bruksnummer=25&treffPerSide=20&side=0"
    ).as("getProperty");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033%2025*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033%2025&treffPerSide=20&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("5025-33-25");
    cy.get("#search-button").click();
    cy.wait("@getProperty");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Should go to layer details
    cy.get(".searchbar input").should("not.contain", "5025-33-25");
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
    cy.wait(1000);

    // Should close search results, show marker and update URL
    cy.get(".searchbar input").should("not.have.attr", "value", "5025-33-25");
    cy.get(".treffliste").should("not.exist");
    cy.get(".valgtLag").should("not.exist");
    cy.get("img.leaflet-marker-icon").should("be.visible");
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=20&side=0"
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
    cy.get("#search-button").click();

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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=trondheim*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=trondheim&treffPerSide=20&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("trondheim");
    cy.wait("@getName");
    cy.wait("@getAddress");

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
    cy.get("#search-button").click();

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
      .should("have.length", 14);
    cy.get(".treffliste.searchresultpage").contains("Trondheim");
    cy.get(".treffliste.searchresultpage").contains("Trondheim kommune");
    cy.get(".treffliste.searchresultpage").contains(
      "Trondheim lufthavn, Værnes"
    );

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "8");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.get(".treffliste.searchresultpage").contains("Trondheim tinghus");
    cy.get(".treffliste.searchresultpage").contains("Trondheim sentralstasjon");
    cy.get(".treffliste.searchresultpage").contains("Trondheimsfjorden");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 12);

    // Click on last page (page 7)
    cy.get(".MuiPagination-ul li:nth-child(7)").click();
    cy.get(".treffliste.searchresultpage").contains("Trondheimsvegen");
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
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=%C3%B8vre%20m%C3%B8llenberg*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=%C3%B8vre%20m%C3%B8llenberg&treffPerSide=20&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("øvre møllenberg");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Øvre Møllenberg gate 74");
    cy.get(".treffliste").contains("Øvre Møllenberg gate 78D");
    cy.get(".treffliste").contains("Adresse 7043 TRONDHEIM");
    cy.get("#search-button").click();

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
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate 74");
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate 78D");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "8");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate 41B");
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate 28");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);

    // Click on last page (page 7)
    cy.get(".MuiPagination-ul li:nth-child(7)").click();
    cy.get(".treffliste.searchresultpage").contains("Øvre Møllenberg gate 65A");
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
      "https://ws.geonorge.no/adresser/v1/sok?kommunenummer=5025&gardsnummer=33&treffPerSide=20&side=0"
    ).as("getProperty");
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=5025%2033*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=5025%2033&treffPerSide=20&side=0"
    ).as("getAddress");

    // Write search
    cy.get(".searchbar input").type("5025-33");
    cy.wait("@getProperty");
    cy.wait("@getName");
    cy.wait("@getAddress");

    // Check search results
    cy.get(".treffliste")
      .find(".searchbar_item")
      .should("have.length", 18);
    cy.get(".treffliste").contains("Mælan 33");
    cy.get(".treffliste").contains("Stormoveien 33");
    cy.get(".treffliste").contains("Adresse 7374 RØROS");
    cy.get("#search-button").click();

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
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien 280");
    cy.get(".treffliste.searchresultpage").contains("KNR-GNR-BNR 7375 RØROS");
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien 282");

    // Check pagination
    cy.get(".MuiPagination-ul")
      .find("li")
      .should("have.length", "5");

    // Click on page 2
    cy.get(".MuiPagination-ul li:nth-child(3)").click();
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien 308");
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien 354");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("have.length", 14);

    // Click on last page (page 7)
    cy.get(".MuiPagination-ul li:nth-child(4)").click();
    cy.get(".treffliste.searchresultpage").contains("Rørosgårdveien 288");
    cy.get(".treffliste.searchresultpage")
      .find(".searchbar_item")
      .should("length.gt", 0);

    // Go back to main menu
    cy.get(".valgtLag .listheadingbutton").click();
    cy.get(".valgtLag").should("not.exist");
  });

  it("Click outside closes search results", () => {
    // Intercept requests
    cy.intercept(
      "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?navn=art*&eksakteForst=true&antPerSide=20&epsgKode=4326&side=0"
    ).as("getName1");
    cy.intercept(
      "https://ws.geonorge.no/adresser/v1/sok?sok=art*&treffPerSide=20&side=0"
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
    cy.get(".leaflet-container").click(650, 650);

    // No results should be shown
    cy.get(".treffliste").should("not.exist");
  });
});
