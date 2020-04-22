import React from "react";

const TreffListe = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;
  let warning =
    (treffliste && treffliste.length) ||
    (treffliste_lokalt && treffliste_lokalt.length);

  return (
    <ul className="treffliste" id="treffliste" tabindex="0">
      {treffliste &&
        treffliste.length > 0 &&
        treffliste.map(item => {
          let itemname = item[0] || "";
          let itemtype = item[1] || "";
          let itemnr = item[2] || "";
          return (
            <li
              className="searchbar_item"
              key={item}
              onClick={() => {
                if (!props.isSearchResultPage) {
                  props.removeValgtLag();
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }
                props.handleGeoSelection(item);
              }}
            >
              <span className="itemname">{itemname} </span>
              <span className="itemtype">{itemtype} </span>
              <span className="itemnr">{itemnr} </span>
            </li>
          );
        })}

      {treffliste_lokalt &&
        treffliste_lokalt.length > 0 &&
        treffliste_lokalt.map(item => {
          let itemname = item.tittel;
          let itemtype = "Kartlag";
          let itemowner = item.dataeier;
          let tema = item.tema || "";
          return (
            <li
              className="searchbar_item"
              key={item.id}
              onClick={() => {
                if (!props.isSearchResultPage) {
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                } else {
                  props.setSearchResultPage(false);
                }
                props.removeValgtLag();
                props.addValgtLag(item);
              }}
            >
              <span className="itemname">{itemname} </span>
              <span className="itemtype">
                {itemtype}, {itemowner}{" "}
              </span>
              <span className="itemnr">{tema}</span>
            </li>
          );
        })}
      {warning ? (
        <button className="searchbar_item infobutton">
          <span className="itemname">
            Trykk enter eller på søk for å få fler treff
          </span>
        </button>
      ) : (
        <button className="searchbar_item infobutton">
          <span className="itemname">Ingen treff</span>
        </button>
      )}
    </ul>
  );
};

export default TreffListe;
