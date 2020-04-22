import React from "react";

const TreffListe = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;
  let warning =
    (treffliste && treffliste.length) ||
    (treffliste_lokalt && treffliste_lokalt.length);

  function movefocus(e, index) {
    if (document.getElementsByClassName("searchbar_item")) {
      let all_nodes = document.getElementsByClassName("searchbar_item");
      if (e.keyCode === 40) {
        console.log("gå ned");
        all_nodes[index + 1].focus();
      }
      // Up key
      if (e.keyCode === 38) {
        let nextindex = index - 1;
        if (nextindex < 0) {
          document.getElementById("searchfield").focus();
        } else {
          all_nodes[index - 1].focus();
        }
      }
    }
  }

  return (
    <ul className="treffliste" id="treffliste" tabIndex="0">
      {treffliste &&
        treffliste.length > 0 &&
        treffliste.map((item, index) => {
          let itemname = item[0] || "";
          let itemtype = item[1] || "";
          let itemnr = item[2] || "";
          return (
            <li
              id={index}
              tabIndex="0"
              className="searchbar_item"
              key={item}
              onKeyDown={e => {
                movefocus(e, index);
              }}
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
        treffliste_lokalt.map((item, index) => {
          let full_index = index;
          if (treffliste && treffliste.length) {
            full_index = full_index + treffliste.length;
          }
          let itemname = item.tittel;
          let itemtype = "Kartlag";
          let itemowner = item.dataeier;
          let tema = item.tema || "";
          return (
            <li
              tabIndex="0"
              id={full_index}
              className="searchbar_item"
              key={item.id}
              onKeyDown={e => {
                movefocus(e, full_index);
              }}
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
        <li className="searchbar_item infobutton">
          <span className="itemname">
            Trykk enter eller på søk for å få fler treff
          </span>
        </li>
      ) : (
        <li className="searchbar_item infobutton">
          <span className="itemname">Ingen treff</span>
        </li>
      )}
    </ul>
  );
};

export default TreffListe;
