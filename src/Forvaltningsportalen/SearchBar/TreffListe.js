import React from "react";

const TreffListe = props => {
  let treffliste_lokalt = props.treffliste_lokalt;
  let treffliste_sted = props.treffliste_sted;
  let treffliste_knrgnrbnr = props.treffliste_knrgnrbnr;
  let treffliste_knr = props.treffliste_knr;
  let treffliste_gnr = props.treffliste_gnr;
  let treffliste_bnr = props.treffliste_bnr;
  let knrgnrbnr = treffliste_knrgnrbnr && treffliste_knrgnrbnr.adresser;
  let knr = treffliste_knr && treffliste_knr.adresser[0];
  let bnr = treffliste_bnr && treffliste_bnr.adresser;
  let gnr = treffliste_gnr && treffliste_gnr.adresser;
  let stedlength = (treffliste_sted && treffliste_sted.length) || 0;
  let kartlaglength = (treffliste_lokalt && treffliste_lokalt.length) || 0;
  //let warning = kartlaglength + stedlength > 0;

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
      {knr && (
        <li
          id="0"
          tabIndex="0"
          className="searchbar_item"
          onKeyDown={e => {
            if (e.keyCode === 13) {
              //Enterpressed
              if (!props.isSearchResultPage) {
                props.removeValgtLag();
                props.handleRemoveTreffliste();
                document.getElementById("searchfield").value = "";
              }
              props.handleGeoSelection(knr);
            } else {
              movefocus(e, 0);
            }
          }}
          onClick={() => {
            if (!props.isSearchResultPage) {
              props.removeValgtLag();
              props.handleRemoveTreffliste();
              document.getElementById("searchfield").value = "";
            }
            props.handleGeoSelection(knr);
          }}
        >
          <span className="itemname">{knr.kommunenavn} </span>
          <span className="itemtype">Kommune</span>
          <span className="itemnr">{knr.kommunenummer}</span>
        </li>
      )}

      {gnr &&
        gnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let itemnr = index;
          return (
            <li
              id={index}
              tabIndex="0"
              className="searchbar_item"
              key={itemnr}
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
              <span className="itemtype">
                {" "}
                GNR - {item.postnummer} {item.poststed}
              </span>
              <span className="itemnr">
                {item.kommunenummer} - {item.gardsnummer} - {item.bruksnummer}
              </span>
            </li>
          );
        })}

      {bnr &&
        bnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let itemnr = index;
          return (
            <li
              id={index}
              tabIndex="0"
              className="searchbar_item"
              key={itemnr}
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
              <span className="itemtype">
                BNR - {item.postnummer} {item.poststed}
              </span>
              <span className="itemnr">
                {item.kommunenummer} - {item.gardsnummer} - {item.bruksnummer}{" "}
              </span>
            </li>
          );
        })}

      {knrgnrbnr &&
        knrgnrbnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let itemnr = index;
          return (
            <li
              id={index}
              tabIndex="0"
              className="searchbar_item"
              key={itemnr}
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
              <span className="itemtype">
                {item.postnummer} {item.poststed}{" "}
              </span>
              <span className="itemnr">
                {item.kommunenummer} - {item.gardsnummer} - {item.bruksnummer}{" "}
              </span>
            </li>
          );
        })}
      {stedlength > 0 &&
        treffliste_sted.map((item, index) => {
          let itemname = item.stedsnavn || "";
          let itemtype = item.navnetype || "";
          let itemnr = item.ssrId || "";
          return (
            <li
              id={index}
              tabIndex="0"
              className="searchbar_item"
              key={itemnr}
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

      {kartlaglength > 0 &&
        treffliste_lokalt.map((item, index) => {
          let full_index = index + stedlength;
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
      {/*warning ? (
        <li className="searchbar_item infobutton">
          <span className="itemname">
            {stedlength >= 5 && (
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
      )*/}
    </ul>
  );
};

export default TreffListe;
