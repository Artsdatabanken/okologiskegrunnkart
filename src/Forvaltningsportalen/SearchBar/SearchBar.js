import React from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";
import { IconButton, TextField } from "@material-ui/core";
import {
  ArrowBack,
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import { withRouter } from "react-router-dom";

class SearchBar extends React.Component {
  state = {
    treffliste_lokalt: null,
    treffliste_sted: null,
    fylker: null,
    kommuner: null,
    isSearching: false,
    treffliste_knrgnrbnr: null,
    treffliste_knr: null,
    treffliste_gnr: null,
    treffliste_bnr: null,
    searchTerm: null,
    showHelpModal: false
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste_sted: null,
      treffliste_lokalt: null,
      isSearching: false,
      treffliste_knrgnrbnr: null,
      treffliste_knr: null,
      treffliste_gnr: null,
      treffliste_bnr: null
    });
  };

  handleSearchButton = () => {
    this.handleSearchBar(document.getElementById("searchfield").value, true);
    document.getElementById("searchfield").value = "";
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ searchTerm: "" });
    }
  }

  handleSearchBar = (searchTerm, resultpage) => {
    if (!searchTerm) {
      this.setState({
        isSearching: false,
        searchTerm: null
      });
      return null;
    }
    let countermax = 50;
    if (resultpage) {
      this.props.onSelectSearchResult(true);
      this.setState({
        isSearching: false,
        searchTerm: null
      });
      countermax = 15;
    } else {
      this.setState({
        isSearching: true,
        searchTerm: searchTerm
      });
    }
    searchTerm = searchTerm.toLowerCase();
    let counter = 0;
    let treffliste_lokalt = [];
    let lag = this.props.kartlag;

    function searchForKey(criteria, counter, lag, searchTerm) {
      let treffliste_lokalt = [];
      for (let id in lag) {
        if (counter >= countermax) {
          break;
        } else {
          if (lag[id][criteria]) {
            let lagstring = lag[id][criteria];
            if (criteria === "tags") {
              lagstring = JSON.stringify(lag[id][criteria]);
            }
            lagstring = lagstring.toLowerCase();
            if (lagstring.indexOf(searchTerm) !== -1) {
              let element = lag[id];
              treffliste_lokalt.push(element);
              counter += 1;
            }
          }
        }
      }
      console.log({ treffliste_lokalt });
      return [treffliste_lokalt, counter];
    }

    if (searchTerm && searchTerm.length > 0) {
      let title_search = searchForKey("tittel", counter, lag, searchTerm);
      treffliste_lokalt = title_search[0];
      counter = title_search[1];
      let owner_search = searchForKey("dataeier", counter, lag, searchTerm);
      treffliste_lokalt = treffliste_lokalt.concat(owner_search[0]);
      counter += owner_search[1];
      let theme_search = searchForKey("tema", counter, lag, searchTerm);
      treffliste_lokalt = treffliste_lokalt.concat(theme_search[0]);
      counter += theme_search[1];
      let tags_search = searchForKey("tags", counter, lag, searchTerm);
      treffliste_lokalt = treffliste_lokalt.concat(tags_search[0]);
      counter += tags_search[1];
    }

    if (resultpage) {
      this.props.setKartlagSearchResults(treffliste_lokalt);
    } else {
      this.setState({
        treffliste_lokalt: treffliste_lokalt
      });
    }

    /* Kommunenummer, gårdsnummer og bruksnummer */
    let knr = null;
    let gnr = null;
    let bnr = null;

    if (
      searchTerm.indexOf("knr") !== -1 ||
      searchTerm.indexOf("bnr") !== -1 ||
      searchTerm.indexOf("gnr") !== -1
    ) {
      // Hvis alt er skrevet på ønsket format = direkte oppslag
      console.log("direkte oppslag knr-gnr-bnr");

      let list = searchTerm.split(",");
      for (let i in list) {
        if (list[i].indexOf("knr") !== -1) {
          knr = list[i].split("=")[1];
        } else if (list[i].indexOf("gnr") !== -1) {
          gnr = list[i].split("=")[1];
        } else if (list[i].indexOf("bnr") !== -1) {
          bnr = list[i].split("=")[1];
        }
      }

      backend.hentKnrGnrBnr(knr, gnr, bnr).then(resultat => {
        this.setState({
          treffliste_knrgnrbnr: resultat,
          treffliste_knr: null,
          treffliste_gnr: null,
          treffliste_bnr: null
        });
      });
    } else if (!isNaN(searchTerm)) {
      // Hvis det sendes inn utelukkende ett nummer, slå opp i alle hver for seg
      backend.hentKommune(searchTerm).then(resultat => {
        // henter kommune fra ssr
        if (resultat && resultat["stedsnavn"]) {
          resultat["stedsnavn"]["knr"] = searchTerm;
        }
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_knr: resultat
        });
      });
      backend.hentKnrGnrBnr(null, searchTerm, null).then(resultat => {
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_gnr: resultat
        });
      });
      backend.hentKnrGnrBnr(null, null, searchTerm).then(resultat => {
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_bnr: resultat
        });
      });
    } else {
      // Hvis det som sendes inn er rene nummer separert med mellomrom, slash eller bindestrek

      let numbercheck = searchTerm.replace(/ /g, "-");
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
        backend.hentKnrGnrBnr(knr, gnr, bnr).then(resultat => {
          this.setState({
            treffliste_knrgnrbnr: resultat,
            treffliste_knr: null,
            treffliste_gnr: null,
            treffliste_bnr: null
          });
        });
      } else {
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_knr: null,
          treffliste_gnr: null,
          treffliste_bnr: null
        });
      }
    }

    backend.hentSteder(searchTerm).then(resultat => {
      if (!resultat) return;
      let max_items = 5;
      if (resultpage) {
        max_items = 50;
      }
      let entries = resultat.stedsnavn;
      const resultatliste = {};
      // If only one entrie is returned from backend, this is
      // returned as an object, not as array of objects.
      // In that case, convert to array
      if (!Array.isArray(entries)) {
        entries = [].push(entries);
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
      if (resultpage) {
        this.props.setGeoSearchResults(Object.values(prioritertliste));
      } else {
        this.setState({
          treffliste_sted: Object.values(prioritertliste)
        });
      }
    });
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.handleRemoveTreffliste();
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    console.log({ term: this.state.searchTerm });
    const pathname = this.props.location.pathname;
    return (
      <div className="searchbar_container" ref={this.setWrapperRef}>
        <div className="searchbar">
          <IconButton
            onClick={() => {
              if (pathname === "/") this.props.history.push("/hjelp");
              else this.props.history.goBack();
            }}
          >
            {pathname != "/" ? <ArrowBack /> : <MenuIcon />}
          </IconButton>
          <TextField
            placeholder={true ? pathname : "Søk i økologisk grunnkart..."}
            _defaultValue={pathname}
            value={this.state.searchTerm}
            autoComplete={false}
            style={{ top: 8, _display: "flex" }}
            InputProps={{ disableUnderline: true }}
            id="searchfield"
            type="text"
            onFocus={e => this.handleSearchBar(e.target.value)}
            onChange={e => this.handleSearchBar(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.handleSearchButton();
              }
            }}
            onKeyDown={e => {
              if (e.key === "ArrowDown") {
                if (document.getElementsByClassName("searchbar_item")) {
                  if (e.keyCode === 40) {
                    if (document.getElementsByClassName("searchbar_item")[0]) {
                      document
                        .getElementsByClassName("searchbar_item")[0]
                        .focus();
                    } else {
                      console.log("nothing to scroll to");
                    }
                  }
                } else {
                  console.log("nothing to see here");
                }
              }
            }}
          />

          <IconButton
            onClick={() => {
              if (this.state.isSearching) {
                this.handleRemoveTreffliste();
                this.handleSearchBar(null);
                document.getElementById("searchfield").value = "";
              } else this.handleSearchButton();
            }}
            style={{ position: "absolute", right: 8, top: 0 }}
          >
            {this.state.isSearching ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </div>
        {(this.state.isSearching || this.props.searchResultPage) && (
          <TreffListe
            onSelectSearchResult={this.props.onSelectSearchResult}
            searchResultPage={this.props.searchResultPage}
            searchTerm={this.state.searchTerm}
            handleSearchBar={this.handleSearchBar}
            onSearchButton={this.handleSearchButton}
            treffliste={this.state.treffliste}
            treffliste_lokalt={this.state.treffliste_lokalt}
            treffliste_sted={this.state.treffliste_sted}
            treffliste_knr={this.state.treffliste_knr}
            treffliste_gnr={this.state.treffliste_gnr}
            treffliste_bnr={this.state.treffliste_bnr}
            treffliste_knrgnrbnr={this.state.treffliste_knrgnrbnr}
            handleGeoSelection={this.props.handleGeoSelection}
            handleRemoveTreffliste={this.handleRemoveTreffliste}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SearchBar);
