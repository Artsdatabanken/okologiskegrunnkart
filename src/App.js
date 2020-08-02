import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import backend from "./Funksjoner/backend";
import KartlagFanen from "./Forvaltningsportalen/KartlagFanen";
import Kart from "./Kart/Leaflet";
import AuthenticationContext from "./AuthenticationContext";
import bakgrunnskart from "./Kart/Bakgrunnskart/bakgrunnskarttema";
import { setValue } from "./Funksjoner/setValue";
import { sortKartlag } from "./Funksjoner/sortObject";
import "./style/kartknapper.css";
import formatterKlikktekst from "./Forvaltningsportalen/FeatureInfo/Klikktekst";
import url_formatter from "./Funksjoner/url_formatter";
import geography from "./geography";

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
      polyline: { shapeType: "linje", erSynlig: true, coords: [] },
      showPolygon: true,
      showSideBar: true,
      showInfobox: false,
      editable: true,
      sted: null,
      adresse: {},
      layersResult: {}
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
      k.id = key;
      k.opacity = 0;
      k.kart = { format: { wms: { url: k.wmsurl, layer: k.wmslayer } } };
    });
    this.setState({ kartlag: sortedKartlag });
  }

  componentDidMount() {
    this.lastNedKartlag();
  }

  handlePreviewGeojson = geojson => {
    const kartlag = this.state.kartlag;
    kartlag.preview = {
      kart: { format: { geojson: { data: geojson } } }
    };
    this.setState({ kartlag: Object.assign({}, kartlag) });
  };

  handleAddLayer = layer => {
    const kartlag = Object.assign(this.state.kartlag, layer);
    delete kartlag.preview;
    this.setState({ kartlag: Object.assign({}, kartlag) });
  };

  render() {
    const { history } = this.props;
    const path = this.props.location.pathname;
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
                      onUpdatePolyline={this.handleUpdatePolyline}
                      showPolygon={this.state.showPolygon}
                      zoomcoordinates={this.state.zoomcoordinates}
                      handleRemoveZoomCoordinates={
                        this.handleRemoveZoomCoordinates
                      }
                      onUpdateLayerProp={this.handleUpdateLayerProp}
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
                      valgteLag={this.state.valgteLag}
                      token={token}
                      showInfobox={this.state.showInfobox}
                      handleInfobox={this.handleInfobox}
                      {...this.state}
                    />
                    <KartlagFanen
                      {...this.state}
                      onPreviewGeojson={this.handlePreviewGeojson}
                      onAddLayer={this.handleAddLayer}
                      onChangeBakgrunnskart={this.handleChangeBakgrunnskart}
                      layersResult={this.state.layersResult}
                      polygon={this.state.polygon}
                      addPolygon={this.addPolygon}
                      handleEditable={this.handleEditable}
                      showPolygon={this.state.showPolygon}
                      polyline={this.state.polyline}
                      onUpdatePolyline={this.handleUpdatePolyline}
                      onSelectSearchResult={this.handleSelectSearchResult}
                      searchResultPage={this.state.searchResultPage}
                      kartlagSearchResults={this.state.kartlagSearchResults}
                      geoSearchResults={this.state.geoSearchResults}
                      handleGeoSelection={this.handleGeoSelection}
                      valgtLag={this.state.valgtLag}
                      path={path}
                      history={history}
                      show_current={this.state.showCurrent}
                      onFitBounds={this.handleFitBounds}
                      onUpdateLayerProp={this.handleUpdateLayerProp}
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
    this.setState({ valgtLag });
  };

  handleUpdatePolyline = polyline => {
    geography.addDistances(polyline);
    this.setState({ polyline: polyline });
  };

  addPolygon = polygon => {
    this.setState({ polygon: polygon });
  };

  handleEditable = editable => {
    this.setState({ editable: editable });
  };

  handleSelectSearchResult = searchResultPage => {
    console.log("search", { searchResultPage });
    this.setState({ searchResultPage: searchResultPage });
  };

  setGeoSearchResults = geoSearchResults => {
    this.setState({ geoSearchResults: geoSearchResults });
  };

  handleSetKartlagSearchResult = kartlagSearchResults => {
    console.log("klsearch", { kartlagSearchResults });
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
        layersResult: {}
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
    const radius = Math.round(16500 / Math.pow(zoom, 2));
    this.setState({
      adresse: { loading: true }
    });
    backend.hentPunktSok(lng, lat, radius).then(punktSok => {
      if (!punktSok || !punktSok.adresser) this.setState({ adresse: {} });
      const adresse = punktSok.adresser.sort((a, b) =>
        a.meterDistanseTilPunkt > b.meterDistanseTilPunkt ? 1 : -1
      );
      this.setState({
        adresse: adresse.length > 0 ? adresse[0] : {}
      });
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
    this.setState({ layersResult: {} });
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikktekst) return;
    });
    Object.keys(looplist).forEach(key => {
      const kartlag = looplist[key];
      this.getFeatureInfo(kartlag, key, lat, lng, zoom);
    });
  };

  async getFeatureInfo(kartlag, key, lat, lng, zoom) {
    var layersResult = this.state.layersResult;
    layersResult[key] = { loading: true, secondary: kartlag.tittel };
    this.setState({ layersResult });
    backend
      .getFeatureInfo(kartlag, { lat, lng, zoom })
      .then(res => {
        if (res.ServiceException) {
          res.error = res.ServiceException;
          if (res.error._Data) res.error = res.error._Data;
          delete res.ServiceException;
        }
        let layersResult = this.state.layersResult;

        const faktaark_url = url_formatter(kartlag.faktaark, {
          lat,
          lng,
          zoom,
          ...res
        });

        var primary = formatterKlikktekst(kartlag.klikktekst, res);
        var secondary =
          formatterKlikktekst(kartlag.klikktekst2, res) || kartlag.tittel;
        if (res.error) primary = "Noe gikk feil..";
        res = { primary, secondary, faktaark_url, error: res.error };
        layersResult[key] = res;
        this.setState(layersResult);
      })
      .catch(e => {
        let layersResult = this.state.layersResult;
        layersResult[key] = { error: e.message || key };
        this.setState(layersResult);
      });
  }

  handleAllLayersSearch = (lng, lat, zoom) => {
    this.setState({ layersResult: {} });
    Object.keys(this.state.kartlag).forEach(key => {
      const layer = this.state.kartlag[key];
      this.getFeatureInfo(layer, key, lat, lng, zoom);
    });
  };

  hentInfoValgteLag = async (lng, lat, zoom) => {
    let kartlag = this.state.kartlag;
    let valgteLag = {};
    for (let i in kartlag) {
      const lag = kartlag[i];
      // TODO: Some layers don't have underlag, eks høydedata
      if (Object.values(lag.underlag || {}).some(ul => ul.opacity > 0))
        valgteLag[i] = lag;
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

  handleUpdateLayerProp = (layerkey, key, value) => {
    let nye_lag = this.state.kartlag;
    const layer = nye_lag[layerkey];
    setValue(layer, key, value);

    let numberVisible = 0;
    for (const sublayerId in layer.underlag) {
      if (layer.underlag[sublayerId].erSynlig) numberVisible += 1;
    }
    layer.erSynlig = numberVisible > 0;
    layer.numberVisible = numberVisible;

    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  handleChangeBakgrunnskart = (key, value) => {
    console.log({ key, value });
    let bakgrunnskart = this.state.bakgrunnskart;
    setValue(bakgrunnskart, key, value);
    this.setState({
      bakgrunnskart: Object.assign({}, bakgrunnskart)
    });
  };

  toggleSideBar = () => {
    this.setState({ showSideBar: !this.state.showSideBar });
  };

  handleInfobox = bool => {
    this.setState({ showInfobox: bool });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
