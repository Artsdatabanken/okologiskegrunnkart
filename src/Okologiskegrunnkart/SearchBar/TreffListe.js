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
  treffliste_koord,
  number_places,
  number_knrgnrbnr,
  number_kommune,
  number_knr,
  number_gnr,
  number_bnr,
  number_addresses,
  number_layers,
  number_coord,
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
  const [pageLength, setPageLength] = useState(0);
  const [numberPages, setNumberPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [knr, setKnr] = useState(parseInt(number_knr));
  const [gnr, setGnr] = useState(parseInt(number_gnr));
  const [bnr, setBnr] = useState(parseInt(number_bnr));
  const [places, setPlaces] = useState(parseInt(number_places));
  const [properties, setProperties] = useState(parseInt(number_knrgnrbnr));

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
      handleSearchBar(term, page, pageLength, resultType, "");
    }
    if (resultType === "properties") {
      const knrgnrbnr = parseInt(number_knrgnrbnr);
      if (knrgnrbnr > 0) {
        handleSearchBar(term, page, pageLength, resultType, "");
      } else {
        const pageDistribution = getPropertyPageDistribution(page);
        handleSearchBar(term, page, pageLength, resultType, pageDistribution);
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

  const getPropertyPageDistribution = pageAPI => {
    // NOTE: page in API starts from 0, while page in Pagination starts from 1
    const page = pageAPI + 1;

    let pageDistribution = {};
    if (page <= Math.ceil(knr / pageLength)) {
      // Only knr
      const from = page - 1;
      pageDistribution = {
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
      pageDistribution = {
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
      pageDistribution = {
        knr: { page: null, number: null },
        gnr: { page: null, number: null },
        bnr: { page: from, number: pageLength }
      };
    }
    return pageDistribution;
  };

  // Reset page number if search term changes
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  // Calculate total number of places
  useEffect(() => {
    let number = 0;
    if (number_places && parseInt(number_places)) {
      number += parseInt(number_places);
    }
    if (number_kommune && parseInt(number_kommune)) {
      number += parseInt(number_kommune);
    }
    setPlaces(number);
  }, [number_places, number_kommune]);

  // Calculate total number of properties
  useEffect(() => {
    let number = 0;
    if (number_knrgnrbnr && parseInt(number_knrgnrbnr)) {
      number += parseInt(number_knrgnrbnr);
    }
    if (knr) number += knr;
    if (gnr) number += gnr;
    if (bnr) number += bnr;
    setProperties(number);
  }, [number_knrgnrbnr, knr, gnr, bnr]);

  // Reset result type when changing search result page
  useEffect(() => {
    if (searchResultPage) {
      setResultType("layers");
    } else {
      setResultType("all");
    }
  }, [searchResultPage]);

  // Update number of knr so we don't request more than 10000
  // (this will cause an error when fetching the last page)
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
  // (this will cause an error when fetching the last page)
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
  // (this will cause an error when fetching the last page)
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
    if (!pageLength || pageLength === 0) {
      setNumberPages(pages);
      return;
    }
    switch (resultType) {
      case "all":
        listLength = parseInt(number_layers);
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = parseInt(number_places);
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = parseInt(number_addresses) + parseInt(number_kommune);
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        listLength = parseInt(number_knrgnrbnr);
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        pages += knr ? Math.ceil(knr / pageLength) : 0;
        pages += gnr ? Math.ceil(gnr / pageLength) : 0;
        pages += bnr ? Math.ceil(bnr / pageLength) : 0;
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
        pages = listLength ? Math.floor(listLength / pageLength) : 0;
        break;
      case "properties":
        listLength = parseInt(number_knrgnrbnr);
        pages += listLength ? Math.ceil(listLength / pageLength) : 0;
        pages += knr ? Math.ceil(knr / pageLength) : 0;
        pages += gnr ? Math.ceil(gnr / pageLength) : 0;
        pages += bnr ? Math.ceil(bnr / pageLength) : 0;
        break;
      case "coordinates":
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
        nRows = Math.floor((windowHeight - 142 - 40) / 55);
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
    if (resultType === "all" || resultType === "coordinates") {
      list_items = addToList(list_items, treffliste_koord, "Punkt", null);
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
    treffliste_koord,
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
    if (document.getElementsByClassName("searchlist-item-wrapper")) {
      // nedoverpil
      if (e.keyCode === 40) {
        if (index < listItems.length - 1) {
          document
            .getElementsByClassName("searchlist-item-wrapper")
            [index + 1].focus();
        }
      }
      // oppoverpil
      if (e.keyCode === 38) {
        let nextindex = index - 1;
        if (nextindex < 0) {
          document.getElementById("searchfield").focus();
        } else {
          document
            .getElementsByClassName("searchlist-item-wrapper")
            [index - 1].focus();
        }
      }
    }
  };

  const onActivate = (item, trefftype, itemtype) => {
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
      handleGeoSelection(item, trefftype, itemtype);
    }
  };

  return (
    <>
      {searchResultPage && (
        <>
          <div className="valgtLag">
            <button
              className="listheadingbutton all-results"
              onClick={() => {
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
                  // Layers
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
                  <div className="search-tab-content">
                    <span className="search-tab-title">Kartlag</span>
                    <span className="search-tab-number">
                      {number_layers ? `(${number_layers})` : "(0)"}
                    </span>
                  </div>
                </Button>

                <Button
                  // Coordinates
                  id={
                    resultType === "coordinates"
                      ? "filter-search-button-selected"
                      : "filter-search-button"
                  }
                  color="primary"
                  onClick={() => {
                    setResultType("coordinates");
                    setPageNumber(1);
                  }}
                >
                  <div className="search-tab-content">
                    <span className="search-tab-title">Punkt</span>
                    <span className="search-tab-number">
                      {number_coord ? `(${number_coord})` : "(0)"}
                    </span>
                  </div>
                </Button>

                <Button
                  // Places
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
                  <div className="search-tab-content">
                    <span className="search-tab-title">Stedsnavn</span>
                    <span className="search-tab-number">
                      {places ? `(${places})` : "(0)"}
                    </span>
                  </div>
                </Button>

                <Button
                  // Address
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
                  <div className="search-tab-content">
                    <span className="search-tab-title">Adresse</span>
                    <span className="search-tab-number">
                      {number_addresses ? `(${number_addresses})` : "(0)"}
                    </span>
                  </div>
                </Button>

                <Button
                  // Properties
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
                  <div className="search-tab-content">
                    <span className="search-tab-title">Eiendom</span>
                    <span className="search-tab-number">
                      {properties ? `(${properties})` : "(0)"}
                    </span>
                  </div>
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
                //itemname = item.stedsnavn || "finner ikke stedsnavn";
                itemname = item.skrivemåte || "finner ikke stedsnavn";
                //itemtype = item.navnetype || "";
                itemtype = item.trefftype || "";
                item.kommunenavn =
                  item && item.kommunenavn ? item.kommuner[0].kommunenavn : "";
                //itemnr = item.ssrId || "";
                itemnr = item.stedsnummer || "";
              } else if (item.trefftype === "Punkt") {
                itemname = item.name;
                itemnr = item.projection;
              }

              return (
                <li id={index} key={index} className="searchbar_item">
                  <div
                    className="searchlist-item-wrapper"
                    role="button"
                    tabIndex="0"
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        onActivate(item, trefftype, itemtype);
                      } else {
                        movefocus(e, index);
                      }
                    }}
                    onClick={() => {
                      onActivate(item, trefftype, itemtype);
                    }}
                  >
                    <span className="itemname">{itemname} </span>
                    <span className="itemtype">
                      {trefftype}
                      {trefftype === "Stedsnavn" ? (
                        itemtype === "Kommune" || itemtype === "Fylke" ? (
                          <>{`, ${itemtype}`} </>
                        ) : (
                          <>{`, ${itemtype} i ${item.kommunenavn}`} </>
                        )
                      ) : trefftype === "Punkt" ? (
                        <>{"koordinater"}</>
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
                      trefftype === "Underlag" ||
                      trefftype === "Punkt" ? (
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
