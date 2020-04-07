import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import url_formatter from "./Funksjoner/url_formatter";
import backend from "./Funksjoner/backend";
import KartlagFanen from "./Forvaltningsportalen/KartlagFanen";
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
      zoomcoordinates: null,
      valgtLag: null
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
                      kartlag={this.state.kartlag}
                      addValgtLag={this.addValgtLag}
                      removeValgtLag={this.removeValgtLag}
                      handleSetZoomCoordinates={this.handleSetZoomCoordinates}
                      handleRemoveTreffliste={this.handleRemoveTreffliste}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
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
                    <KartlagFanen
                      {...this.state}
                      addValgtLag={this.addValgtLag}
                      removeValgtLag={this.removeValgtLag}
                      valgtLag={this.state.valgtLag}
                      path={path}
                      history={history}
                      show_current={this.state.showCurrent}
                      onFitBounds={this.handleFitBounds}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      handleValgtLayerProp={this.handleValgtLayerProp}
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

  addValgtLag = valgtLag => {
    this.setState({ valgtLag: valgtLag });
  };

  removeValgtLag = () => {
    this.setState({ valgtLag: null });
  };

  handleRemoveZoomCoordinates = () => {
    this.setState({ zoomcoordinates: null });
  };

  handleSetZoomCoordinates = (mincoord, maxcoord, centercoord) => {
    this.setState({
      zoomcoordinates: {
        mincoord: mincoord,
        maxcoord: maxcoord,
        centercoord: centercoord
      }
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
