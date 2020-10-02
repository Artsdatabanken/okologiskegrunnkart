import React from "react";
import "../../style/searchbar.css";
import TreffListe from "./TreffListe";
import backend from "../../Funksjoner/backend";
import {
  Modal,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Menu as MenuIcon, Done } from "@material-ui/icons";

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
    treffliste_adresse: null,
    searchTerm: null,
    showHelpModal: false,
    manual: "",
    countermax: 50,
    anchorEl: null,
    number_places: 0,
    number_properties: 0,
    number_addresses: 0,
    number_layers: 0
  };

  handleRemoveTreffliste = () => {
    this.setState({
      treffliste_sted: null,
      treffliste_lag: null,
      isSearching: false,
      treffliste_knrgnrbnr: null,
      treffliste_knr: null,
      treffliste_gnr: null,
      treffliste_bnr: null,
      treffliste_adresse: null,
      number_places: 0,
      number_properties: 0,
      number_addresses: 0,
      number_layers: 0
    });
  };

  searchInLayer = (criteria, searchTerm, layer) => {
    if (layer[criteria]) {
      let lagstring = layer[criteria];
      if (criteria === "tags") {
        lagstring = JSON.stringify(layer[criteria]);
      }
      lagstring = lagstring.toLowerCase();
      // Try with complete string
      if (lagstring.indexOf(searchTerm) !== -1) {
        return true;
      }
      // Break string only for title
      if (criteria === "tittel") {
        const termList = searchTerm.split(" ");
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
          } else if (layer.aggregatedwmslayer === sublayers[j].wmslayer) {
            break;
          } else {
            const found = this.searchInLayer(
              criteria,
              searchTerm,
              sublayers[j]
            );
            if (found) {
              const sublayer = {
                ...sublayers[j],
                id: j,
                parentId: i,
                tema: layer.tema
              };
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
    // document.getElementById("searchfield").value = "";
  };

  handleSearchBar = (term, resultpage) => {
    let searchTerm = term ? term.trim() : null;
    if (!searchTerm) {
      this.setState({
        isSearching: false,
        searchTerm: null
      });
      return null;
    }
    // Remove weird symbols from search
    searchTerm = searchTerm.replace(/-/g, " ").replace(/&/g, " ");
    searchTerm = searchTerm.replace(/\?/g, " ").replace(/!/g, " ");
    searchTerm = searchTerm.replace(/"/g, " ").replace(/'/g, " ");
    searchTerm = searchTerm.replace(/\+/g, " ").replace(/\*/g, " ");
    searchTerm = searchTerm.replace(/\(/g, " ").replace(/\)/g, " ");
    searchTerm = searchTerm.replace(/\{/g, " ").replace(/\}/g, " ");
    searchTerm = searchTerm.replace(/\[/g, " ").replace(/\]/g, " ");
    searchTerm = searchTerm.replace(/  +/g, " ").trim();

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
    const number_layers = treffliste_lag.length + treffliste_underlag.length;
    this.setState({
      treffliste_lag,
      treffliste_underlag,
      number_layers
    });

    /* Kommunenummer, gårdsnummer og bruksnummer */
    let knr = null;
    let gnr = null;
    let bnr = null;
    let number_properties = 0;

    if (
      searchTerm.indexOf("knr") !== -1 ||
      searchTerm.indexOf("bnr") !== -1 ||
      searchTerm.indexOf("gnr") !== -1
    ) {
      // Hvis alt er skrevet på ønsket format = direkte oppslag
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
        const treffliste_knrgnrbnr =
          resultat && resultat.adresser ? resultat.adresser : [];
        number_properties += treffliste_knrgnrbnr.length;
        this.setState({
          treffliste_knrgnrbnr: resultat,
          treffliste_knr: null,
          treffliste_gnr: null,
          treffliste_bnr: null,
          number_properties
        });
      });
    } else if (!isNaN(searchTerm)) {
      // Hvis det sendes inn utelukkende ett nummer, slå opp i alle hver for seg
      backend.hentKommune(searchTerm).then(resultat => {
        // henter kommune fra ssr
        if (resultat && resultat["stedsnavn"]) {
          resultat["stedsnavn"]["knr"] = searchTerm;
        }
        const treffliste_knr =
          resultat && resultat.adresser ? resultat.adresser : [];
        number_properties += treffliste_knr.length;
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_knr: resultat,
          number_properties
        });
      });
      backend.hentKnrGnrBnr(null, searchTerm, null).then(resultat => {
        const treffliste_gnr =
          resultat && resultat.adresser ? resultat.adresser : [];
        number_properties += treffliste_gnr.length;
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_gnr: resultat,
          number_properties
        });
      });
      backend.hentKnrGnrBnr(null, null, searchTerm).then(resultat => {
        const treffliste_bnr =
          resultat && resultat.adresser ? resultat.adresser : [];
        number_properties += treffliste_bnr.length;
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_bnr: resultat,
          number_properties
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
          const treffliste_knrgnrbnr =
            resultat && resultat.adresser ? resultat.adresser : [];
          number_properties += treffliste_knrgnrbnr.length;
          this.setState({
            treffliste_knrgnrbnr: resultat,
            treffliste_knr: null,
            treffliste_gnr: null,
            treffliste_bnr: null,
            number_properties
          });
        });
      } else {
        this.setState({
          treffliste_knrgnrbnr: null,
          treffliste_knr: null,
          treffliste_gnr: null,
          treffliste_bnr: null,
          number_properties
        });
      }
    }

    backend.hentSteder(searchTerm).then(resultat => {
      // let max_items = 5;
      // if (resultpage) {
      //   max_items = 50;
      // }
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
      this.setState({
        treffliste_sted: Object.values(prioritertliste)
      });
    });

    let address = [];
    // Use strict search approach
    backend.hentAdresse(searchTerm).then(resultat => {
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
        backend.hentAdresse(searchTerm + "*").then(resultat => {
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
          this.setState({
            treffliste_adresse: address
          });
        });
      } else {
        this.setState({
          treffliste_adresse: address
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

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
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

  handleSearchKeyDown = e => {
    if (e.keyCode === 27 && !this.props.searchResultPage) {
      this.handleRemoveTreffliste();
      this.handleSearchBar(null);
      document.getElementById("searchfield").value = "";
      document.getElementById("searchfield").focus();
      return;
    }
    if (e.keyCode === 27 && this.props.searchResultPage) {
      document.getElementById("search-button").focus();
      return;
    }
    const searchBar = document.getElementsByClassName("searchbar_item");
    const length = searchBar.length;
    if (e.key === "ArrowDown" && e.keyCode === 40 && searchBar && length > 0) {
      searchBar[0].focus();
    }
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
              placeholder="Søk etter kartlag eller område..."
              onFocus={e => this.handleSearchBar(e.target.value)}
              onChange={e => {
                this.handleSearchBar(e.target.value);
              }}
              onKeyDown={e => {
                this.handleSearchKeyDown(e);
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  this.handleSearchButton();
                  if (
                    !this.props.isMobile &&
                    !this.props.showSideBar &&
                    document.getElementById("searchfield").value.length > 0
                  ) {
                    this.props.handleSideBar(true);
                  }
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
              id="search-button"
              className="search-button"
              onClick={() => {
                this.handleSearchButton();
                if (
                  !this.props.isMobile &&
                  !this.props.showSideBar &&
                  document.getElementById("searchfield").value.length > 0
                ) {
                  this.props.handleSideBar(true);
                }
              }}
            >
              Søk
            </button>
          </div>
          {(this.state.isSearching || this.props.searchResultPage) && (
            <TreffListe
              onSelectSearchResult={this.props.onSelectSearchResult}
              searchResultPage={this.props.searchResultPage}
              searchTerm={this.state.searchTerm}
              handleSearchBar={this.handleSearchBar}
              treffliste_lag={this.state.treffliste_lag}
              treffliste_underlag={this.state.treffliste_underlag}
              treffliste_sted={this.state.treffliste_sted}
              treffliste_knr={this.state.treffliste_knr}
              treffliste_gnr={this.state.treffliste_gnr}
              treffliste_bnr={this.state.treffliste_bnr}
              treffliste_adresse={this.state.treffliste_adresse}
              treffliste_knrgnrbnr={this.state.treffliste_knrgnrbnr}
              removeValgtLag={this.props.removeValgtLag}
              addValgtLag={this.props.addValgtLag}
              handleGeoSelection={this.props.handleGeoSelection}
              handleRemoveTreffliste={this.handleRemoveTreffliste}
              isMobile={this.props.isMobile}
              windowHeight={this.props.windowHeight}
              handleSideBar={this.props.handleSideBar}
              handleInfobox={this.props.handleInfobox}
              handleFullscreenInfobox={this.props.handleFullscreenInfobox}
            />
          )}

          <button
            className="help_button"
            tabIndex="0"
            onClick={e => {
              if (!this.props.loadingFeatures) {
                this.handleOpenMenu(e);
              }
            }}
          >
            <MenuIcon />
          </button>
          <Menu
            id="settings-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            variant="menu"
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            getContentAnchorEl={null}
          >
            <MenuItem
              id="settings-menu-user-manual"
              onClick={() => {
                this.openHelp();
                this.handleCloseMenu();
              }}
            >
              <ListItemText primary="Brukermanual" />
            </MenuItem>
            <Divider variant="middle" />
            <MenuItem
              id="settings-menu-kartlag"
              onClick={() => {
                this.props.toggleShowFavoriteLayers(true);
                this.handleCloseMenu();
              }}
              selected={this.props.showFavoriteLayers}
            >
              <ListItemText primary="Vis favoritt kartlag" />
              <ListItemIcon id="filter-layers-menu-icon">
                {this.props.showFavoriteLayers ? (
                  <Done fontSize="small" />
                ) : (
                  <div />
                )}
              </ListItemIcon>
            </MenuItem>
            <MenuItem
              id="settings-menu-kartlag"
              onClick={() => {
                this.props.toggleShowFavoriteLayers(false);
                this.handleCloseMenu();
              }}
              selected={!this.props.showFavoriteLayers}
            >
              <ListItemText primary="Vis fullstendig kartlag" />
              <ListItemIcon id="filter-layers-menu-icon">
                {!this.props.showFavoriteLayers ? (
                  <Done fontSize="small" />
                ) : (
                  <div />
                )}
              </ListItemIcon>
            </MenuItem>
            <Divider variant="middle" />
            <MenuItem
              id="settings-menu-kartlag"
              onClick={() => {
                this.props.toggleEditLayers();
                this.handleCloseMenu();
              }}
            >
              <ListItemText primary="Editere favoritt kartlag" />
            </MenuItem>
          </Menu>
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
                className="close-modal-button-wrapper"
                onClick={e => {
                  this.closeHelpModal();
                }}
              >
                <div className="close-modal-button">
                  <Close />
                </div>
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
