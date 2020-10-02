import React, { useState, useEffect } from "react";
import { KeyboardBackspace } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

const TreffListe = ({
  onSelectSearchResult,
  searchResultPage,
  searchTerm,
  handleSearchBar,
  treffliste_lag,
  treffliste_underlag,
  treffliste_sted,
  treffliste_knr,
  treffliste_gnr,
  treffliste_bnr,
  treffliste_adresse,
  treffliste_knrgnrbnr,
  number_places,
  number_properties,
  number_addresses,
  number_layers,
  removeValgtLag,
  addValgtLag,
  handleGeoSelection,
  handleRemoveTreffliste,
  isMobile,
  windowHeight,
  handleSideBar,
  handleInfobox,
  handleFullscreenInfobox
}) => {
  const [listItems, setListItems] = useState([]);
  const [resultsType, setResultsType] = useState("all");
  const [listLength, setListLength] = useState(0);
  const [pageLength, setPageLength] = useState(0);
  const [numberPages, setNumberPages] = useState(0);

  const addToList = (list_items, inputlist, type, criteria) => {
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
  };

  useEffect(() => {
    if (listLength === 0 || pageLength === 0) {
      setNumberPages(0);
    } else {
      const pages = Math.ceil(listLength / pageLength);
      setNumberPages(pages);
    }
  }, [listLength, pageLength]);

  useEffect(() => {
    let listLength = 0;
    switch (resultsType) {
      case "all":
        listLength =
          parseInt(number_places) +
          parseInt(number_properties) +
          parseInt(number_addresses) +
          parseInt(number_layers);
        break;
      case "layers":
        listLength = parseInt(number_layers);
        break;
      case "places":
        listLength = parseInt(number_places);
        break;
      case "addresses":
        listLength = parseInt(number_addresses);
        break;
      case "properties":
        listLength = parseInt(number_properties);
        break;
      default:
        listLength = 0;
    }
    setListLength(listLength);
  }, [
    resultsType,
    number_places,
    number_properties,
    number_addresses,
    number_layers
  ]);

  useEffect(() => {
    let list_items = [];
    const min_list_length = isMobile ? 6 : 8;
    let max_list_length = isMobile ? 8 : 10;
    // const max_list_length = 10;

    if (!searchResultPage) {
      list_items = addToList(
        list_items,
        [{ searchTerm: searchTerm }],
        "Søkeelement",
        null
      );
      max_list_length = 19;
    } else {
      let nRows = max_list_length;
      if (isMobile) {
        nRows = Math.floor((windowHeight - 84 - 60) / 55);
      } else {
        nRows = Math.floor((windowHeight - 136 - 60) / 55);
      }
      console.log("nRows: ", nRows);
      max_list_length = Math.max(nRows, min_list_length);
    }
    setPageLength(max_list_length);

    if (resultsType === "all" || resultsType === "layers") {
      list_items = addToList(list_items, treffliste_lag, "Kartlag", null);
      list_items = addToList(list_items, treffliste_underlag, "Underlag", null);
    }
    if (resultsType === "all" || resultsType === "places") {
      list_items = addToList(list_items, treffliste_sted, "Stedsnavn", null);
      if (treffliste_knr && treffliste_knr.stedsnavn) {
        let knr = treffliste_knr.stedsnavn;
        knr["trefftype"] = "Kommune";
        list_items = list_items.concat(knr);
      }
    }
    if (resultsType === "all" || resultsType === "addresses") {
      list_items = addToList(list_items, treffliste_adresse, "Adresse", null);
    }
    if (resultsType === "all" || resultsType === "properties") {
      list_items = addToList(
        list_items,
        treffliste_knrgnrbnr,
        "KNR-GNR-BNR",
        "adresser"
      );
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
    treffliste_adresse,
    resultsType,
    isMobile,
    windowHeight
  ]);

  const movefocus = (e, index) => {
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
  };

  const onActivate = (item, trefftype) => {
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
  };

  return (
    <>
      {searchResultPage && (
        <>
          <div className="valgtLag">
            <button
              className="listheadingbutton all-results"
              onClick={e => {
                onSelectSearchResult(false);
                handleRemoveTreffliste();
                handleSearchBar(null);
                document.getElementById("searchfield").value = "";
                document.getElementById("searchfield").focus();
              }}
            >
              <span className="listheadingbutton-icon all-results">
                <KeyboardBackspace />
              </span>
              <span className="listheadingbutton-text">Søkeresultater</span>
            </button>
            <div className="search-page-options">
              <div className="search-page-options-content">
                <Button
                  id={
                    resultsType === "all"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultsType("all");
                  }}
                >
                  Alle
                </Button>
                <Button
                  id={
                    resultsType === "layers"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultsType("layers");
                  }}
                >
                  Kartlag
                </Button>
                <Button
                  id={
                    resultsType === "places"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultsType("places");
                  }}
                >
                  Steder
                </Button>
                <Button
                  id={
                    resultsType === "properties"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultsType("properties");
                  }}
                >
                  Eiendommer
                </Button>
                <Button
                  id={
                    resultsType === "addresses"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultsType("addresses");
                  }}
                >
                  Adresser
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className={
          searchResultPage
            ? "search-results-container"
            : "search-results-compact"
        }
      >
        <div>
          <ul
            className={
              searchResultPage ? "treffliste searchresultpage" : "treffliste"
            }
            id="treffliste"
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
        </div>
        {searchResultPage && numberPages > 0 && (
          <div className="search-pagination-container">
            <Pagination
              count={numberPages}
              shape="rounded"
              variant="outlined"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TreffListe;
