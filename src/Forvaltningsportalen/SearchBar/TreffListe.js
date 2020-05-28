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
  let list_items = [];
  let list_length = 0;

  if (treffliste_lokalt) {
    for (let i in treffliste_lokalt) {
      treffliste_lokalt[i]["trefftype"] = "Kartlag";
    }
    list_items = list_items.concat(treffliste_lokalt);
    list_length = list_items.length;
  }

  if (treffliste_sted) {
    for (let i in treffliste_sted) {
      treffliste_sted[i]["trefftype"] = "Stedsnavn";
    }
    list_items = list_items.concat(treffliste_sted);
    list_length = list_items.length;
  }

  if (treffliste_knrgnrbnr && treffliste_knrgnrbnr.adresser) {
    knrgnrbnr = treffliste_knrgnrbnr.adresser;
    for (let i in knrgnrbnr) {
      knrgnrbnr[i]["trefftype"] = "knrgnrbnr";
    }
    list_items = list_items.concat(knrgnrbnr);
    list_length = list_items.length;
  }

  if (treffliste_knr && treffliste_knr.stedsnavn) {
    knr = treffliste_knr.stedsnavn;
    knr["trefftype"] = "Kommune";
    list_items = list_items.concat(knr);
    list_length = list_items.length;
  }

  if (treffliste_gnr && treffliste_gnr.adresser) {
    gnr = treffliste_gnr.adresser;
    for (let i in gnr) {
      gnr[i]["trefftype"] = "GNR";
    }
    list_items = list_items.concat(gnr);
    list_length = list_items.length;
  }

  if (treffliste_bnr && treffliste_bnr.adresser) {
    bnr = treffliste_bnr.adresser;
    for (let i in bnr) {
      bnr[i]["trefftype"] = "BNR";
    }
    list_items = list_items.concat(bnr);
    list_length = list_items.length;
  }

  let total_length = stedlength + list_length;

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
        //console.log(index, total_length - 1);
        //console.log(index < total_length - 1);
        if (index < total_length - 1) {
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
            itemnr = knr.knr || "";
          } else if (item.trefftype === "Kartlag") {
            itemname = item.tittel;
            itemnr = item.tema || "Kartlag";
          } else if (item.trefftype === "Stedsnavn") {
            itemname = item.stedsnavn || "finner ikke stedsnavn";
            itemtype = item.navnetype || "";
            itemnr = item.ssrId || "";
          }
          let full_index = stedlength + index;

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
                  movefocus(e, full_index);
                }
              }}
              onClick={() => {
                if (!props.isSearchResultPage) {
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                  if (trefftype === "Kommune") {
                    props.handleGeoSelection(knr);
                  } else if (trefftype === "Kartlag") {
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
