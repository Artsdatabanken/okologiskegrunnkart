import React from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";

class SearchBar extends React.Component {
  state = {
    treffliste: null,
    treffliste_lokalt: null,
    fylker: null,
    kommuner: null,
    isSearching: false
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste: null,
      treffliste_lokalt: null,
      isSearching: false
    });
  };

  async fetchGeoData() {
    let kommuner = this.state.kommuner;
    if (kommuner === null) {
      await backend.hentKommuner().then(henta_kommuner => {
        this.setState({
          kommuner: henta_kommuner
        });
      });
    }

    let fylker = this.state.fylker;
    if (fylker === null) {
      await backend.hentFylker().then(henta_fylker => {
        this.setState({
          fylker: henta_fylker
        });
      });
    }
  }

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

    this.fetchGeoData().then(() => {
      let counter2 = 0;
      let kommuner = this.state.kommuner;
      let fylker = this.state.fylker;
      let treffliste = [];
      for (let i in kommuner) {
        if (counter2 >= countermax / 2) {
          break;
        } else {
          let treff = kommuner[i].kommunenavn.toLowerCase();
          if (treff.indexOf(searchTerm) !== -1) {
            treffliste.push([
              kommuner[i].kommunenavn,
              "Kommune",
              kommuner[i].kommunenummer
            ]);
            counter2 += 1;
          }
        }
      }

      for (let i in fylker) {
        if (counter2 >= countermax) {
          break;
        } else {
          let treff = fylker[i].fylkesnavn.toLowerCase();
          if (treff.indexOf(searchTerm) !== -1) {
            treffliste.push([
              fylker[i].fylkesnavn,
              "Fylke",
              fylker[i].fylkesnummer
            ]);
            counter2 += 1;
          }
        }
      }

      if (resultpage) {
        this.props.setGeoSearchResults(treffliste);
      } else {
        this.setState({
          treffliste: treffliste
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
                    console.log("gå ned");
                    document
                      .getElementsByClassName("searchbar_item")[0]
                      .focus();
                  }
                } else {
                  console.log("nothjing to see her");
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
