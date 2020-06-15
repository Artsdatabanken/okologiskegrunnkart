import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import backend from "./Funksjoner/backend";
import KartlagFanen from "./Forvaltningsportalen/KartlagFanen";
// import FeatureInfo from "./Forvaltningsportalen/FeatureInfo/FeatureInfo";
import KartVelger from "./Forvaltningsportalen/KartVelger";
import SearchBar from "./Forvaltningsportalen/SearchBar/SearchBar";
import Kart from "./Kart/Leaflet";
import AuthenticationContext from "./AuthenticationContext";
import bakgrunnskart from "./Kart/Bakgrunnskart/bakgrunnskarttema";
import { setValue } from "./Funksjoner/setValue";
import { sortKartlag } from "./Funksjoner/sortObject";
import "./style/kartknapper.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bakgrunnskart,
      kartlag: {},
      valgteLag: {},
      actualBounds: null,
      fitBounds: null,
      navigation_history: [],
      showCurrent: true,
      spraak: "nb",
      showExtensiveInfo: true,
      zoomcoordinates: null,
      valgtLag: null,
      searchResultPage: false,
      polygon: null,
      polyline: [],
      showPolygon: true,
      showSideBar: true,
      editable: true,
      sted: null,
      adresse: null,
      layersResult: {},
      allLayersResult: {}
    };
  }

  async lastNedKartlag() {
    // Get kartlag.json file from server as default
    let kartlag = await backend.hentLokalFil(
      "https://forvaltningsportal.test.artsdatabanken.no/kartlag.json"
    );
    // Get local kartlag.json file when not possible from server
    if (!kartlag) {
      kartlag = await backend.hentLokalFil("/kartlag.json");
    }
    // If none of the above work, load the preview file
    if (!kartlag) {
      console.error(
        "Du har ikke opprettet databasen og hentet ned datadump, og blir derfor vist et testdatasett."
      );
      kartlag = await backend.hentLokalFil("/kartlag_preview.json");
      console.error(
        "Gå til https://github.com/Artsdatabanken/forvaltningsportal/wiki/Databaseoppsett for mer informasjon"
      );
    }
    // Sort kartlag object aplhabetically based on title
    const sortedKartlag = sortKartlag(kartlag);
    Object.entries(sortedKartlag).forEach(([key, k]) => {
      k.opacity = 0.8;
      k.kart = { format: { wms: { url: k.wmsurl, layer: k.wmslayer } } };
    });
    this.setState({ kartlag: sortedKartlag });
  }

  componentDidMount() {
    this.lastNedKartlag();
  }

  render() {
    const { history } = this.props;
    const path = this.props.location.pathname;
    const basiskart = this.state.bakgrunnskart;
    return (
      <SettingsContext.Consumer>
        {context => {
          return (
            <AuthenticationContext.Consumer>
              {token => {
                return (
                  <>
                    <Kart
                      handleEditable={this.handleEditable}
                      editable={this.state.editable}
                      addPolygon={this.addPolygon}
                      addPolyline={this.addPolyline}
                      showPolygon={this.state.showPolygon}
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
                      bakgrunnskart={this.state.bakgrunnskart}
                      onMapBoundsChange={this.handleActualBoundsChange}
                      onMapMove={context.onMapMove}
                      history={history}
                      sted={this.state.sted}
                      adresse={this.state.adresse}
                      layersResult={this.state.layersResult}
                      allLayersResult={this.state.allLayersResult}
                      valgteLag={this.state.valgteLag}
                      token={token}
                      {...this.state}
                    />
                    <KartVelger
                      onUpdateLayerProp={this.handleSetBakgrunnskart}
                      aktivtFormat={basiskart.kart.aktivtFormat}
                      showSideBar={this.state.showSideBar}
                    />
                    {/* <FeatureInfo
                      {...this.state}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                      resultat={this.state.resultat}
                      layersResult={this.state.layersResult}
                      handleExtensiveInfo={this.handleExtensiveInfo}
                      coordinates_area={{
                        lat: this.state.lat,
                        lng: this.state.lng
                      }}
                    /> */}
                    <SearchBar
                      setSearchResultPage={this.setSearchResultPage}
                      searchResultPage={this.state.searchResultPage}
                      setKartlagSearchResults={this.setKartlagSearchResults}
                      setGeoSearchResults={this.setGeoSearchResults}
                      handleGeoSelection={this.handleGeoSelection}
                      kartlag={this.state.kartlag}
                      addValgtLag={this.addValgtLag}
                      removeValgtLag={this.removeValgtLag}
                      handleSetZoomCoordinates={this.handleSetZoomCoordinates}
                      onUpdateLayerProp={this.handleForvaltningsLayerProp}
                    />
                    <KartlagFanen
                      {...this.state}
                      polygon={this.state.polygon}
                      addPolygon={this.addPolygon}
                      hideAndShowPolygon={this.hideAndShowPolygon}
                      handleEditable={this.handleEditable}
                      showPolygon={this.state.showPolygon}
                      polyline={this.state.polyline}
                      addPolyline={this.addPolyline}
                      setSearchResultPage={this.setSearchResultPage}
                      searchResultPage={this.state.searchResultPage}
                      kartlagSearchResults={this.state.kartlagSearchResults}
                      geoSearchResults={this.state.geoSearchResults}
                      handleGeoSelection={this.handleGeoSelection}
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
                      showSideBar={this.state.showSideBar}
                      toggleSideBar={this.toggleSideBar}
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

  addPolyline = polyline => {
    this.setState({ polyline: polyline });
  };

  addPolygon = polygon => {
    this.setState({ polygon: polygon });
  };

  hideAndShowPolygon = showPolygon => {
    this.setState({ showPolygon: showPolygon });
  };

  handleEditable = editable => {
    this.setState({ editable: editable });
  };

  removeValgtLag = () => {
    this.setState({ valgtLag: null });
  };

  setSearchResultPage = searchResultPage => {
    this.setState({ searchResultPage: searchResultPage });
  };

  setGeoSearchResults = geoSearchResults => {
    this.setState({ geoSearchResults: geoSearchResults });
  };

  setKartlagSearchResults = kartlagSearchResults => {
    this.setState({ kartlagSearchResults: kartlagSearchResults });
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

  handleGeoSelection = geostring => {
    console.log("clacketty");
    if (geostring.ssrId) {
      let mincoord = [
        parseFloat(geostring.aust) - 1,
        parseFloat(geostring.nord) - 1
      ];
      let maxcoord = [
        parseFloat(geostring.aust) + 1,
        parseFloat(geostring.nord) + 1
      ];
      let centercoord = [
        parseFloat(geostring.aust),
        parseFloat(geostring.nord)
      ];
      this.handleSetZoomCoordinates(mincoord, maxcoord, centercoord);
    } else {
      console.log(geostring.representasjonspunkt);
      let koordinater = geostring.representasjonspunkt;

      let mincoord = [
        parseFloat(koordinater.lon) - 1,
        parseFloat(koordinater.lat) - 1
      ];
      let maxcoord = [
        parseFloat(koordinater.lon) + 1,
        parseFloat(koordinater.lat) + 1
      ];
      let centercoord = [
        parseFloat(koordinater.lon),
        parseFloat(koordinater.lat)
      ];

      this.handleSetZoomCoordinates(mincoord, maxcoord, centercoord);
    }
  };

  handleLatLng = (lng, lat) => {
    // Denne henter koordinatet og dytter det som state. Uten det kommer man ingensted.
    if (this.state.lat !== lat || this.state.lng !== lng) {
      this.setState({
        lat,
        lng,
        layersResult: {},
        allLayersResult: {}
      });
    }
  };

  handleStedsNavn = (lng, lat, zoom) => {
    // returnerer stedsnavn som vist øverst i feltet
    backend.hentStedsnavn(lng, lat, zoom).then(sted => {
      sted = sted.sort((a, b) =>
        a.distancemeters > b.distancemeters ? 1 : -1
      );
      this.setState({
        sted: sted.length > 0 ? sted[0] : null
      });
    });
  };

  handlePunktSok = (lng, lat, zoom) => {
    // returnerer punkt søk
    const radius = Math.round(16500 / Math.pow(zoom, 2));
    backend.hentPunktSok(lng, lat, radius).then(punktSok => {
      if (punktSok && punktSok.adresser) {
        const adresse = punktSok.adresser.sort((a, b) =>
          a.meterDistanseTilPunkt > b.meterDistanseTilPunkt ? 1 : -1
        );
        this.setState({
          adresse: adresse.length > 0 ? adresse[0] : null
        });
      }
    });
  };

  handleLayersSearch = (lng, lat, zoom, valgteLag) => {
    const emptylayersResult =
      Object.keys(this.state.layersResult).length === 0 &&
      this.state.layersResult.constructor === Object;

    if (!emptylayersResult) {
      return;
    }

    let looplist = this.state.kartlag;
    if (valgteLag) {
      looplist = valgteLag;
    }
    // Denne henter utvalgte lag baser på listen layers
    var layersResult = {};
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikktekst) return;
      layersResult[key] = { loading: true };
    });
    this.setState({ layersResult: layersResult });
    Object.keys(layersResult).forEach(key => {
      const layer = looplist[key];
      backend
        .getFeatureInfo(layer, { lat, lng, zoom })
        .then(res => {
          if (res.ServiceException) {
            res.error = res.ServiceException;
            delete res.ServiceException;
          }
          let layersResult = this.state.layersResult;
          layersResult[key] = res;
          this.setState(layersResult);
        })
        .catch(e => {
          let layersResult = this.state.layersResult;
          layersResult[key] = { error: e.message || key };
          this.setState(layersResult);
        });
    });
  };

  handleAllLayersSearch = (lng, lat, zoom) => {
    const emptylayersResult =
      Object.keys(this.state.allLayersResult).length === 0 &&
      this.state.allLayersResult.constructor === Object;

    if (!emptylayersResult) {
      return;
    }

    let looplist = this.state.kartlag;
    // Denne henter utvalgte lag baser på listen layers
    var allLayersResult = {};
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikktekst) return;
      allLayersResult[key] = { loading: true };
    });
    this.setState({ allLayersResult: allLayersResult });
    Object.keys(allLayersResult).forEach(key => {
      const layer = looplist[key];
      backend
        .getFeatureInfo(layer, { lat, lng, zoom })
        .then(res => {
          if (res.ServiceException) {
            res.error = res.ServiceException;
            delete res.ServiceException;
          }
          let allLayersResult = this.state.allLayersResult;
          allLayersResult[key] = res;
          this.setState(allLayersResult);
        })
        .catch(e => {
          let allLayersResult = this.state.allLayersResult;
          allLayersResult[key] = { error: e.message || key };
          this.setState(allLayersResult);
        });
    });
  };

  hentInfoValgteLag = async (lng, lat, zoom) => {
    let kartlag = this.state.kartlag;
    let valgteLag = {};
    for (let i in kartlag) {
      if (kartlag[i].erSynlig) valgteLag[i] = kartlag[i];
    }
    this.setState({ valgteLag: valgteLag });
    this.handleLatLng(lng, lat);
    this.handleStedsNavn(lng, lat, zoom);
    this.handlePunktSok(lng, lat, zoom);
    this.handleLayersSearch(lng, lat, zoom, valgteLag);
  };

  hentInfoAlleLag = async (lng, lat, zoom) => {
    this.handleLatLng(lng, lat);
    this.handleAllLayersSearch(lng, lat, zoom);
  };

  handleForvaltningsLayerProp = (layer, key, value) => {
    let nye_lag = this.state.kartlag;
    setValue(nye_lag[layer], key, value);
    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  handleSetBakgrunnskart = (key, value) => {
    let bakgrunnskart = this.state.bakgrunnskart;
    setValue(bakgrunnskart, key, value);
    this.setState({
      bakgrunnskart: Object.assign({}, bakgrunnskart)
    });
  };

  toggleSideBar = () => {
    this.setState({ showSideBar: !this.state.showSideBar });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
