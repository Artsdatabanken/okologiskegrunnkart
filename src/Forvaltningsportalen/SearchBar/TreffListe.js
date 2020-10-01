import React, { useState, useEffect } from "react";
import { KeyboardBackspace } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const TreffListe = ({
  onSelectSearchResult,
  searchResultPage,
  searchTerm,
  handleSearchBar,
  // onSearchButton,
  treffliste_lag,
  treffliste_underlag,
  treffliste_sted,
  treffliste_knr,
  treffliste_gnr,
  treffliste_bnr,
  treffliste_knrgnrbnr,
  removeValgtLag,
  addValgtLag,
  handleGeoSelection,
  handleRemoveTreffliste,
  isMobile,
  handleSideBar,
  handleInfobox,
  handleFullscreenInfobox
}) => {
  const [listItems, setListItems] = useState([]);
  const [resultsType, setResultsType] = useState("all");

  function addToList(list_items, inputlist, type, criteria) {
    if (inputlist) {
      let list_to_update = inputlist;
      if (criteria) {
        if (inputlist[criteria]) {
          list_to_update = inputlist[criteria];
        } else {
          return list_items;
        }
      }

      for (let i in list_to_update) {
        list_to_update[i]["trefftype"] = type;
      }
      return list_items.concat(list_to_update);
    }
    return list_items;
  }

  useEffect(() => {
    let list_items = [];
    let max_list_length = 200;

    if (!searchResultPage) {
      list_items = addToList(
        list_items,
        [{ searchTerm: searchTerm }],
        "Søkeelement",
        null
      );
      max_list_length = 19;
    }

    if (resultsType === "all" || resultsType === "layers") {
      list_items = addToList(list_items, treffliste_lag, "Kartlag", null);
      list_items = addToList(list_items, treffliste_underlag, "Underlag", null);
    }
    if (resultsType === "all" || resultsType === "places") {
      list_items = addToList(list_items, treffliste_sted, "Stedsnavn", null);
      list_items = addToList(
        list_items,
        treffliste_knrgnrbnr,
        "KNR-GNR-BNR",
        "adresser"
      );

      if (treffliste_knr && treffliste_knr.stedsnavn) {
        let knr = treffliste_knr.stedsnavn;
        knr["trefftype"] = "Kommune";
        list_items = list_items.concat(knr);
      }

      list_items = addToList(list_items, treffliste_gnr, "GNR", "adresser");
      list_items = addToList(list_items, treffliste_bnr, "BNR", "adresser");
    }
    list_items = list_items.slice(0, max_list_length);
    list_items = list_items.filter(item => item.trefftype !== "Søkeelement");

    setListItems(list_items);
  }, [
    searchTerm,
    searchResultPage,
    treffliste_lag,
    treffliste_underlag,
    treffliste_sted,
    treffliste_knrgnrbnr,
    treffliste_knr,
    treffliste_gnr,
    treffliste_bnr,
    resultsType
  ]);

  function movefocus(e, index) {
    if (e.keyCode === 27) {
      if (handleRemoveTreffliste) {
        handleRemoveTreffliste();
        handleSearchBar(null);
        document.getElementById("searchfield").value = "";
        document.getElementById("searchfield").focus();
      }
    }
    if (document.getElementsByClassName("searchbar_item")) {
      // nedoverpil
      if (e.keyCode === 40) {
        if (index < listItems.length - 1) {
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

  function onActivate(item, trefftype) {
    if (searchResultPage) {
      onSelectSearchResult(false);
    }
    handleRemoveTreffliste();
    removeValgtLag();
    document.getElementById("searchfield").value = "";
    if (trefftype === "Kartlag" || trefftype === "Underlag") {
      addValgtLag(item, trefftype);
      handleSideBar(true);
      if (isMobile) {
        handleInfobox(false);
        handleFullscreenInfobox(false);
      }
    } else {
      handleGeoSelection(item);
    }
  }

  return (
    <>
      {searchResultPage && (
        <>
          <div className="valgtLag">
            <button
              className="listheadingbutton all-results"
              onClick={e => {
                onSelectSearchResult(false);
              }}
            >
              <span className="listheadingbutton-icon all-results">
                <KeyboardBackspace />
              </span>
              <span className="listheadingbutton-text">Søkeresultater</span>
            </button>
          </div>
          <div className="search-page-options">
            <div className="search-page-options-content">
              <Button
                id={
                  resultsType === "all"
                    ? "filter-search-button-selected"
                    : "filter-search-button"
                }
                size="large"
                color="primary"
                onClick={() => {
                  setResultsType("all");
                  // handleMatchAllFilters(true);
                }}
              >
                Alle
              </Button>
              <Button
                id={
                  resultsType === "places"
                    ? "filter-search-button-selected"
                    : "filter-search-button"
                }
                size="large"
                color="primary"
                onClick={() => {
                  setResultsType("places");
                  // handleMatchAllFilters(false);
                }}
              >
                Steder
              </Button>
              <Button
                id={
                  resultsType === "layers"
                    ? "filter-search-button-selected"
                    : "filter-search-button"
                }
                size="large"
                color="primary"
                onClick={() => {
                  setResultsType("layers");
                  // handleMatchAllFilters(false);
                }}
              >
                Kartlag
              </Button>
            </div>
          </div>
        </>
      )}
      <ul
        className={
          searchResultPage ? "treffliste searchresultpage" : "treffliste"
        }
        id="treffliste"
        // tabIndex="0"
        onKeyDown={e => {
          if (e.keyCode === 40 || e.keyCode === 38) {
            e.preventDefault();
          }
        }}
      >
        {listItems &&
          listItems.map((item, index) => {
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
            } else if (item.trefftype === "Underlag") {
              itemname = item.tittel;
              itemnr = item.tema || "Underlag";
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
                    onActivate(item, trefftype);
                  } else {
                    movefocus(e, index);
                  }
                }}
                onClick={() => {
                  onActivate(item, trefftype);
                }}
              >
                <div className="searchlist-item-wrapper">
                  <span className="itemname">{itemname} </span>
                  <span className="itemtype">
                    {trefftype}
                    {trefftype === "Stedsnavn" ? (
                      <>{`, ${itemtype} i ${item.kommunenavn}`} </>
                    ) : (
                      <>
                        {""} {item.postnummer} {item.poststed}
                      </>
                    )}
                  </span>
                  <span className="itemnr">
                    {trefftype === "Kommune" ||
                    trefftype === "Stedsnavn" ||
                    trefftype === "Kartlag" ||
                    trefftype === "Underlag" ? (
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
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default TreffListe;
