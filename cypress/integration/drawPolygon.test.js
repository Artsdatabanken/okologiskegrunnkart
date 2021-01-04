/// <reference types="cypress" />

describe("Draw Polygon Tests", () => {
  it("Draw Polygon Manually", () => {
    cy.startDesktop();

    // Open polygon tool and verify self-drawn polygon is selected
    cy.get('button[title="Polygon tool"]').click();
    cy.contains("Mitt Polygon");
    cy.contains("Definer polygon fra grenser");
    cy.get("#infobox-radio-label-none >>> input").should("be.checked");
    cy.get("#polygon-options-listitem").click();

    // Zoom in map
    cy.get('a[title="Zoom in"]').click();
    cy.wait(150);

    // Polygon should not be visible
    cy.get("path.leaflet-interactive").should("not.exist");
    cy.contains("Arealrapport (polygon ikke definert)");

    // Draw polygon manually
    cy.get(".leaflet-container").click(650, 650);
    cy.get(".leaflet-marker-icon.inactive_point").should("be.visible");
    cy.get(".leaflet-container").click(670, 655);
    cy.contains("10.83 km");
    cy.get(".leaflet-container").click(665, 670);
    cy.contains("19.15 km");
    cy.get(".leaflet-container").click(640, 675);
    cy.contains("32.59 km");
    cy.get(".leaflet-container").click(630, 655);
    cy.contains("44.35 km");
    cy.get('span[title="Ferdig"] > button').click();

    // Check polygon and its size are shown
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Omkrets / perimeter");
    cy.contains("55.19 km");
    cy.contains("Areal");
    cy.contains("186.74 km²");
  });

  it("Run Area Report", () => {
    // Select all area reports, run and intercept request
    cy.contains("Arealrapport");
    cy.get("#polygon-layer-expander").click();
    cy.contains("Verneplan for Vassdrag");
    cy.get(".polygon-layers-item >>> input").click({ multiple: true });
    cy.wait(100);
    cy.intercept(
      "https://okologiskegrunnkartapi.test.artsdatabanken.no/rpc/arealstatistikk"
    ).as("getAreaReport");
    cy.get("#polygon-run-button").click();
    cy.contains("Valgte arealrapporter");

    // Check progress bar is visible and wait until request has finished
    cy.get("#polygon-area-report-progress").should("be.visible");
    cy.get("#polygon-layer-expander").click();
    cy.wait("@getAreaReport");
    cy.get("#polygon-area-report-progress").should("not.exist");
  });

  it("Check list with area report results. If it fails, area report layers may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("Fylker");
    cy.get(".generic_element:nth-child(1)").contains("Kartverket");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("Kommuner");
    cy.get(".generic_element:nth-child(2)").contains("Kartverket");
    // Eiendommer
    cy.get(".generic_element:nth-child(3)").contains("Eiendommer");
    cy.get(".generic_element:nth-child(3)").contains("Kartverket");
    // Arter nasjonal forvaltningsinteresse
    cy.get(".generic_element:nth-child(4)").contains(
      "Arter nasjonal forvaltningsinteresse"
    );
    cy.get(".generic_element:nth-child(4)").contains("Miljødirektoratet");
    // Breer
    cy.get(".generic_element:nth-child(5)").contains("Breer i Norge");
    cy.get(".generic_element:nth-child(5)").contains(
      "Norges vassdrags- og energidirektorat"
    );
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(6)").contains(
      "Naturtyper - DN Håndbook 13"
    );
    cy.get(".generic_element:nth-child(6)").contains("Miljødirektoratet");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(7)").contains(
      "Naturtyper - DN Håndbook 19"
    );
    cy.get(".generic_element:nth-child(7)").contains("Miljødirektoratet");
    // Naturtyper - NiN Mdir
    cy.get(".generic_element:nth-child(8)").contains("Naturtyper - NiN Mdir");
    cy.get(".generic_element:nth-child(8)").contains("Miljødirektoratet");
    // Naturvernområder
    cy.get(".generic_element:nth-child(9)").contains("Naturvernområder");
    cy.get(".generic_element:nth-child(9)").contains("Miljødirektoratet");
    // Innsjødatabase
    cy.get(".generic_element:nth-child(10)").contains("Innsjødatabase");
    cy.get(".generic_element:nth-child(10)").contains(
      "Norges vassdrags- og energidirektorat"
    );
    // Vannkraft - Magasin
    cy.get(".generic_element:nth-child(11)").contains("Vannkraft - Magasin");
    cy.get(".generic_element:nth-child(11)").contains("Miljødirektoratet");
    // Verneplan for Vassdrag
    cy.get(".generic_element:nth-child(12)").contains("Verneplan for Vassdrag");
    cy.get(".generic_element:nth-child(12)").contains(
      "Norges vassdrags- og energidirektorat"
    );
  });

  it("Check area report results and details. If it fails, API response may have changed", () => {
    // Fylker
    cy.get(".generic_element:nth-child(1)").contains("1");
    // Kommuner
    cy.get(".generic_element:nth-child(2)").contains("2");
    // Eiendommer
    cy.get(".generic_element:nth-child(3)").contains("99+");
    // Arter nasjonal forvaltningsinteresse
    cy.get(".generic_element:nth-child(4)").contains("1");
    // Breer
    cy.get(".generic_element:nth-child(5) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturtyper - DN Håndbook 13
    cy.get(".generic_element:nth-child(6)").contains("19");
    // Naturtyper - DN Håndbook 19
    cy.get(".generic_element:nth-child(7) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Naturtyper - NiN Mdir
    cy.get(".generic_element:nth-child(8)").contains("7");
    // Naturvernområder
    cy.get(".generic_element:nth-child(9)").contains("5");
    // Innsjødatabase
    cy.get(".generic_element:nth-child(10)").contains("74");
    // Vannkraft - Magasin
    cy.get(".generic_element:nth-child(11) >>>>> .MuiBadge-badge").should(
      "not.exist"
    );
    // Verneplan for Vassdrag
    cy.get(".generic_element:nth-child(12)").contains("2");

    // See kommune details
    cy.get(".generic_element:nth-child(2)").click();
    cy.contains("Detaljerte resultater");
    cy.contains("Grong");
    cy.contains("5045");
    cy.contains("111.5 km²");
    cy.contains("(59.7%)");
    cy.contains("Høylandet");
    cy.contains("5046");
    cy.contains("75.3 km²");
    cy.contains("(40.3%)");

    // Go back
    cy.get("#infobox-details-title-wrapper").click();
    cy.get("#infobox-details-title-wrapper").should("not.exist");

    // See Naturtyper - DN Håndbook 13 details
    cy.get(".generic_element:nth-child(6)").click();
    cy.contains("Detaljerte resultater");
    cy.get(".polygon-details-content-wrapper").contains("Regnskog");
    cy.get(".polygon-details-content-wrapper").contains("F20");
    cy.get(".polygon-details-content-wrapper").contains("2.85 km²");
    cy.get(".polygon-details-content-wrapper").contains("(1.5%)");

    cy.get(".polygon-details-content-wrapper-description").contains(
      "Slåttemyr"
    );
    cy.get(".polygon-details-content-wrapper-description").contains("D02");
    cy.get(".polygon-details-content-wrapper-description").contains("0.30 km²");
    cy.get(".polygon-details-content-wrapper-description").contains("(0.16%)");
    cy.get(".polygon-details-content-wrapper-description").contains(
      "Myrer med slåttebetinget eller beitepåvirket"
    );
    cy.get(".polygon-details-content-wrapper-description").contains("Les mer");
    cy.get(".polygon-details-description-link").click({ multiple: true });
    cy.get(".polygon-details-content-wrapper-description").contains(
      "Myrer med slåttebetinget eller beitepåvirket vegetasjon­ og preg."
    );
    cy.get(".polygon-details-content-wrapper-description").contains(
      "Les mindre"
    );
    cy.get(".polygon-details-description-link-open").click({ multiple: true });
    cy.get(".polygon-details-content-wrapper-description").contains(
      "Myrer med slåttebetinget eller beitepåvirket"
    );
    cy.get(".polygon-details-content-wrapper-description").contains("Les mer");

    // Go back
    cy.get("#infobox-details-title-wrapper").click();
    cy.get("#infobox-details-title-wrapper").should("not.exist");
  });

  it("Edit polygon. Area report results should disappear", () => {
    // No area report results visible
    cy.get("#layers-results-list")
      .find(".generic_element")
      .should("have.length", 12);

    // Edit polygon
    cy.get('span[title="Rediger"] > button').click();

    // Check polyline size is correct
    cy.contains("Omkrets / perimeter");
    cy.contains("44.35 km");
    cy.contains("Areal");
    cy.contains("---");

    // Polygon should not be visible, but polyline yes
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Arealrapport (polygon ikke definert)");

    // No area report results visible
    cy.get("#layers-results-list").should("not.exist");
  });

  it("Undo last point of the polyline", () => {
    // Undo last point
    cy.get('span[title="Angre sist"] > button').click();

    // Check polyline size is correct
    cy.contains("Omkrets / perimeter");
    cy.contains("32.59 km");
    cy.contains("Areal");
    cy.contains("---");

    // Polygon should not be visible, but polyline yes
    cy.get("path.leaflet-interactive").should("not.be.null");
    cy.contains("Arealrapport (polygon ikke definert)");
  });

  it("New polyline point crossing existing lines should not be allowed", () => {
    // Try new point
    cy.get(".leaflet-container").click(660, 640);

    // Warning should be visible
    cy.get(".polygon-action-error").should("be.visible");
    cy.contains("Polygon kanter kan ikke krysse");

    // Warning should disappear after 2.5 seconds
    cy.wait(2500);
    cy.get(".polygon-action-error").should("not.exist");
  });

  it("Polygon with crossing lines should not be allowed", () => {
    // Add new points
    cy.get(".leaflet-container").click(640, 630);
    cy.contains("56.21 km");
    cy.get(".leaflet-container").click(690, 635);
    cy.contains("82.52 km");
    cy.get(".leaflet-container").click(680, 685);
    cy.contains("109.3 km");
    cy.get('span[title="Ferdig"] > button').click();

    // Warning should be visible
    cy.get(".polygon-action-error").should("be.visible");
    cy.contains("Polygon kanter kan ikke krysse");

    // Warning should disappear after 2.5 seconds
    cy.wait(2500);
    cy.get(".polygon-action-error").should("not.exist");
  });
});
