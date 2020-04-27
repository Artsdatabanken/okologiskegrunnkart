import React from "react";

const TreffListe = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;
  let treffliste_sted = props.treffliste_sted;
  let geolength = (treffliste && treffliste.length) || 0;
  let kartlaglength = (treffliste_lokalt && treffliste_lokalt.length) || 0;
  let warning = geolength + kartlaglength > 0;

  function movefocus(e, index) {
    if (e.keyCode === 27) {
      if (props.handleRemoveTreffliste) {
        props.handleRemoveTreffliste();
        props.handleSearchBar(null);
        document.getElementById("searchfield").value = "";
        document.getElementById("searchfield").focus();
      }
    }
    if (document.getElementsByClassName("searchbar_item")) {
      // nedoverpil
      if (e.keyCode === 40) {
        document.getElementsByClassName("searchbar_item")[index + 1].focus();
      }
      // oppoverpil
      if (e.keyCode === 38) {
        let nextindex = index - 1;
        if (nextindex < 0) {
          document.getElementById("searchfield").focus();
        } else {
          document.getElementsByClassName("searchbar_item")[index - 1].focus();
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
                if (e.keyCode === 13) {
                  //Enterpressed
                  if (!props.isSearchResultPage) {
                    props.removeValgtLag();
                    props.handleRemoveTreffliste();
                    document.getElementById("searchfield").value = "";
                  }
                  props.handleGeoSelection(item);
                } else {
                  movefocus(e, index);
                }
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
                if (e.keyCode === 13) {
                  //Enterpressed
                  if (!props.isSearchResultPage) {
                    props.handleRemoveTreffliste();
                    document.getElementById("searchfield").value = "";
                  } else {
                    props.setSearchResultPage(false);
                  }
                  props.removeValgtLag();
                  props.addValgtLag(item);
                } else {
                  movefocus(e, full_index);
                }
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
            {geolength >= 5 && (
              <>
                Trykk enter/søk for å se flere geografiske treff
                <br />
              </>
            )}

            {kartlaglength >= 5 &&
              "Trykk enter/søk for å se flere treff i kartlag"}
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
