import React from "react";

const TreffListe = props => {
  // Lengder på ting:
  let list_items = [];
  let list_length = 0;

  if (props.treffliste_lokalt) {
    let treffliste_lokalt = props.treffliste_lokalt;
    for (let i in treffliste_lokalt) {
      treffliste_lokalt[i]["trefftype"] = "Kartlag";
    }
    list_items = list_items.concat(treffliste_lokalt);
    list_length = list_items.length;
  }

  if (props.treffliste_sted) {
    let treffliste_sted = props.treffliste_sted;
    for (let i in treffliste_sted) {
      treffliste_sted[i]["trefftype"] = "Stedsnavn";
    }
    list_items = list_items.concat(treffliste_sted);
    list_length = list_items.length;
  }

  if (props.treffliste_knrgnrbnr && props.treffliste_knrgnrbnr.adresser) {
    let knrgnrbnr = props.treffliste_knrgnrbnr.adresser;
    for (let i in knrgnrbnr) {
      knrgnrbnr[i]["trefftype"] = "knrgnrbnr";
    }
    list_items = list_items.concat(knrgnrbnr);
    list_length = list_items.length;
  }

  if (props.treffliste_knr && props.treffliste_knr.stedsnavn) {
    let knr = props.treffliste_knr.stedsnavn;
    knr["trefftype"] = "Kommune";
    list_items = list_items.concat(knr);
    list_length = list_items.length;
  }

  if (props.treffliste_gnr && props.treffliste_gnr.adresser) {
    let gnr = props.treffliste_gnr.adresser;
    for (let i in gnr) {
      gnr[i]["trefftype"] = "GNR";
    }
    list_items = list_items.concat(gnr);
    list_length = list_items.length;
  }

  if (props.treffliste_bnr && props.treffliste_bnr.adresser) {
    let bnr = props.treffliste_bnr.adresser;
    for (let i in bnr) {
      bnr[i]["trefftype"] = "BNR";
    }
    list_items = list_items.concat(bnr);
    list_length = list_items.length;
  }

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
        //console.log(index, list_length - 1);
        //console.log(index < list_length - 1);
        if (index < list_length - 1) {
          document.getElementsByClassName("searchbar_item")[index + 1].focus();
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
    <ul
      className="treffliste"
      id="treffliste"
      tabIndex="0"
      onKeyDown={e => {
        if (e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault();
        }
      }}
    >
      {list_items &&
        list_items.map((item, index) => {
          let itemname = item.adressetekst || "";
          let trefftype = item.trefftype || "annet treff";
          let itemtype = item.navnetype || "";
          let itemnr = "";
          if (item.trefftype === "Kommune") {
            itemname = item.kommunenavn || "finner ikke kommunenavnet";
            itemnr = item.knr || "";
          } else if (item.trefftype === "Kartlag") {
            itemname = item.tittel;
            itemnr = item.tema || "Kartlag";
          } else if (item.trefftype === "Stedsnavn") {
            itemname = item.stedsnavn || "finner ikke stedsnavn";
            itemtype = item.navnetype || "";
            itemnr = item.ssrId || "";
          }
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
                    props.handleRemoveTreffliste();
                    document.getElementById("searchfield").value = "";
                  } else {
                    props.setSearchResultPage(false);
                  }
                  if (trefftype === "Kartlag") {
                    props.removeValgtLag();
                    props.addValgtLag(item);
                  } else {
                    props.handleGeoSelection(item);
                  }
                } else {
                  movefocus(e, index);
                }
              }}
              onClick={() => {
                if (!props.isSearchResultPage) {
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                  if (trefftype === "Kartlag") {
                    props.removeValgtLag();
                    props.addValgtLag(item);
                  } else {
                    props.handleGeoSelection(item);
                  }
                } else {
                  if (trefftype === "Kartlag") {
                    props.setSearchResultPage(false);
                    props.removeValgtLag();
                    props.addValgtLag(item);
                  }
                }
              }}
            >
              <span className="itemname">{itemname} </span>
              <span className="itemtype">
                {trefftype}{" "}
                {trefftype === "Stedsnavn" ? (
                  <>{itemtype} </>
                ) : (
                  <>
                    {item.postnummer} {item.poststed}
                  </>
                )}
              </span>
              <span className="itemnr">
                {trefftype === "Kommune" ||
                trefftype === "Stedsnavn" ||
                trefftype === "Kartlag" ? (
                  <>{itemnr}</>
                ) : (
                  <>
                    {trefftype === "KNR" ? (
                      <b>{item.kommunenummer}</b>
                    ) : (
                      <>{item.kommunenummer}</>
                    )}
                    -
                    {trefftype === "GNR" ? (
                      <b>{item.gardsnummer}</b>
                    ) : (
                      <>{item.gardsnummer}</>
                    )}
                    -
                    {trefftype === "BNR" ? (
                      <b>{item.bruksnummer}</b>
                    ) : (
                      <>{item.bruksnummer}</>
                    )}
                  </>
                )}
              </span>
            </li>
          );
        })}
    </ul>
  );
};

export default TreffListe;
