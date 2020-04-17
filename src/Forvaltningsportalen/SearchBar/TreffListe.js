import React from "react";

const TreffListe = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;
  let treffliste_sted = props.treffliste_sted;
  let warning =
    (treffliste && treffliste.length) ||
    (treffliste_lokalt && treffliste_lokalt.length) ||
    (treffliste_sted && treffliste_sted.length);

  console.log(treffliste_sted);

  return (
    <div className="treffliste">
      {treffliste &&
        treffliste.length > 0 &&
        treffliste.map(item => {
          let itemname = item[0] || "";
          let itemtype = item[1] || "";
          let itemnr = item[2] || "";
          return (
            <button
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
            </button>
          );
        })}

      {treffliste_sted &&
        treffliste_sted.length > 0 &&
        treffliste_sted.map(item => {
          let itemname = item.stedsnavn || "";
          let itemtype = "ssr" + item.navnetype || "";
          let itemnr = item.ssrId || "";
          return (
            <button
              className="searchbar_item"
              key={itemnr}
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
            </button>
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
            <button
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
            </button>
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
    </div>
  );
};

export default TreffListe;
