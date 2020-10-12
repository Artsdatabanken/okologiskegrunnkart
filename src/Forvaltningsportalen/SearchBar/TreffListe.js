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
  number_knrgnrbnr,
  number_knr,
  number_gnr,
  number_bnr,
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
  const [resultType, setResultType] = useState("all");
  const [listLength, setListLength] = useState(0);
  const [pageLength, setPageLength] = useState(0);
  const [numberPages, setNumberPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

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

  const getNewPage = page => {
    const term = document.getElementById("searchfield").value;
    if (resultType === "places" || resultType === "addresses") {
      handleSearchBar(term, true, page, pageLength, resultType);
    }
    if (resultType === "properties") {
      const knrgnrbnr = parseInt(number_knrgnrbnr);
      const knr = parseInt(number_knr);
      const gnr = parseInt(number_gnr);
      const bnr = parseInt(number_bnr);
      console.log("Total: ", knrgnrbnr + knr + gnr + bnr);
      console.log("Number pages: ", (knrgnrbnr + knr + gnr + bnr) / pageLength);
      if (page === 0) {
        handleSearchBar(term, true);
      } else if (knrgnrbnr > 0) {
        handleSearchBar(term, true, page, pageLength, resultType);
      } else {
        // ----------------------------------------------------------- //
        // ------------------- NOT WORKING YET ----------------------- //
        // ----------------------------------------------------------- //
        let propertyType = "";
        if (pageLength * page > knr + gnr) {
          const from = Math.floor((pageLength * page - knr - gnr) / pageLength);
          propertyType = `gnr=[null:null],bnr=[${from}:${pageLength}]`;
        } else if (
          pageLength * page > knr &&
          pageLength * (page + 1) < knr + gnr
        ) {
          const from = Math.floor((pageLength * page - knr) / pageLength);
          propertyType = `gnr=[${from}:${pageLength}],bnr=[null:null]`;
        } else if (
          pageLength * page > knr &&
          pageLength * page < knr + gnr &&
          pageLength * (page + 1) > knr + gnr
        ) {
          const from_gnr = Math.floor((pageLength * page - knr) / pageLength);
          const length_bnr = pageLength - (pageLength * page - knr - gnr);
          propertyType = `gnr=[${from_gnr}:${pageLength}],bnr=[0:${length_bnr}]`;
        }
        // console.log("listLength: ", listLength)
        // console.log("listLength: ", list)
        // console.log("number_knrgnrbnr: ", parseInt(number_knrgnrbnr))
        // console.log("number_knr: ", parseInt(number_knr))
        // console.log("number_gnr: ", parseInt(number_gnr))
        // console.log("number_bnr: ", parseInt(number_bnr))
        // handleSearchBar(term, true, page, pageLength, resultType, propertyType);
        handleSearchBar(term, true, page, pageLength, resultType, propertyType);
        // console.log("propertyType: ", propertyType);
      }
    }
    if (resultType === "layers") {
      let list_items = [];
      list_items = addToList(list_items, treffliste_lag, "Kartlag", null);
      list_items = addToList(list_items, treffliste_underlag, "Underlag", null);
      list_items = list_items.slice(pageLength * page, pageLength * (page + 1));
      list_items = list_items.filter(item => item.trefftype !== "Søkeelement");
      setListItems(list_items);
    }
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
    switch (resultType) {
      case "all":
        listLength =
          parseInt(number_places) +
          parseInt(number_knrgnrbnr) +
          parseInt(number_knr) +
          parseInt(number_gnr) +
          parseInt(number_bnr) +
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
        listLength =
          parseInt(number_knrgnrbnr) +
          parseInt(number_knr) +
          parseInt(number_gnr) +
          parseInt(number_bnr);
        break;
      default:
        listLength = 0;
    }
    setListLength(listLength);
  }, [
    resultType,
    number_places,
    number_knrgnrbnr,
    number_knr,
    number_gnr,
    number_bnr,
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
      max_list_length = Math.max(nRows, min_list_length);
    }
    setPageLength(max_list_length);

    if (resultType === "all" || resultType === "layers") {
      list_items = addToList(list_items, treffliste_lag, "Kartlag", null);
      list_items = addToList(list_items, treffliste_underlag, "Underlag", null);
    }
    if (resultType === "all" || resultType === "places") {
      list_items = addToList(list_items, treffliste_sted, "Stedsnavn", null);
      if (treffliste_knr && treffliste_knr.stedsnavn) {
        let knr = treffliste_knr.stedsnavn;
        knr["trefftype"] = "Kommune";
        list_items = list_items.concat(knr);
      }
    }
    if (resultType === "all" || resultType === "addresses") {
      list_items = addToList(list_items, treffliste_adresse, "Adresse", null);
    }
    if (resultType === "all" || resultType === "properties") {
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
    console.log("treffliste_gnr", treffliste_gnr);
    console.log("treffliste_bnr", treffliste_bnr);
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
    resultType,
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
                    resultType === "all"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("all");
                    setPageNumber(1);
                  }}
                >
                  Alle
                </Button>
                <Button
                  id={
                    resultType === "layers"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("layers");
                    setPageNumber(1);
                  }}
                >
                  Kartlag
                </Button>
                <Button
                  id={
                    resultType === "places"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("places");
                    setPageNumber(1);
                  }}
                >
                  Steder
                </Button>
                <Button
                  id={
                    resultType === "addresses"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("addresses");
                    setPageNumber(1);
                  }}
                >
                  Adresser
                </Button>
                <Button
                  id={
                    resultType === "properties"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("properties");
                    setPageNumber(1);
                  }}
                >
                  Eiendommer
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
              id="search-pagination-component"
              count={numberPages}
              shape="rounded"
              variant="outlined"
              color="primary"
              page={pageNumber}
              size="small"
              onChange={(event, page) => {
                setPageNumber(page);
                getNewPage(page - 1);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TreffListe;
