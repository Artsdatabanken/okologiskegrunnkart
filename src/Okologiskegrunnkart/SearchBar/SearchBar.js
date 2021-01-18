import React, { useRef, useState, useEffect, useCallback } from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";
import { Menu as MenuIcon } from "@material-ui/icons";
import DrawerMenu from "./DrawerMenu";
import useDebounce from "./UseDebounce";

const SearchBar = ({
  onSelectSearchResult,
  searchResultPage,
  handleGeoSelection,
  kartlag,
  addValgtLag,
  removeValgtLag,
  toggleEditLayers,
  showFavoriteLayers,
  toggleShowFavoriteLayers,
  isMobile,
  windowHeight,
  showSideBar,
  handleSideBar,
  handleInfobox,
  handleFullscreenInfobox,
  loadingFeatures,
  handleAboutModal,
  uploadPolygonFile,
  getSavedPolygons
}) => {
  const [treffliste_lag, set_treffliste_lag] = useState(null);
  const [treffliste_underlag, set_treffliste_underlag] = useState(null);
  const [treffliste_sted, set_treffliste_sted] = useState(null);
  const [isSearching, set_isSearching] = useState(false);
  const [treffliste_knrgnrbnr, set_treffliste_knrgnrbnr] = useState(null);
  const [treffliste_kommune, set_treffliste_kommune] = useState(null);
  const [treffliste_knr, set_treffliste_knr] = useState(null);
  const [treffliste_gnr, set_treffliste_gnr] = useState(null);
  const [treffliste_bnr, set_treffliste_bnr] = useState(null);
  const [treffliste_adresse, set_treffliste_adresse] = useState(null);
  const [treffliste_koord, set_treffliste_koord] = useState(null);
  const [searchTerm, set_searchTerm] = useState(null);
  const [countermax, set_countermax] = useState(12);
  const [anchorEl] = useState(null);
  const [number_places, set_number_places] = useState(0);
  const [number_knrgnrbnr, set_number_knrgnrbnr] = useState(0);
  const [number_kommune, set_number_kommune] = useState(0);
  const [number_knr, set_number_knr] = useState(0);
  const [number_gnr, set_number_gnr] = useState(0);
  const [number_bnr, set_number_bnr] = useState(0);
  const [number_addresses, set_number_addresses] = useState(0);
  const [number_layers, set_number_layers] = useState(0);
  const [number_coord, set_number_coord] = useState(0);
  const [total_number, set_total_number] = useState(0);
  const [openDrawer, set_openDrawer] = useState(false);
  const [pageLength, setPageLength] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleRemoveTreffliste = () => {
    set_treffliste_sted(null);
    set_treffliste_lag(null);
    set_treffliste_underlag(null);
    set_isSearching(false);
    set_treffliste_knrgnrbnr(null);
    set_treffliste_kommune(null);
    set_treffliste_knr(null);
    set_treffliste_gnr(null);
    set_treffliste_bnr(null);
    set_treffliste_adresse(null);
    set_treffliste_koord(null);
    set_number_places(0);
    set_number_knrgnrbnr(0);
    set_number_kommune(0);
    set_number_knr(0);
    set_number_gnr(0);
    set_number_bnr(0);
    set_number_addresses(0);
    set_number_layers(0);
    set_number_coord(0);
    set_searchTerm(null);
    set_countermax(12);
    set_searchTerm(null);
  };

  const searchInLayer = (criteria, term, layer) => {
    if (layer[criteria]) {
      let lagstring = layer[criteria];
      if (criteria === "tags") {
        lagstring = JSON.stringify(layer[criteria]);
      }
      lagstring = lagstring.toLowerCase();
      // Try with complete string
      if (lagstring.indexOf(term) !== -1) {
        return true;
      }
      // Break string only for title
      if (criteria === "tittel") {
        const termList = term.split(" ");
        let match = true;
        for (const element of termList) {
          if (lagstring.indexOf(element) === -1) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
    return false;
  };

  const searchForKey = useCallback(
    (criteria, counter, term) => {
      const trefflisteLag = [];
      const trefflisteUnderlag = [];
      const layers = kartlag;
      // Search in layers
      for (let i in layers) {
        if (counter >= countermax) {
          break;
        } else {
          const layer = layers[i];
          const found = searchInLayer(criteria, term, layer);
          if (found) {
            trefflisteLag.push(layer);
            counter += 1;
          }
          // Search in sublayers
          const sublayers = layer.underlag;
          if (!sublayers) continue;
          for (let j in sublayers) {
            if (counter >= countermax) {
              break;
            } else if (layer.aggregatedwmslayer === sublayers[j].wmslayer) {
              break;
            } else {
              const found = searchInLayer(criteria, term, sublayers[j]);
              if (found) {
                const sublayer = {
                  ...sublayers[j],
                  id: j,
                  parentId: i,
                  tema: layer.tema
                };
                trefflisteUnderlag.push(sublayer);
                counter += 1;
              }
            }
          }
        }
      }
      return { trefflisteLag, trefflisteUnderlag, counter };
    },
    [countermax, kartlag]
  );

  const handleSearchButton = () => {
    onSelectSearchResult(true);
    set_isSearching(false);
    set_countermax(1000);
  };

  const fetchSearchLayers = useCallback(
    term => {
      let counter = 0;
      let trefflisteLag = [];
      let trefflisteUnderlag = [];

      if (term && term.length > 0) {
        // Search in title
        let title_search = searchForKey("tittel", counter, term);
        trefflisteLag = title_search.trefflisteLag;
        trefflisteUnderlag = title_search.trefflisteUnderlag;
        counter = title_search.counter;
        // Search in data owner
        let owner_search = searchForKey("dataeier", counter, term);
        trefflisteLag = trefflisteLag.concat(owner_search.trefflisteLag);
        trefflisteUnderlag = trefflisteUnderlag.concat(
          owner_search.trefflisteUnderlag
        );
        counter += owner_search.counter;
        // Search in tema
        let theme_search = searchForKey("tema", counter, term);
        trefflisteLag = trefflisteLag.concat(theme_search.trefflisteLag);
        trefflisteUnderlag = trefflisteUnderlag.concat(
          theme_search.trefflisteUnderlag
        );
        counter += theme_search.counter;
        // Search in tags
        let tags_search = searchForKey("tags", counter, term);
        trefflisteLag = trefflisteLag.concat(tags_search.trefflisteLag);
        trefflisteUnderlag = trefflisteUnderlag.concat(
          tags_search.trefflisteUnderlag
        );
        counter += tags_search.counter;
      }
      // Remove duplicates
      trefflisteLag = [...new Set(trefflisteLag)];
      trefflisteUnderlag = [...new Set(trefflisteUnderlag)];
      // Set results in state
      const numberLayers = trefflisteLag.length + trefflisteUnderlag.length;
      set_treffliste_lag(trefflisteLag);
      set_treffliste_underlag(trefflisteUnderlag);
      set_number_layers(numberLayers);
    },
    [searchForKey]
  );

  const fetchSearchProperties = useCallback(
    (term, page = 0, numberPerPage = 20, pageDistribution = "") => {
      /* Kommunenummer, gårdsnummer og bruksnummer */
      if (page === 0) {
        set_number_knrgnrbnr(0);
        set_number_knr(0);
        set_number_gnr(0);
        set_number_bnr(0);
      }
      let knr = null;
      let gnr = null;
      let bnr = null;

      if (!isNaN(term)) {
        // Hvis det sendes inn utelukkende ett nummer, slå opp i alle hver for seg
        if (page === 0) {
          // Only if there is no page, search for kommune
          backend.hentKommune(term).then(resultat => {
            // henter kommune fra ssr
            if (resultat && resultat["stedsnavn"]) {
              resultat["stedsnavn"]["knr"] = term;
            }
            const treffliste_kommune =
              resultat && resultat.stedsnavn ? resultat.stedsnavn : [];
            const numberKommune = Array.isArray(treffliste_kommune)
              ? treffliste_kommune.length
              : 1;
            set_treffliste_kommune(resultat);
            set_treffliste_knrgnrbnr(null);
            set_number_kommune(numberKommune);
            set_number_knrgnrbnr(0);
          });
        } else {
          set_treffliste_kommune(null);
        }

        // If there is page, as specified by "pageDistribution" with format
        // "{ knr: { page: 2, number: 10}, gnr: {...}, bnr: {...} }"
        // which specifies page and number of items per page for each.
        // If not required, the page and number are null
        let page_knr = page;
        let numberPerPage_knr = numberPerPage;
        let page_gnr = page;
        let numberPerPage_gnr = numberPerPage;
        let page_bnr = page;
        let numberPerPage_bnr = numberPerPage;
        if (
          page !== 0 &&
          pageDistribution &&
          JSON.stringify(pageDistribution) !== "{}"
        ) {
          page_knr = pageDistribution.knr.page;
          numberPerPage_knr = pageDistribution.knr.number;
          page_gnr = pageDistribution.gnr.page;
          numberPerPage_gnr = pageDistribution.gnr.number;
          page_bnr = pageDistribution.bnr.page;
          numberPerPage_bnr = pageDistribution.bnr.number;
        }

        if (page_knr !== null) {
          backend
            .hentKnrGnrBnr(term, null, null, page_knr, numberPerPage_knr)
            .then(resultat => {
              set_treffliste_knr(resultat);
              set_treffliste_knrgnrbnr(null);
              set_number_knrgnrbnr(0);
              if (page === 0) {
                const numberKnr =
                  resultat &&
                  resultat.metadata &&
                  resultat.metadata.totaltAntallTreff
                    ? resultat.metadata.totaltAntallTreff
                    : 0;
                set_number_knr(numberKnr);
              }
            });
        } else {
          set_treffliste_knr(null);
        }

        if (page_gnr !== null) {
          backend
            .hentKnrGnrBnr(null, term, null, page_gnr, numberPerPage_gnr)
            .then(resultat => {
              set_treffliste_gnr(resultat);
              set_treffliste_knrgnrbnr(null);
              set_number_knrgnrbnr(0);
              if (page === 0) {
                const numberGnr =
                  resultat &&
                  resultat.metadata &&
                  resultat.metadata.totaltAntallTreff
                    ? resultat.metadata.totaltAntallTreff
                    : 0;
                set_number_gnr(numberGnr);
              }
            });
        } else {
          set_treffliste_gnr(null);
        }

        if (page_bnr !== null) {
          backend
            .hentKnrGnrBnr(null, null, term, page_bnr, numberPerPage_bnr)
            .then(resultat => {
              set_treffliste_bnr(resultat);
              set_treffliste_knrgnrbnr(null);
              set_number_knrgnrbnr(0);
              if (page === 0) {
                const numberBnr =
                  resultat &&
                  resultat.metadata &&
                  resultat.metadata.totaltAntallTreff
                    ? resultat.metadata.totaltAntallTreff
                    : 0;
                set_number_bnr(numberBnr);
              }
            });
        } else {
          set_treffliste_bnr(null);
        }
      } else {
        // Hvis det som sendes inn er rene nummer separert med mellomrom, slash eller bindestrek
        let numbercheck = term.replace(/ /g, "-");
        numbercheck = numbercheck.replace(/\//g, "-");
        numbercheck = numbercheck.replace(/;/g, "-");
        numbercheck = numbercheck.replace(/,/g, "-");
        let checknr = numbercheck.replace(/-/g, "");
        if (!isNaN(checknr)) {
          let list = numbercheck.split("-");
          if (list[0]) {
            knr = list[0];
          }
          if (list[1]) {
            gnr = list[1];
          }
          if (list[2]) {
            bnr = list[2];
          }
          backend
            .hentKnrGnrBnr(knr, gnr, bnr, page, numberPerPage)
            .then(resultat => {
              const numberKnrgnrbnr =
                resultat &&
                resultat.metadata &&
                resultat.metadata.totaltAntallTreff
                  ? resultat.metadata.totaltAntallTreff
                  : 0;
              set_treffliste_knrgnrbnr(resultat);
              set_treffliste_knr(null);
              set_treffliste_gnr(null);
              set_treffliste_bnr(null);
              set_number_knrgnrbnr(numberKnrgnrbnr);
              set_number_knr(0);
              set_number_gnr(0);
              set_number_bnr(0);
            });
        } else {
          set_treffliste_knrgnrbnr(null);
          set_treffliste_knr(null);
          set_treffliste_gnr(null);
          set_treffliste_bnr(null);
          set_number_knrgnrbnr(0);
          set_number_knr(0);
          set_number_gnr(0);
          set_number_bnr(0);
        }
      }
    },
    []
  );

  const fetchSearchPlaces = useCallback(
    (term, page = 0, numberPerPage = 20) => {
      backend.hentSteder(term, page, numberPerPage).then(resultat => {
        let max_items = 20;
        let entries = resultat ? resultat.stedsnavn : null;
        const resultatliste = {};
        // If only one entry is returned from backend, this is
        // returned as an object, not as array of objects.
        // In that case, convert to array
        if (!entries) {
          entries = [];
        } else if (!Array.isArray(entries) && entries.constructor === Object) {
          const object = { ...entries };
          entries = [];
          entries.push(object);
        }
        for (const i in entries) {
          const id = entries[i].ssrId;
          if (resultatliste[id]) {
            const gammel = resultatliste[id];
            const ny = entries[i];
            const variasjon = {};
            for (const j in gammel) {
              if (gammel[j] !== ny[j]) {
                if (j !== "variasjon") {
                  variasjon[j] = [gammel[j], ny[j]];
                }
              }
            }
            resultatliste[id].variasjon = variasjon;
          } else {
            if (Object.keys(resultatliste).length < max_items) {
              resultatliste[id] = entries[i];
              if (resultatliste[id]) {
                resultatliste[id].ssrpri = i || 100;
              }
            }
          }
        }
        const prioritertliste = {};
        for (let i in resultatliste) {
          const element = resultatliste[i];
          prioritertliste[element.ssrpri] = element;
        }
        set_treffliste_sted(Object.values(prioritertliste));
        if (page === 0) {
          const numberPlaces =
            resultat && resultat.totaltAntallTreff
              ? resultat.totaltAntallTreff
              : 0;
          set_number_places(numberPlaces);
        }
      });
    },
    []
  );

  const fetchSearchAddresses = useCallback(
    (term, page = 0, numberPerPage = 20) => {
      let address = [];
      // Use strict search approach
      backend.hentAdresse(term, page, numberPerPage).then(resultat => {
        let entries = resultat ? resultat.adresser : null;
        // If only one entry is returned from backend, this is
        // returned as an object, not as array of objects.
        // In that case, convert to array
        if (!entries) {
          entries = [];
        } else if (!Array.isArray(entries) && entries.constructor === Object) {
          const object = { ...entries };
          entries = [];
          entries.push(object);
        }
        if (entries.length > 0) {
          address = entries;
        }

        // Use less strict search approach if no results
        if (address.length === 0) {
          backend
            .hentAdresse(term + "*", page, numberPerPage)
            .then(resultat => {
              entries = resultat ? resultat.adresser : null;
              // If only one entry is returned from backend, this is
              // returned as an object, not as array of objects.
              // In that case, convert to array
              if (!entries) {
                entries = [];
              } else if (
                !Array.isArray(entries) &&
                entries.constructor === Object
              ) {
                const object = { ...entries };
                entries = [];
                entries.push(object);
              }
              if (entries.length > 0) {
                address = entries;
              }
              set_treffliste_adresse(address);
              if (page === 0) {
                const numberAddresses =
                  resultat &&
                  resultat.metadata &&
                  resultat.metadata.totaltAntallTreff
                    ? resultat.metadata.totaltAntallTreff
                    : 0;
                set_number_addresses(numberAddresses);
              }
            });
        } else {
          set_treffliste_adresse(address);
          if (page === 0) {
            const numberAddresses =
              resultat &&
              resultat.metadata &&
              resultat.metadata.totaltAntallTreff
                ? resultat.metadata.totaltAntallTreff
                : 0;
            set_number_addresses(numberAddresses);
          }
        }
      });
    },
    []
  );

  const fetchSearchCoordinates = useCallback(term => {
    term = term.replace(/:/g, " ").replace(/;/g, " ");
    term = term.replace(/\//g, " ");
    // Replace komma with point to get numbers
    term = term.replace(/,/g, ".");
    term = term.trim();
    // Check that we have 2 items
    let terms = term.split(" ");
    if (terms.length !== 2) {
      set_treffliste_koord([]);
      set_number_coord(0);
      return;
    }
    // Check if the 2 items are numbers
    const coord1 = parseFloat(terms[0]);
    const coord2 = parseFloat(terms[1]);
    if (!coord1 || !coord2) {
      set_treffliste_koord([]);
      set_number_coord(0);
      return;
    }
    // Check that the 2 numbers are between -90/90
    if (coord1 < -90 || coord1 > 90 || coord2 < -90 || coord2 > 90) {
      set_treffliste_koord([]);
      set_number_coord(0);
      return;
    }
    // Return combinations of lat/lng
    const numberDecimalsCoord1 = countDecimals(coord1);
    const numberDecimalsCoord2 = countDecimals(coord2);
    const maxDec = Math.max(numberDecimalsCoord1, numberDecimalsCoord2);
    const textCoord1 = maxDec < 2 ? coord1.toFixed(2) : coord1.toFixed(maxDec);
    const textCoord2 = maxDec < 2 ? coord2.toFixed(2) : coord2.toFixed(maxDec);
    const koord = [];
    // BBOX [lat, lng]
    const bbox = [[50.958427, -23.90625], [83.829945, 36.035156]];
    const minLat = bbox[0][0];
    const maxLat = bbox[1][0];
    const minLng = bbox[0][1];
    const maxLng = bbox[1][1];
    if (
      coord1 >= minLat &&
      coord1 <= maxLat &&
      coord2 >= minLng &&
      coord2 <= maxLng
    ) {
      const point = {
        id: 1,
        name: `${textCoord1}° N / ${textCoord2}° Ø`,
        representasjonspunkt: { lat: coord1, lon: coord2 },
        projection: "EPSG:4326"
      };
      koord.push(point);
    }
    if (
      coord2 >= minLat &&
      coord2 <= maxLat &&
      coord1 >= minLng &&
      coord1 <= maxLng
    ) {
      const point = {
        id: 2,
        name: `${textCoord2}° N / ${textCoord1}° Ø`,
        representasjonspunkt: { lat: coord2, lon: coord1 },
        projection: "EPSG:4326"
      };
      koord.push(point);
    }
    // const koord = [point1, point2];
    set_treffliste_koord(koord);
    set_number_coord(koord.length);
  }, []);

  const handleSearchBar = useCallback(
    (
      term,
      page = 0,
      numberPerPage = 20,
      resultType = "all",
      pageDistribution = ""
    ) => {
      let currentTerm = term ? term.trim() : null;
      if (!currentTerm) {
        set_searchTerm(null);
        set_isSearching(false);
        return null;
      }

      // Remove weird symbols from search
      currentTerm = currentTerm.replace(/-/g, " ").replace(/&/g, " ");
      currentTerm = currentTerm.replace(/\?/g, " ").replace(/!/g, " ");
      currentTerm = currentTerm.replace(/"/g, " ").replace(/'/g, " ");
      currentTerm = currentTerm.replace(/\+/g, " ").replace(/\*/g, " ");
      currentTerm = currentTerm.replace(/\(/g, " ").replace(/\)/g, " ");
      currentTerm = currentTerm.replace(/\{/g, " ").replace(/\}/g, " ");
      currentTerm = currentTerm.replace(/\[/g, " ").replace(/\]/g, " ");
      currentTerm = currentTerm.replace(/  +/g, " ").trim();
      currentTerm = currentTerm.toLowerCase();

      if (searchResultPage) {
        set_isSearching(false);
        // set_countermax(15);
      } else {
        set_isSearching(true);
        // set_countermax(50);
      }

      if (resultType === "all") {
        fetchSearchLayers(currentTerm);
        fetchSearchCoordinates(currentTerm);
        fetchSearchProperties(currentTerm, page, numberPerPage);
        fetchSearchPlaces(currentTerm, page, numberPerPage);
        fetchSearchAddresses(currentTerm, page, numberPerPage);
      } else if (resultType === "layers") {
        fetchSearchLayers(currentTerm);
      } else if (resultType === "properties") {
        fetchSearchProperties(
          currentTerm,
          page,
          numberPerPage,
          pageDistribution
        );
      } else if (resultType === "places") {
        fetchSearchPlaces(currentTerm, page, numberPerPage);
      } else if (resultType === "addresses") {
        fetchSearchAddresses(currentTerm, page, numberPerPage);
      } else if (resultType === "coordinates") {
        fetchSearchCoordinates(currentTerm);
      }
    },
    [
      searchResultPage,
      fetchSearchLayers,
      fetchSearchCoordinates,
      fetchSearchProperties,
      fetchSearchPlaces,
      fetchSearchAddresses
    ]
  );

  const countDecimals = value => {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  };

  const handleOpenDrawer = () => {
    set_openDrawer(true);
  };

  const handleCloseDrawer = () => {
    set_openDrawer(false);
  };

  const handleSearchKeyDown = e => {
    if (e.keyCode === 27 && !searchResultPage) {
      handleRemoveTreffliste();
      handleSearchBar(null);
      document.getElementById("searchfield").value = "";
      document.getElementById("searchfield").focus();
      return;
    }
    if (e.keyCode === 27 && searchResultPage) {
      document.getElementById("search-button").focus();
      return;
    }
    const searchBar = document.getElementsByClassName(
      "searchlist-item-wrapper"
    );
    const length = searchBar.length;
    if (e.key === "ArrowDown" && e.keyCode === 40 && searchBar && length > 0) {
      searchBar[0].focus();
    }
  };

  const getSearchbarContainerClass = () => {
    if (isMobile && searchResultPage) {
      return "searchbar_container_results";
    } else if (!isMobile && !searchResultPage && !showSideBar) {
      return "searchbar_container floating";
    } else {
      return "searchbar_container";
    }
  };

  const getSearchbarClass = () => {
    if (!isMobile && !searchResultPage && !showSideBar) {
      return "searchbar floating";
    } else {
      return "searchbar";
    }
  };

  const getHelpButtonClass = () => {
    if (!isMobile && !searchResultPage && !showSideBar) {
      return "help_button floating";
    } else {
      return "help_button";
    }
  };

  // ---------- USE EFFECT --------- //
  function useClickOutside(ref, resultPage) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (!resultPage && ref.current && !ref.current.contains(event.target)) {
          handleRemoveTreffliste();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, resultPage]);
  }

  // UseEffect function will only execute if 'debouncedSearchTerm' changes.
  // Due to 'useDebounce' hook it will only change if the original
  // value (searchTerm) hasn't changed for more than 500ms.
  useEffect(() => {
    if (searchTerm !== null || debouncedSearchTerm !== null) {
      handleSearchBar(debouncedSearchTerm, 0, pageLength);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (searchTerm !== null && debouncedSearchTerm !== null) {
      handleSearchBar(debouncedSearchTerm, 0, pageLength);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLength]);

  // Update layers if countermax changes
  useEffect(() => {
    // Remove weird symbols from search
    let currentTerm = debouncedSearchTerm;
    if (!currentTerm) return;
    currentTerm = currentTerm.replace(/-/g, " ").replace(/&/g, " ");
    currentTerm = currentTerm.replace(/\?/g, " ").replace(/!/g, " ");
    currentTerm = currentTerm.replace(/"/g, " ").replace(/'/g, " ");
    currentTerm = currentTerm.replace(/\+/g, " ").replace(/\*/g, " ");
    currentTerm = currentTerm.replace(/\(/g, " ").replace(/\)/g, " ");
    currentTerm = currentTerm.replace(/\{/g, " ").replace(/\}/g, " ");
    currentTerm = currentTerm.replace(/\[/g, " ").replace(/\]/g, " ");
    currentTerm = currentTerm.replace(/  +/g, " ").trim();
    currentTerm = currentTerm.toLowerCase();
    fetchSearchLayers(currentTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countermax]);

  // Get page length based on window height
  useEffect(() => {
    const min_list_length = 1;
    let max_list_length = isMobile ? 8 : 10;

    if (!searchResultPage) {
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
  }, [isMobile, searchResultPage, windowHeight]);

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, searchResultPage);

  // Count total number of results
  useEffect(() => {
    const total =
      number_places +
      number_knrgnrbnr +
      number_kommune +
      number_knr +
      number_gnr +
      number_bnr +
      number_addresses +
      number_layers +
      number_coord;
    set_total_number(total);
  }, [
    number_places,
    number_knrgnrbnr,
    number_kommune,
    number_knr,
    number_gnr,
    number_bnr,
    number_addresses,
    number_layers,
    number_coord
  ]);

  return (
    <>
      <div className={getSearchbarContainerClass()} ref={wrapperRef}>
        <div className={getSearchbarClass()}>
          <input
            className="searchbarfield"
            id="searchfield"
            type="text"
            autoComplete="off"
            placeholder="Søk etter kartlag eller område..."
            value={searchTerm || ""}
            onFocus={e => handleSearchBar(e.target.value, 0, pageLength)}
            onChange={e => {
              set_searchTerm(e.target.value);
            }}
            onKeyDown={e => {
              handleSearchKeyDown(e);
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                handleSearchButton();
                if (
                  !isMobile &&
                  !showSideBar &&
                  document.getElementById("searchfield").value.length > 0
                ) {
                  handleSideBar(true);
                }
              }
            }}
          />

          {isSearching && (
            <button
              className="x"
              onClick={() => {
                handleRemoveTreffliste();
                // handleSearchBar(null);
                document.getElementById("searchfield").value = "";
              }}
            >
              <div className="x-button-div">X</div>
            </button>
          )}
          <button
            id="search-button"
            className="search-button"
            onClick={() => {
              handleSearchButton();
              if (
                !isMobile &&
                !showSideBar &&
                document.getElementById("searchfield").value.length > 0
              ) {
                handleSideBar(true);
              }
            }}
          >
            Søk
          </button>
        </div>
        {((isSearching && total_number > 0) || searchResultPage) && (
          <TreffListe
            onSelectSearchResult={onSelectSearchResult}
            searchResultPage={searchResultPage}
            searchTerm={searchTerm}
            handleSearchBar={handleSearchBar}
            treffliste_lag={treffliste_lag}
            treffliste_underlag={treffliste_underlag}
            treffliste_sted={treffliste_sted}
            treffliste_kommune={treffliste_kommune}
            treffliste_knr={treffliste_knr}
            treffliste_gnr={treffliste_gnr}
            treffliste_bnr={treffliste_bnr}
            treffliste_adresse={treffliste_adresse}
            treffliste_knrgnrbnr={treffliste_knrgnrbnr}
            treffliste_koord={treffliste_koord}
            number_places={number_places}
            number_knrgnrbnr={number_knrgnrbnr}
            number_kommune={number_kommune}
            number_knr={number_knr}
            number_gnr={number_gnr}
            number_bnr={number_bnr}
            number_addresses={number_addresses}
            number_layers={number_layers}
            number_coord={number_coord}
            removeValgtLag={removeValgtLag}
            addValgtLag={addValgtLag}
            handleGeoSelection={handleGeoSelection}
            handleRemoveTreffliste={handleRemoveTreffliste}
            isMobile={isMobile}
            windowHeight={windowHeight}
            handleSideBar={handleSideBar}
            handleInfobox={handleInfobox}
            handleFullscreenInfobox={handleFullscreenInfobox}
          />
        )}

        <button
          className={getHelpButtonClass()}
          tabIndex="0"
          onClick={() => {
            if (!loadingFeatures) {
              handleOpenDrawer();
            }
          }}
        >
          <MenuIcon />
        </button>
        <DrawerMenu
          anchorEl={anchorEl}
          openDrawer={openDrawer}
          handleCloseDrawer={handleCloseDrawer}
          handleAboutModal={handleAboutModal}
          showFavoriteLayers={showFavoriteLayers}
          toggleShowFavoriteLayers={toggleShowFavoriteLayers}
          toggleEditLayers={toggleEditLayers}
          uploadPolygonFile={uploadPolygonFile}
          getSavedPolygons={getSavedPolygons}
        />
      </div>
    </>
  );
};

export default SearchBar;
