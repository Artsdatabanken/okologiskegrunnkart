import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import url_formatter from "./Funksjoner/url_formatter";
import backend from "./Funksjoner/backend";
import RightWindow from "./Forvaltningsportalen/RightWindow";
import FeatureInfo from "./Forvaltningsportalen/FeatureInfo";
import KartVelger from "./Forvaltningsportalen/KartVelger";
import SearchBar from "./Forvaltningsportalen/SearchBar/SearchBar";
import Kart from "./Kart/Leaflet";
import AuthenticationContext from "./AuthenticationContext";
import bakgrunnskart from "./Kart/Bakgrunnskart/bakgrunnskarttema";
import fjellskygge from "./Kart/Bakgrunnskart/fjellskygge";
import { setValue } from "./Funksjoner/setValue";
import "./style/kartknapper.css";
export let exportableSpraak;
export let exportableFullscreen;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kartlag: {
        bakgrunnskart,
        fjellskygge
      },
      valgteLag: {},
      actualBounds: null,
      fitBounds: null,
      navigation_history: [],
      showCurrent: true,
      showFullscreen: false,
      spraak: "nb",
      showExtensiveInfo: true,
      treffliste: null,
      fylker: null,
      kommuner: null,
      zoomcoordinates: null
    };
    exportableSpraak = this;
    exportableFullscreen = this;
  }

  async lastNedKartlag() {
    var kartlag = await backend.hentLokalFil("kartlag.json");
    if (!kartlag) {
      console.error(
        "Du har ikke opprettet databasen og hentet ned datadump, og blir derfor vist et testdatasett."
      );
      kartlag = await backend.hentLokalFil("kartlag_preview.json");
      console.error(
        "Gå til https://github.com/Artsdatabanken/forvaltningsportal/wiki/Databaseoppsett for mer informasjon"
      );
    }
    Object.values(kartlag).forEach(k => {
      k.opacity = 0.8;
      k.kart = { format: { wms: { url: k.wmsurl, layer: k.wmslayer } } };
    });
    this.setState({
      kartlag: {
        bakgrunnskart,
        fjellskygge,
        ...kartlag
      }
    });
  }

  componentDidMount() {
    this.lastNedKartlag();
  }

  render() {
    const { history } = this.props;
    const path = this.props.location.pathname;
    const basiskart = this.state.kartlag.bakgrunnskart;
    return (
      <SettingsContext.Consumer>
        {context => {
          return (
            <AuthenticationContext.Consumer>
              {token => {
                return (
                  <>
                    <SearchBar
                      handleSearchBar={this.handleSearchBar}
                      treffliste={this.state.treffliste}
                      handleGeoSelection={this.handleGeoSelection}
                      handleRemoveTreffliste={this.handleRemoveTreffliste}
                    />
                    <KartVelger
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      aktivtFormat={basiskart.kart.aktivtFormat}
                    />
                    <Kart
                      zoomcoordinates={this.state.zoomcoordinates}
                      handleRemoveZoomCoordinates={
                        this.handleRemoveZoomCoordinates
                      }
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      showExtensiveInfo={this.state.showExtensiveInfo}
                      handleExtensiveInfo={this.handleExtensiveInfo}
                      handleLokalitetUpdate={this.hentInfoAlleLag}
                      handleValgteLag={this.hentInfoValgteLag}
                      forvaltningsportal={true}
                      show_current={this.state.showCurrent}
                      bounds={this.state.fitBounds}
                      latitude={65.4}
                      longitude={15.8}
                      zoom={3.1}
                      aktiveLag={this.state.kartlag}
                      onMapBoundsChange={this.handleActualBoundsChange}
                      onMapMove={context.onMapMove}
                      history={history}
                      sted={this.state.sted}
                      layersresultat={this.state.layersresultat}
                      valgteLag={this.state.valgteLag}
                      token={token}
                      {...this.state}
                    />
                    <RightWindow
                      {...this.state}
                      path={path}
                      history={history}
                      show_current={this.state.showCurrent}
                      onFitBounds={this.handleFitBounds}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      kartlag={this.state.kartlag}
                    />
                    <FeatureInfo
                      {...this.state}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      resultat={this.state.resultat}
                      layersresultat={this.state.layersresultat}
                      handleExtensiveInfo={this.handleExtensiveInfo}
                      coordinates_area={{
                        lat: this.state.lat,
                        lng: this.state.lng
                      }}
                    />
                  </>
                );
              }}
            </AuthenticationContext.Consumer>
          );
        }}
      </SettingsContext.Consumer>
    );
  }

  handleActualBoundsChange = bounds => {
    this.setState({ actualBounds: bounds, fitBounds: null });
  };
  handleExtensiveInfo = showExtensiveInfo => {
    // funksjonen som bestemmer om man søker eller ikke ved klikk
    this.setState({ showExtensiveInfo: showExtensiveInfo });
  };
  handleFitBounds = bbox => {
    this.setState({ fitBounds: bbox });
  };
  handleBoundsChange = bbox => {
    this.setState({ actualBounds: bbox });
  };
  handleSpraak = spraak => {
    this.setState({ spraak: spraak });
  };

  handleRemoveZoomCoordinates = () => {
    this.setState({ zoomcoordinates: null });
  };

  handleRemoveTreffliste = () => {
    this.setState({ treffliste: null });
  };

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
        console.log("setting state zoomcoordinates");
        this.setState({
          zoomcoordinates: {
            mincoord: mincoord,
            maxcoord: maxcoord,
            centercoord: centercoord
          }
        });
      });
    }
  };

  async fetchGeoData() {
    /*
    // Skjult midlertidig siden vi ikke har koordinater for dem
    let fylker = this.state.fylker;
    if (fylker === null) {
      await backend.hentFylker().then(henta_fylker => {
        this.setState({
          fylker: henta_fylker
        });
      });
    }*/

    let kommuner = this.state.kommuner;
    if (kommuner === null) {
      await backend.hentKommuner().then(henta_kommuner => {
        this.setState({
          kommuner: henta_kommuner
        });
      });
    }
  }

  handleSearchBar = searchTerm => {
    this.fetchGeoData().then(() => {
      let kommuner = this.state.kommuner;
      let treffliste = [];
      /*
      // Skjult midlertidig siden vi ikke har koordinater for dem
      let fylker = this.state.fylker;
      for (let i in fylker) {
        let treff = fylker[i].fylkesnavn.toLowerCase();
        if (treff.indexOf(searchTerm) !== -1) {
          treffliste.push([
            fylker[i].fylkesnavn,
            "Fylke",
            fylker[i].fylkesnummer
          ]);
        }
      }*/
      for (let i in kommuner) {
        let treff = kommuner[i].kommunenavn.toLowerCase();
        if (treff.indexOf(searchTerm) !== -1) {
          treffliste.push([
            kommuner[i].kommunenavn,
            "Kommune",
            kommuner[i].kommunenummer
          ]);
        }
      }
      this.setState({
        treffliste: treffliste
      });
    });
  };

  handleLatLng = (lng, lat) => {
    // Denne henter koordinatet og dytter det som state. Uten det kommer man ingensted.
    this.setState({
      lat,
      lng,
      sted: null,
      wms1: null
    });
  };

  handleStedsNavn = (lng, lat) => {
    // returnerer stedsnavn som vist øverst i feltet
    backend.hentStedsnavn(lng, lat).then(sted => {
      this.setState({
        sted: sted
      });
    });
  };

  handleLayersSøk = (lng, lat, valgteLag) => {
    let looplist = this.state.kartlag;
    if (valgteLag) {
      looplist = valgteLag;
    }
    // Denne henter utvalgte lag baser på listen layers
    var layersresultat = {};
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikkurl) return;
      layersresultat[key] = { loading: true };
    });
    this.setState({ layersresultat: layersresultat });
    Object.keys(layersresultat).forEach(key => {
      const layer = looplist[key];
      const delta = key === "naturtype" ? 0.0001 : 0.01; // bounding box størrelse for søk. TODO: Investigate WMS protocol
      var url = url_formatter(layer.klikkurl, lat, lng, delta);
      backend
        .getFeatureInfo(url)
        .then(res => {
          let layersresultat = this.state.layersresultat;
          layersresultat[key] = res;
          this.setState(layersresultat);
        })
        .catch(e => {
          let layersresultat = this.state.layersresultat;
          layersresultat[key] = { error: e.message || key };
          this.setState(layersresultat);
        });
    });
  };

  hentInfoValgteLag = async (lng, lat) => {
    let kartlag = this.state.kartlag;
    let valgteLag = {};
    for (let i in kartlag) {
      if (kartlag[i].erSynlig) {
        if (i !== "bakgrunnskart" && i !== "fjellskygge") {
          valgteLag[i] = kartlag[i];
        }
      }
    }
    this.setState({ valgteLag: valgteLag });
    this.handleStedsNavn(lng, lat);
    this.handleLayersSøk(lng, lat, valgteLag);
  };

  hentInfoAlleLag = async (lng, lat) => {
    this.handleLatLng(lng, lat);
    this.handleStedsNavn(lng, lat);
    this.handleLayersSøk(lng, lat, false);
  };

  handleForvaltningsLayerProp = (layer, key, value) => {
    let nye_lag = this.state.kartlag;
    setValue(nye_lag[layer], key, value);
    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
