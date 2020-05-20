import React from "react";

const TreffListe = props => {
  let treffliste_lokalt = props.treffliste_lokalt;
  let treffliste_sted = props.treffliste_sted;
  let treffliste_knrgnrbnr = props.treffliste_knrgnrbnr;
  let treffliste_knr = props.treffliste_knr;
  let treffliste_gnr = props.treffliste_gnr;
  let treffliste_bnr = props.treffliste_bnr;

  // De faktiske listene å iterere - initialisering
  let knrgnrbnr = null;
  let knr = null;
  let bnr = null;
  let gnr = null;

  // Lengder på ting:
  let stedlength = (treffliste_sted && treffliste_sted.length) || 0;
  let kartlaglength = (treffliste_lokalt && treffliste_lokalt.length) || 0;
  let knrgnrbnrlength = 0;
  let gnrlength = 0;
  let bnrlength = 0;
  let knrlength = 0;

  if (treffliste_knr && treffliste_knr.stedsnavn) {
    knr = treffliste_knr.stedsnavn;
    knrlength = 1;
  }

  if (treffliste_bnr && treffliste_bnr.adresser) {
    bnr = treffliste_bnr.adresser;
    bnrlength = bnr.length;
  }

  if (treffliste_gnr && treffliste_gnr.adresser) {
    gnr = treffliste_gnr.adresser;
    gnrlength = gnr.length;
  }

  if (treffliste_knrgnrbnr && treffliste_knrgnrbnr.adresser) {
    knrgnrbnr = treffliste_knrgnrbnr.adresser;
    knrgnrbnrlength = knrgnrbnr.length;
  }

  let total_length =
    stedlength +
    kartlaglength +
    knrgnrbnrlength +
    gnrlength +
    bnrlength +
    knrlength;

  function movefocus(e, index) {
    console.log("triggered");
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
        console.log(index, total_length - 1);
        console.log(index < total_length - 1);
        if (index < total_length - 1) {
          document.getElementsByClassName("searchbar_item")[index + 1].focus();
        } else {
          console.log("not doing stuff");
        }
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
      {stedlength > 0 &&
        treffliste_sted.map((item, index) => {
          let itemname = item.stedsnavn || "";
          let itemtype = item.navnetype || "";
          let itemnr = item.ssrId || "";
          return (
            <li
              id={index}
              key={index}
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
              key={full_index}
              className="searchbar_item"
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
      {knrgnrbnr &&
        knrgnrbnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let full_index = kartlaglength + stedlength + index;
          return (
            <li
              id={full_index}
              key={full_index}
              tabIndex="0"
              className="searchbar_item"
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
                  props.removeValgtLag();
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }
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
      {knr && (
        <li
          id={kartlaglength + stedlength + knrgnrbnrlength + knrlength}
          key={kartlaglength + stedlength + knrgnrbnrlength + knrlength}
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
              //props.addValgtLag(item);
            } else {
              movefocus(
                e,
                kartlaglength + stedlength + knrgnrbnrlength + knrlength
              );
            }
          }}
          tabIndex="0"
          className="searchbar_item"
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
          <span className="itemnr">
            <b>{knr.knr}</b>
          </span>
        </li>
      )}

      {gnr &&
        gnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let full_index =
            kartlaglength + stedlength + knrgnrbnrlength + knrlength + index;
          return (
            <li
              id={full_index}
              key={full_index}
              tabIndex="0"
              className="searchbar_item"
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
                  props.removeValgtLag();
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }
              }}
            >
              <span className="itemname">{itemname} </span>
              <span className="itemtype">
                {" "}
                GNR - {item.postnummer} {item.poststed}
              </span>
              <span className="itemnr">
                {item.kommunenummer} - <b>{item.gardsnummer}</b> -{" "}
                {item.bruksnummer}
              </span>
            </li>
          );
        })}

      {bnr &&
        bnr.map((item, index) => {
          let itemname = item.adressetekst || "";
          let full_index =
            kartlaglength +
            stedlength +
            knrgnrbnrlength +
            knrlength +
            gnrlength +
            index;
          return (
            <li
              id={full_index}
              key={full_index}
              tabIndex="0"
              className="searchbar_item"
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
                  props.removeValgtLag();
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }
              }}
            >
              <span className="itemname">{itemname} </span>
              <span className="itemtype">
                BNR - {item.postnummer} {item.poststed}
              </span>
              <span className="itemnr">
                {item.kommunenummer} - {item.gardsnummer} -{" "}
                <b>{item.bruksnummer}</b>
              </span>
            </li>
          );
        })}
    </ul>
  );
};

export default TreffListe;
