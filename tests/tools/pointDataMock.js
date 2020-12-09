function pointCoordinates() {
  return { lat: 65.35159239323426, lng: 12.719764709472658 };
}

function pointPlace() {
  return {
    distancemeters: 4930,
    fylkesnavn: ["Nordland"],
    fylkesnummer: [18],
    geom: {},
    kommunenavn: ["Brønnøy"],
    kommunenummer: [1813],
    komplettskrivemåte: ["Langfjorden"],
    navneobjektgruppe: "farvann",
    navneobjekthovedgruppe: "sjø",
    navneobjekttype: "Fjord",
    sortering: "viktighetK",
    stedsnummer: 925535
  };
}

function pointAddress() {
  return { adressetekst: "175 / 1 / 0" };
}

function pointMatrikkel() {
  return "175 / 1";
}

function pointElevation() {
  return 40;
}

export {
  pointCoordinates,
  pointPlace,
  pointAddress,
  pointMatrikkel,
  pointElevation
};
