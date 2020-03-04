import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "SettingsContext";
import kartlag from "./kartlag";
import url_formatter from "./Data/url_formatter";
import backend from "Funksjoner/backend";
import TopBarContainer from "./TopBar/TopBarContainer";
import RightWindow from "./Forvaltningsportalen/RightWindow";
import FeatureInfo from "./Forvaltningsportalen/FeatureInfo";
import KartVelger from "./Forvaltningsportalen/KartVelger";
import Kart from "Kart/LeafletTangram/Leaflet";

import bakgrunnskarttema from "AppSettings/bakgrunnskarttema";
import { setValue } from "AppSettings/AppFunksjoner/setValue";
export let exportableSpraak;
export let exportableFullscreen;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kartlag: {
        bakgrunnskart: JSON.parse(JSON.stringify(bakgrunnskarttema)),
        ...kartlag
      },
      valgteLag: {},
      opplystKode: "",
      opplyst: {},
      actualBounds: null,
      fitBounds: null,
      navigation_history: [],
      showCurrent: true,
      showFullscreen: false,
      spraak: "nb",
      showExtensiveInfo: true
    };
    exportableSpraak = this;
    exportableFullscreen = this;
  }

  render() {
    const { history } = this.props;
    const path = this.props.location.pathname;
    const basiskart = this.state.kartlag.bakgrunnskart;
    return (
      <SettingsContext.Consumer>
        {context => {
          return (
            <>
              <>
                <TopBarContainer />
                <KartVelger
                  onUpdateLayerProp={this.handleForvaltningsLayerProp}
                  aktivtFormat={basiskart.kart.aktivtFormat}
                />
                <Kart
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
                  opplyst={this.state.opplyst}
                  opplystKode={this.state.opplystKode}
                  onMapBoundsChange={this.handleActualBoundsChange}
                  onMapMove={context.onMapMove}
                  history={history}
                  sted={this.state.sted}
                  layersresultat={this.state.layersresultat}
                  valgteLag={this.state.valgteLag}
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
                  resultat={this.state.resultat}
                  layersresultat={this.state.layersresultat}
                  handleExtensiveInfo={this.handleExtensiveInfo}
                />
              </>
            </>
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
    let looplist = kartlag;
    if (valgteLag) {
      looplist = valgteLag;
    }
    // Denne henter utvalgte lag baser på listen layers
    this.setState({ layersresultat: {} });
    Object.keys(looplist).forEach(key => {
      const layer = looplist[key].featureinfo;
      if (!layer.url) return;
      const delta = key === "naturtype" ? 0.0001 : 0.01; // bounding box størrelse for søk. TODO: Investigate WMS protocol
      var url = url_formatter(layer.url, lat, lng, delta);
      this.setState({ [key]: { loading: true } });
      backend
        .getFeatureInfo(layer.protokoll, url)
        .then(res => {
          let layersresultat = this.state.layersresultat;
          layersresultat[key] = res.FIELDS || res;
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
        if (kartlag[i].type) {
          let item = kartlag[i].type;
          let res = kartlag[i];
          valgteLag[item] = res;
        } else if (kartlag[i].kode) {
          if (kartlag[i].kode !== "bakgrunnskart") {
            let item = kartlag[i].kode;
            let res = kartlag[item];
            valgteLag[item] = res;
          }
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
    for (let item in this.state.kartlag) {
      if (nye_lag[item].kode === layer || nye_lag[item].type === layer) {
        //        nye_lag[item][key] = value;
        setValue(nye_lag[item], key, value);
        break;
      }
    }
    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
