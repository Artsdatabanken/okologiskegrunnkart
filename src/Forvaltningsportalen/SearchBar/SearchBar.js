import React from "react";
import "../../style/searchbar.css";
import backend from "../../Funksjoner/backend";

class SearchBar extends React.Component {
  state = {
    treffliste: null,
    treffliste_lokalt: null,
    fylker: null,
    kommuner: null
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste: null,
      treffliste_lokalt: null
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
  }

  handleGeoSelection = geostring => {
    if (geostring[1] === "Kommune") {
      backend.hentKommunePolygon(geostring[2]).then(resultat => {
        let polygon = resultat.omrade.coordinates[0];
        let minx = 100;
        let maxy = 0;
        let maxx = 0;
        let miny = 100;
        for (let i in polygon) {
          let this_item = polygon[i];
          for (let i in this_item) {
            let item = this_item[i];
            if (item[0] < minx) {
              minx = item[0];
            } else if (item[0] > maxx) {
              maxx = item[0];
            }
            if (item[1] > maxy) {
              maxy = item[1];
            } else if (item[1] < miny) {
              miny = item[1];
            }
          }
        }
        let mincoord = [minx, miny];
        let maxcoord = [maxx, maxy];
        let centercoord = [(minx + maxx) / 2, (miny + maxy) / 2];
        this.props.handleSetZoomCoordinates(mincoord, maxcoord, centercoord);
      });
    }
  };

  handleSearchBar = searchTerm => {
    if (!searchTerm) return null;
    searchTerm = searchTerm.toLowerCase();
    let counter = 0;
    let treffliste_lokalt = [];
    let lag = this.props.kartlag;

    function searchForKey(criteria, counter, lag, searchTerm) {
      let treffliste_lokalt = [];
      for (let i in lag) {
        if (counter >= 5) {
          break;
        } else {
          if (lag[i][criteria]) {
            let lagstring = lag[i][criteria].toLowerCase();
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
    }
    this.setState({
      treffliste_lokalt: treffliste_lokalt
    });

    this.fetchGeoData().then(() => {
      let counter2 = 0;
      let kommuner = this.state.kommuner;
      let treffliste = [];
      for (let i in kommuner) {
        if (counter2 >= 5) {
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
      this.setState({
        treffliste: treffliste
      });
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
    let treffliste = this.state.treffliste;
    let treffliste_lokalt = this.state.treffliste_lokalt;

    return (
      <div className="searchbar_container" ref={this.setWrapperRef}>
        <div className="searchbar">
          <input
            className="searchbarfield"
            id="searchfield"
            type="text"
            placeholder="søk i sideinnhold eller geografisk område"
            onFocus={e => this.handleSearchBar(e.target.value)}
            onChange={e => {
              this.handleSearchBar(e.target.value);
            }}
          />

          <button
            onClick={() => {
              this.handleRemoveTreffliste();
              this.handleSearchBar(null);
              document.getElementById("searchfield").value = "";
            }}
          >
            x
          </button>
        </div>

        <div className="treffliste">
          {treffliste &&
            treffliste.length > 0 &&
            treffliste.map(item => {
              let itemname = item[0] || "";
              let itemtype = item[1] || "";
              let itemnr = item[2] || "";
              return (
                <button
                  className="searchbar_item"
                  key={item}
                  onClick={() => {
                    this.props.removeValgtLag();
                    this.handleGeoSelection(item);
                    this.handleRemoveTreffliste();
                    document.getElementById("searchfield").value = "";
                  }}
                >
                  <span className="itemname">{itemname} </span>
                  <span className="itemtype">{itemtype} </span>
                  <span className="itemnr">{itemnr} </span>
                </button>
              );
            })}

          {treffliste_lokalt &&
            treffliste_lokalt.length > 0 &&
            treffliste_lokalt.map(item => {
              let itemname = item.tittel;
              let itemtype = "Kartlag";
              let itemowner = item.dataeier;
              let tema = item.tema || "";
              return (
                <button
                  className="searchbar_item"
                  key={item.id}
                  onClick={() => {
                    this.props.removeValgtLag();
                    this.props.addValgtLag(item);
                    this.handleRemoveTreffliste();
                    document.getElementById("searchfield").value = "";
                  }}
                >
                  <span className="itemname">{itemname} </span>
                  <span className="itemtype">
                    {itemtype}, {itemowner}{" "}
                  </span>
                  <span className="itemnr">{tema}</span>
                </button>
              );
            })}
        </div>
      </div>
    );
  }
}

export default SearchBar;
