import React from "react";

const TreffListe = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;

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
    </div>
  );
};

export default TreffListe;
