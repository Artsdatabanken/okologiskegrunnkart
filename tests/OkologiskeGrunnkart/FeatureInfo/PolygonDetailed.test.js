/* eslint-disable prettier/prettier */
import React from "react";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";
import PolygonDetailed from "../../../src/Okologiskegrunnkart/FeatureInfo/PolygonDetailed";
import polygonResultsMock from "../../tools/polygonResultsMock.json";

afterEach(cleanup);

const polygonResults = polygonResultsMock;
const availableLayers = {
  FYL: { name: "Fylker", icon: "terrain", owner: "Kartverket" },
  KOM: { name: "Kommuner", icon: "flag", owner: "Kartverket" },
  MAT: { name: "Eiendommer", icon: "home", owner: "Kartverket" },
  ANF: {
    name: "Arter Nasjonal Forvaltningsinteresse",
    icon: "Arter",
    owner: "Miljødirektoratet"
  },
  BRE: {
    name: "Breer i Norge",
    icon: "Geologi",
    owner: "Norges vassdrags- og energidirektorat"
  },
  N13: {
    name: "Naturtyper - DN Håndbook 13",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  NMA: {
    name: "Naturtyper - DN Håndbook 19",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  NIN: {
    name: "Naturtyper - NiN Mdir",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  VRN: {
    name: "Naturvernområder",
    icon: "Administrative støttekart",
    owner: "Miljødirektoratet"
  },
  ISJ: {
    name: "Innsjødatabase",
    icon: "Ferskvann",
    owner: "Norges vassdrags- og energidirektorat"
  },
  MAG: {
    name: "Vannkraft - Magasin",
    icon: "Ferskvann",
    owner: "Miljødirektoratet"
  },
  VVS: {
    name: "Verneplan for Vassdrag",
    icon: "Ferskvann",
    owner: "Norges vassdrags- og energidirektorat"
  }
};

function renderPolygonDetailed(args) {
  let defaultprops = {
    resultLayer: null,
    detailResult: null,
    hideDetailedResults: () => {},
    totalArea: 305.71051231264886
  };

  const props = { ...defaultprops, ...args };
  return render(<PolygonDetailed {...props} />);
}

it("should render polygon details for fylke", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["FYL"],
    detailResult: polygonResults["FYL"]
  });
  // Headers
  let headers = screen.queryByText("Valgte arealrapporter");
  expect(headers).toBeNull();
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Fylker");
  getByText("Trøndelag");
  getByText("50");
  getByText("Kartverket");
  getByText("305.7 km²");
  getByText("(100.0%)");
  getByText("1");
});

it("should render polygon details for kommune", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["KOM"],
    detailResult: polygonResults["KOM"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Kommuner");
  getByText("Midtre Gauldal");
  getByText("5027");
  getByText("191.0 km²");
  getByText("(62.5%)");
  getByText("Midtre Gauldal");
  getByText("5028");
  getByText("114.7 km²");
  getByText("(37.5%)");
  getByText("Kartverket");
  getByText("2");
});

it("should render polygon details for eiendommer", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["MAT"],
    detailResult: polygonResults["MAT"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Eiendommer");
  getByText("5027 / 2 / 1");
  getByText("57.6 km²");
  getByText("(18.8%)");
  getByText("5027 / 76 / 1 - 2, 77 / 1 - 4, 25");
  getByText("43.7 km²");
  getByText("(14.3%)");
  getByText("5027 / 72 / 1 - 2, 4 - 5, 14, 74 / 2 - 3");
  getByText("34.0 km²");
  getByText("(11.1%)");
  getByText("Kartverket");
  getByText("15");
});

it("should render polygon details for arter av nasjonal forvaltningsinteresse", () => {
  const { getByText, getAllByText } = renderPolygonDetailed({
    resultLayer: availableLayers["ANF"],
    detailResult: polygonResults["ANF"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Arter Nasjonal Forvaltningsinteresse");
  getByText("Crex crex");
  getByText("Åkerrikse");
  getByText("2.14 km²");
  getByText("(0.70%)");
  getByText("Chroicocephalus ridibundus");
  getByText("Hettemåke");
  getByText("1.65 km²");
  getByText("(0.54%)");
  getByText("Numenius arquata");
  getByText("Storspove");
  getByText("1.21 km²");
  getByText("Miljødirektoratet");
  getByText("16");
  let percent = getAllByText("(0.39%)");
  expect(percent.length).toBe(2);
});

it("should render polygon details for breer i Norge", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["BRE"],
    detailResult: polygonResults["BRE"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Breer i Norge");
  getByText("SnøIsbre");
  getByText("Dukfonna");
  getByText("0.041 km²");
  getByText("(0.014%)");
  getByText("Norges vassdrags- og energidirektorat");
  getByText("1");
});

it("should render polygon details for Naturtyper - DN Håndbook 13", async () => {
  const { getByText, getAllByText, findByText } = renderPolygonDetailed({
    resultLayer: availableLayers["N13"],
    detailResult: polygonResults["N13"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Naturtyper - DN Håndbook 13");
  getByText("Gammel granskog");
  getByText("F18");
  getByText("1.13 km²");
  getByText("(0.37%)");
  getByText("Kalkrike områder i fjellet");
  getByText("C01");
  getByText("0.88 km²");
  getByText("(0.29%)");
  getByText("Rikmyr");
  getByText("A05");
  getByText("0.86 km²");
  getByText("(0.28%)");
  getByText("Miljødirektoratet");
  getByText("24");
  getByText("Samlenaturtype for all kalkrik vegetasjon i f");
  getByText("Jordvannsmyrer hovedsakelig på baserik berggr");
  let expand = getAllByText("Les mer");
  expect(expand.length).toBe(17);

  // Click expand
  fireEvent.click(expand[0]);
  await waitFor(() => findByText("Les mindre"));
  getByText(
    "Samlenaturtype for all kalkrik vegetasjon i fjellet. Kalkrik bergrunn gir et næringsrikt jordsmonn og stedvis frodig vegetasjon med et høyt antall urter, lav og moser. Rikmyrer og rikkilder over skoggrensa kan kartlegges separat dersom en ønsker det (se også myrkapitlet). Gamle beite- og slåtte­marker er også gjerne knyttet til næringsrike områder på kalkrik grunn."
  );
});

it("should render polygon details for Naturtyper - DN Håndbook 19", async () => {
  const { getByText, getAllByText, findByText } = renderPolygonDetailed({
    resultLayer: availableLayers["NMA"],
    detailResult: polygonResults["NMA"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Naturtyper - DN Håndbook 19");
  getByText("Arasvikfjorden");
  getByText("0.27 km²");
  getByText("(0.088%)");
  getByText("Aursundet");
  getByText("0.26 km²");
  getByText("(0.086%)");
  getByText("Vinjefjorden");
  getByText("0.15 km²");
  getByText("(0.050%)");
  getByText("Miljødirektoratet");
  getByText("3");
  let code = getAllByText("I01");
  expect(code.length).toBe(3);
  let description = getAllByText(
    "Større tareskogforekomster. A – Lokaliteter m"
  );
  expect(description.length).toBe(3);
  let expand = getAllByText("Les mer");
  expect(expand.length).toBe(3);

  // Click expand
  fireEvent.click(expand[0]);
  await waitFor(() => findByText("Les mindre"));
  getByText(
    "Større tareskogforekomster. A – Lokaliteter med st…eskog (~100 000 m2). Tareskog i nedbeita områder."
  );
});

it("should render polygon details for arter Naturtyper - NiN Mdir", () => {
  const { getByText, getAllByText } = renderPolygonDetailed({
    resultLayer: availableLayers["NIN"],
    detailResult: polygonResults["NIN"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Naturtyper - NiN Mdir");
  let name = getAllByText("Åpen myrflate i boreonemoral til nordboreal sone");
  expect(name.length).toBe(3);
  getByText("1.97 km²");
  getByText("(0.64%)");
  getByText("Kalkrik åpen jordvannsmyr i boreonemoral til nordboreal sone");
  getByText("0.11 km²");
  getByText("(0.037%)");
  getByText("Rik åpen sørlig jordvannsmyr");
  getByText("0.082 km²");
  getByText("(0.027%)");
  getByText("Miljødirektoratet");
  getByText("8");
  // Qualities
  let quality = getAllByText("Svært høy kvalitet");
  expect(quality.length).toBe(3);
  quality = getAllByText("Høy kvalitet");
  expect(quality.length).toBe(2);
});

it("should render polygon details for arter Naturvernområder", () => {
  const { getByText, getAllByText } = renderPolygonDetailed({
    resultLayer: availableLayers["VRN"],
    detailResult: polygonResults["VRN"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Naturvernområder");
  getByText("Svarttjønnåsen");
  let type = getAllByText("Naturreservat");
  expect(type.length).toBe(5);
  getByText("8.04 km²");
  getByText("(2.6%)");
  getByText("Kvasshyllan");
  getByText("3.67 km²");
  getByText("(1.2%)");
  getByText("Hoppardalsmyra");
  getByText("0.37 km²");
  getByText("(0.12%)");
  getByText("Miljødirektoratet");
  getByText("6");
  // Other types
  getByText("Plantefredningsomraade");
});

it("should render polygon details for arter Innsjødatabase", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["ISJ"],
    detailResult: polygonResults["ISJ"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Innsjødatabase");
  getByText("Ramstadsjøen");
  getByText("236345");
  getByText("1.26 km²");
  getByText("(0.41%)");
  getByText("Langvatnet");
  getByText("216370");
  getByText("0.48 km²");
  getByText("(0.16%)");
  getByText("Råsjøen");
  getByText("217887");
  getByText("0.33 km²");
  getByText("(0.11%)");
  getByText("Norges vassdrags- og energidirektorat");
  getByText("10");
});

it("should render polygon details for arter Vannkraft - Magasin", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["MAG"],
    detailResult: polygonResults["MAG"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Vannkraft - Magasin");
  getByText("SOKNA");
  getByText("RK");
  getByText("0.094 km²");
  getByText("(0.031%)");
  getByText("Miljødirektoratet");
  getByText("1");
  getByText("Reguleringsmagasin til kraftproduksjon");
});

it("should render polygon details for arter Verneplan for Vassdrag", () => {
  const { getByText } = renderPolygonDetailed({
    resultLayer: availableLayers["VVS"],
    detailResult: polygonResults["VVS"]
  });
  // Layer result details
  getByText("Detaljerte resultater");
  getByText("Verneplan for Vassdrag");
  getByText("Gaula");
  getByText("122/1");
  getByText("305.7 km²");
  getByText("(100.0%)");
  getByText("Norges vassdrags- og energidirektorat");
  getByText("1");
});
