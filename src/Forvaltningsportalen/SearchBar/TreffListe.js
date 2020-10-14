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
  treffliste_kommune,
  treffliste_knr,
  treffliste_gnr,
  treffliste_bnr,
  treffliste_adresse,
  treffliste_knrgnrbnr,
  number_places,
  number_knrgnrbnr,
  number_kommune,
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
  // const [listLength, setListLength] = useState(0);
  const [pageLength, setPageLength] = useState(0);
  const [numberPages, setNumberPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [knr, setKnr] = useState(parseInt(number_knr));
  const [gnr, setGnr] = useState(parseInt(number_gnr));
  const [bnr, setBnr] = useState(parseInt(number_bnr));

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
      handleSearchBar(term, true, page, pageLength, resultType, "", true);
    }
    if (resultType === "properties") {
      const knrgnrbnr = parseInt(number_knrgnrbnr);
      if (page === 0) {
        handleSearchBar(term, true, 0, 20, resultType, "", true);
      } else if (knrgnrbnr > 0) {
        handleSearchBar(term, true, page, pageLength, resultType, "", true);
      } else {
        const propertyType = getPropertyPage(page);
        console.log("number_knrgnrbnr: ", parseInt(number_knrgnrbnr));
        console.log("number_kommune: ", parseInt(number_kommune));
        console.log("knr: ", knr);
        console.log("gnr: ", gnr);
        console.log("bnr: ", bnr);
        // handleSearchBar(term, true, page, pageLength, resultType, propertyType);
        handleSearchBar(
          term,
          true,
          page,
          pageLength,
          resultType,
          propertyType,
          true
        );
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

  const getPropertyPage = pageAPI => {
    // NOTE: page in API starts from 0, while page in Pagination starts from 1
    const page = pageAPI + 1;
    // const knr = parseInt(number_knr);
    // const gnr = parseInt(number_gnr);
    // const bnr = parseInt(number_bnr);
    let propertyType = {};
    if (page <= Math.ceil(knr / pageLength)) {
      // Only knr
      const from = page - 1;
      propertyType = {
        knr: { page: from, number: pageLength },
        gnr: { page: null, number: null },
        bnr: { page: null, number: null }
      };
    } else if (
      page > Math.ceil(knr / pageLength) &&
      page <= Math.ceil(knr / pageLength) + Math.ceil(gnr / pageLength)
    ) {
      // Only gnr
      const from = page - 1 - Math.ceil(knr / pageLength);
      propertyType = {
        knr: { page: null, number: null },
        gnr: { page: from, number: pageLength },
        bnr: { page: null, number: null }
      };
    } else if (
      page >
      Math.ceil(knr / pageLength) + Math.ceil(gnr / pageLength)
    ) {
      // Only bnr
      const from =
        page - 1 - Math.ceil(knr / pageLength) - Math.ceil(gnr / pageLength);
      console.log("Calc 1: ", page - 1);
      console.log("Calc 2: ", Math.floor(knr / pageLength));
      console.log("Calc 3: ", Math.floor(gnr / pageLength));
      propertyType = {
        knr: { page: null, number: null },
        gnr: { page: null, number: null },
        bnr: { page: from, number: pageLength }
      };
    }
    return propertyType;
  };

  // Reset page number if search term changes
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  // Update number of knr so we don't request more than 10000
  // (this will cause an error with the last page)
  useEffect(() => {
    let number = parseInt(number_knr);
    if (number >= 10000) {
      const pages = Math.floor(number / pageLength);
      const newNumber = pages * pageLength;
      setKnr(newNumber);
    } else {
      setKnr(number);
    }
  }, [number_knr, pageLength]);

  // Update number of gnr so we don't request more than 10000
  // (this will cause an error with the last page)
  useEffect(() => {
    let number = parseInt(number_gnr);
    if (number >= 10000) {
      const pages = Math.floor(number / pageLength);
      const newNumber = pages * pageLength;
      setGnr(newNumber);
    } else {
      setGnr(number);
    }
  }, [number_gnr, pageLength]);

  // Update number of bnr so we don't request more than 10000
  // (this will cause an error with the last page)
  useEffect(() => {
    let number = parseInt(number_bnr);
    if (number >= 10000) {
      const pages = Math.floor(number / pageLength);
      const newNumber = pages * pageLength;
      setBnr(newNumber);
    } else {
      setBnr(number);
    }
  }, [number_bnr, pageLength]);

  // Update list length in result list when list or results type changes
  useEffect(() => {
    let listLength = 0;
    let pages = 0;
    switch (resultType) {
      case "all":
        listLength =
          parseInt(number_places) +
          parseInt(number_knrgnrbnr) +
          // parseInt(number_kommune) +
          knr +
          gnr +
          bnr +
          parseInt(number_addresses) +
          parseInt(number_layers);
        pages = listLength ? Math.ceil(listLength / pageLength) : 0;
        break;
      case "layers":
        listLength = parseInt(number_layers) || 0;
        pages = listLength ? Math.ceil(listLength / pageLength) : 0;
        break;
      case "places":
        listLength = parseInt(number_places);
        pages = listLength ? Math.ceil(listLength / pageLength) : 0;
        break;
      case "addresses":
        listLength = parseInt(number_addresses);
        pages = listLength ? Math.ceil(listLength / pageLength) : 0;
        break;
      case "properties":
        listLength = parseInt(number_knrgnrbnr);
        pages = listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = knr;
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = gnr;
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = bnr;
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        break;
      default:
        pages = 1;
    }
    if (!pages || pages === 0) pages = 1;
    setNumberPages(pages);
  }, [
    resultType,
    number_places,
    number_knrgnrbnr,
    number_kommune,
    knr,
    gnr,
    bnr,
    number_addresses,
    number_layers,
    pageLength
  ]);

  // Update elements in the list
  useEffect(() => {
    let list_items = [];
    const min_list_length = 1;
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
        nRows = Math.floor((windowHeight - 84 - 40) / 55);
      } else {
        nRows = Math.floor((windowHeight - 136 - 40) / 55);
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
      if (treffliste_kommune && treffliste_kommune.stedsnavn) {
        let knr = treffliste_kommune.stedsnavn;
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
      list_items = addToList(list_items, treffliste_knr, "KNR", "adresser");
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
    treffliste_kommune,
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
