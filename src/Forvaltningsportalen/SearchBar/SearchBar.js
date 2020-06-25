import React from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";
import { Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
class SearchBar extends React.Component {
  state = {
    treffliste_lag: null,
    treffliste_sted: null,
    fylker: null,
    kommuner: null,
    isSearching: false,
    treffliste_knrgnrbnr: null,
    treffliste_knr: null,
    treffliste_gnr: null,
    treffliste_bnr: null,
    searchTerm: null,
    showHelpModal: false,
    manual: "",
    countermax: 50
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste_sted: null,
      treffliste_lag: null,
      isSearching: false,
      treffliste_knrgnrbnr: null,
      treffliste_knr: null,
      treffliste_gnr: null,
      treffliste_bnr: null
    });
  };

  // searchInLayer = (criteria, counter, searchTerm) => {
  //   let treffliste = [];
  //   const countermax = this.state.countermax;
  //   const lag = this.props.kartlag;
  //   for (let i in lag) {
  //     if (counter >= countermax) {
  //       break;
  //     } else {
  //       if (lag[i][criteria]) {
  //         let lagstring = lag[i][criteria];
  //         if (criteria === "tags") {
  //           lagstring = JSON.stringify(lag[i][criteria]);
  //         }
  //         lagstring = lagstring.toLowerCase();
  //         if (lagstring.indexOf(searchTerm) !== -1) {
  //           let element = lag[i];
  //           treffliste.push(element);
  //           counter += 1;
  //         }
  //       }
  //     }
  //   }
  //   return { treffliste, counter };
  // };

  searchInLayer = (criteria, searchTerm, layer) => {
    if (layer[criteria]) {
      let lagstring = layer[criteria];
      if (criteria === "tags") {
        lagstring = JSON.stringify(layer[criteria]);
      }
      lagstring = lagstring.toLowerCase();
      if (lagstring.indexOf(searchTerm) !== -1) {
        return true;
      }
    }
    return false;
  };

  searchForKey = (criteria, counter, searchTerm) => {
    const treffliste_lag = [];
    const treffliste_underlag = [];
    const countermax = this.state.countermax;
    const layers = this.props.kartlag;
    // Search in layers
    for (let i in layers) {
      if (counter >= countermax) {
        break;
      } else {
        const layer = layers[i];
        const found = this.searchInLayer(criteria, searchTerm, layer);
        if (found) {
          treffliste_lag.push(layer);
          counter += 1;
        }
        // Search in sublayers
        const sublayers = layer.underlag;
        if (!sublayers) continue;
        for (let j in sublayers) {
          if (counter >= countermax) {
            break;
          } else {
            const found = this.searchInLayer(
              criteria,
              searchTerm,
              sublayers[j]
            );
            if (found) {
              const sublayer = { ...sublayers[j], id: j, parentId: i };
              treffliste_underlag.push(sublayer);
              counter += 1;
            }
          }
        }
      }
    }
    return { treffliste_lag, treffliste_underlag, counter };
  };

  handleSearchButton = () => {
    this.handleSearchBar(document.getElementById("searchfield").value, true);
    document.getElementById("searchfield").value = "";
  };

  handleSearchBar = (searchTerm, resultpage) => {
    if (!searchTerm) {
      this.setState({
        isSearching: false,
        searchTerm: null
      });
      return null;
    }
    if (resultpage) {
      this.props.onSelectSearchResult(true);
      this.setState({
        isSearching: false,
        searchTerm: null,
        countermax: 15
      });
    } else {
      this.setState({
        isSearching: true,
        searchTerm: searchTerm,
        countermax: 50
      });
    }
    searchTerm = searchTerm.toLowerCase();
    let counter = 0;
    let treffliste_lag = [];
    let treffliste_underlag = [];

    if (searchTerm && searchTerm.length > 0) {
      // Search in title
      let title_search = this.searchForKey("tittel", counter, searchTerm);
      treffliste_lag = title_search.treffliste_lag;
      treffliste_underlag = title_search.treffliste_underlag;
      counter = title_search.counter;
      // Search in data owner
      let owner_search = this.searchForKey("dataeier", counter, searchTerm);
      treffliste_lag = treffliste_lag.concat(owner_search.treffliste_lag);
      treffliste_underlag = treffliste_underlag.concat(
        owner_search.treffliste_underlag
      );
      counter += owner_search.counter;
      // Search in tema
      let theme_search = this.searchForKey("tema", counter, searchTerm);
      treffliste_lag = treffliste_lag.concat(theme_search.treffliste_lag);
      treffliste_underlag = treffliste_underlag.concat(
        theme_search.treffliste_underlag
      );
      counter += theme_search.counter;
      // Search in tags
      let tags_search = this.searchForKey("tags", counter, searchTerm);
      treffliste_lag = treffliste_lag.concat(tags_search.treffliste_lag);
      treffliste_underlag = treffliste_underlag.concat(
        tags_search.treffliste_underlag
      );
      counter += tags_search.counter;
    }

    if (resultpage) {
      this.props.setKartlagSearchResults(treffliste_lag);
    } else {
      this.setState({
        treffliste_lag,
        treffliste_underlag
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

  openHelp = () => {
    // returnerer brukermanualen fra wiki
    backend.getUserManualWiki().then(manual => {
      this.setState({ showHelpModal: true, manual });
    });
  };

  closeHelpModal = () => {
    this.setState({ showHelpModal: false });
  };

  formattedManual = () => {
    if (!this.state.manual || this.state.manual === "") {
      return [];
    }
    const array = this.state.manual.split(/\r?\n/);
    const items = [];
    for (const [index, value] of array.entries()) {
      if (!value || value === "") {
        continue;
      } else if (value.startsWith("## ")) {
        items.push(
          <p key={index} className="help-text-line-header">
            {value.substring(3, value.length)}
          </p>
        );
      } else {
        items.push(
          <p key={index} className="help-text-line">
            {value}
          </p>
        );
      }
    }
    return items;
  };

  render() {
    return (
      <>
        <div className="searchbar_container" ref={this.setWrapperRef}>
          <div className="searchbar">
            <input
              className="searchbarfield"
              id="searchfield"
              type="text"
              autoComplete="off"
              placeholder="søk etter kartlag eller område..."
              onFocus={e => this.handleSearchBar(e.target.value)}
              onChange={e => {
                this.handleSearchBar(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === "ArrowDown") {
                  if (document.getElementsByClassName("searchbar_item")) {
                    if (e.keyCode === 40) {
                      if (
                        document.getElementsByClassName("searchbar_item")[0]
                      ) {
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
              onKeyPress={e => {
                if (e.key === "Enter") {
                  this.handleSearchButton();
                }
              }}
            />

            {this.state.isSearching && (
              <button
                className="x"
                onClick={() => {
                  this.handleRemoveTreffliste();
                  this.handleSearchBar(null);
                  document.getElementById("searchfield").value = "";
                }}
              >
                x
              </button>
            )}
            <button
              onClick={() => {
                this.handleSearchButton();
              }}
            >
              søk
            </button>
          </div>
          {(this.state.isSearching || this.props.searchResultPage) && (
            <TreffListe
              onSelectSearchResult={this.props.onSelectSearchResult}
              searchResultPage={this.props.searchResultPage}
              searchTerm={this.state.searchTerm}
              handleSearchBar={this.handleSearchBar}
              onSearchButton={this.handleSearchButton}
              treffliste={this.state.treffliste}
              treffliste_lag={this.state.treffliste_lag}
              treffliste_underlag={this.state.treffliste_underlag}
              treffliste_sted={this.state.treffliste_sted}
              treffliste_knr={this.state.treffliste_knr}
              treffliste_gnr={this.state.treffliste_gnr}
              treffliste_bnr={this.state.treffliste_bnr}
              treffliste_knrgnrbnr={this.state.treffliste_knrgnrbnr}
              removeValgtLag={this.props.removeValgtLag}
              addValgtLag={this.props.addValgtLag}
              handleGeoSelection={this.props.handleGeoSelection}
              handleRemoveTreffliste={this.handleRemoveTreffliste}
            />
          )}

          <button
            className="help_button"
            onClick={e => {
              this.openHelp();
            }}
          >
            ?
          </button>
        </div>

        <Modal
          open={this.state.showHelpModal}
          onClose={this.closeHelpModal}
          className="help-modal-body"
        >
          <div className="help-modal-wrapper">
            <div className="help-modal-title">
              <div>Brukermanual</div>
              <button
                tabIndex="0"
                className="close-modal-button"
                onClick={e => {
                  this.closeHelpModal();
                }}
              >
                <Close />
              </button>
            </div>
            <div className="help-modal-content">{this.formattedManual()}</div>
          </div>
        </Modal>
      </>
    );
  }
}

export default SearchBar;
