import React from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";
class SearchBar extends React.Component {
  state = {
    treffliste_lokalt: null,
    treffliste_sted: null,
    fylker: null,
    kommuner: null,
    isSearching: false
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste_sted: null,
      treffliste_lokalt: null,
      isSearching: false
    });
  };

  handleSearchBar = (searchTerm, resultpage) => {
    if (!searchTerm) {
      this.setState({ isSearching: false });
      return null;
    }
    let countermax = 5;
    if (resultpage) {
      this.props.setSearchResultPage(true);
      this.setState({ isSearching: false });
      countermax = 15;
    } else {
      this.setState({ isSearching: true });
    }
    searchTerm = searchTerm.toLowerCase();
    let counter = 0;
    let treffliste_lokalt = [];
    let lag = this.props.kartlag;

    function searchForKey(criteria, counter, lag, searchTerm) {
      let treffliste_lokalt = [];
      for (let i in lag) {
        if (counter >= countermax) {
          break;
        } else {
          if (lag[i][criteria]) {
            let lagstring = lag[i][criteria];
            if (criteria === "tags") {
              lagstring = JSON.stringify(lag[i][criteria]);
            }
            lagstring = lagstring.toLowerCase();
            if (lagstring.indexOf(searchTerm) !== -1) {
              let element = lag[i];
              treffliste_lokalt.push(element);
              counter += 1;
            }
          }
        }
      }
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

    if (
      searchTerm.indexOf("knr") !== -1 ||
      searchTerm.indexOf("bnr") !== -1 ||
      searchTerm.indexOf("gnr") !== -1
    ) {
      console.log(searchTerm);
      let knr = null;
      let gnr = null;
      let bnr = null;
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

      backend.hentKnrBnrGnr(knr, gnr, bnr).then(resultat => {
        console.log(resultat);
      });
    } else if (!isNaN(searchTerm)) {
      backend.hentKnrBnrGnr(searchTerm, null, null).then(resultat => {
        console.log(resultat);
      });
      backend.hentKnrBnrGnr(null, searchTerm, null).then(resultat => {
        console.log(resultat);
      });
      backend.hentKnrBnrGnr(null, null, searchTerm).then(resultat => {
        console.log(resultat);
      });
    } else {
      console.log("isnt number");
    }

    backend.hentSteder(searchTerm).then(resultat => {
      let max_items = 5;
      if (resultpage) {
        max_items = 50;
      }
      let entries = resultat.stedsnavn;
      let resultatliste = {};
      for (let i in entries) {
        let id = entries[i].ssrId;
        if (resultatliste[id]) {
          let gammel = resultatliste[id];
          let ny = entries[i];
          let variasjon = {};
          for (let j in gammel) {
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
            resultatliste[id].ssrpri = i || 100;
          }
        }
      }
      let prioritertliste = {};
      for (let i in resultatliste) {
        let element = resultatliste[i];
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
    return (
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
                    document
                      .getElementsByClassName("searchbar_item")[0]
                      .focus();
                  }
                } else {
                  console.log("nothing to see here");
                }
              }
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.handleSearchBar(
                  document.getElementById("searchfield").value,
                  true
                );

                document.getElementById("searchfield").value = "";
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
              this.handleSearchBar(
                document.getElementById("searchfield").value,
                true
              );
              document.getElementById("searchfield").value = "";
            }}
          >
            søk
          </button>
        </div>
        {this.state.isSearching && (
          <TreffListe
            handleSearchBar={this.handleSearchBar}
            treffliste={this.state.treffliste}
            treffliste_lokalt={this.state.treffliste_lokalt}
            treffliste_sted={this.state.treffliste_sted}
            removeValgtLag={this.props.removeValgtLag}
            addValgtLag={this.props.addValgtLag}
            handleGeoSelection={this.props.handleGeoSelection}
            handleRemoveTreffliste={this.handleRemoveTreffliste}
          />
        )}

        <button
          className="help_button"
          onClick={e => {
            window.open(
              "https://github.com/Artsdatabanken/forvaltningsportal/wiki/Brukermanual"
            );
          }}
        >
          ?
        </button>
      </div>
    );
  }
}

export default SearchBar;
