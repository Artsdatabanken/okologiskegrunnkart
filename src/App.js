import React from "react";
import { withRouter } from "react-router";
import XML from "pixl-xml";
import { SettingsContext } from "SettingsContext";
import layers from "./Data/layers";
import metadata from "./metadata";
import metaSjekk from "AppSettings/AppFunksjoner/metaSjekk";
import fetchMeta from "AppSettings/AppFunksjoner/fetchMeta";
import backend from "Funksjoner/backend";
import TopBarContainer from "./TopBar/TopBarContainer";
import RightWindow from "./Forvaltningsportalen/RightWindow";
import LeftWindow from "./Forvaltningsportalen/LeftWindow";
import KartVelger from "./Forvaltningsportalen/KartVelger";
import Kart from "Kart/LeafletTangram/Leaflet";

import bakgrunnskarttema from "AppSettings/bakgrunnskarttema";
import { setValue } from "AppSettings/AppFunksjoner/setValue";
export let exportableSpraak;
export let exportableFullscreen;

class App extends React.Component {
  constructor(props) {
    super(props);
    let aktive = {
      bakgrunnskart: JSON.parse(JSON.stringify(bakgrunnskarttema))
    };
    this.state = {
      forvaltningsportalen: "true",
      aktiveLag: aktive,
      forvaltningsLag: aktive,
      opplystKode: "",
      opplyst: {},
      actualBounds: null,
      fitBounds: null,
      meta: null,
      visKoder: false,
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
    const basiskart =
      Object.values(this.state.forvaltningsLag || {}).find(
        x => x.kode === "bakgrunnskart"
      ) || {};
    return (
      <SettingsContext.Consumer>
        {context => {
          return (
            <>
              <>
                <TopBarContainer
                  _tittel={"Økologisk grunnkart forvaltningsportal"}
                />
                <KartVelger
                  onUpdateLayerProp={this.handleForvaltningsLayerProp}
                  aktivtFormat={basiskart.kart.aktivtFormat}
                />
                <Kart
                  showExtensiveInfo={this.state.showExtensiveInfo}
                  handleExtensiveInfo={this.handleExtensiveInfo}
                  handleLokalitetUpdate={this.handleLokalitetUpdate}
                  forvaltningsportal={true}
                  show_current={this.state.showCurrent}
                  bounds={this.state.fitBounds}
                  latitude={65.4}
                  longitude={15.8}
                  zoom={3.1}
                  aktiveLag={Object.assign(
                    this.state.forvaltningsLag,
                    this.state.meta && this.state.meta.barn
                  )}
                  opplyst={this.state.opplyst}
                  opplystKode={this.state.opplystKode}
                  meta={this.state.meta}
                  onMapBoundsChange={this.handleActualBoundsChange}
                  onMapMove={context.onMapMove}
                  history={history}
                  onRemoveSelectedLayer={this.handleRemoveSelectedLayer}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                />
                <RightWindow
                  {...this.state}
                  path={path}
                  history={history}
                  show_current={this.state.showCurrent}
                  handleShowCurrent={this.handleShowCurrent}
                  onFitBounds={this.handleFitBounds}
                  onUpdateLayerProp={this.handleForvaltningsLayerProp}
                  meta={this.state.meta || {}}
                />
                <LeftWindow
                  {...this.state}
                  handleExtensiveInfo={this.handleExtensiveInfo}
                  showExtensiveInfo={this.state.showExtensiveInfo}
                  path={path}
                  history={history}
                  show_current={this.state.showCurrent}
                  handleShowCurrent={this.handleShowCurrent}
                  onFitBounds={this.handleFitBounds}
                  onUpdateLayerProp={this.handleForvaltningsLayerProp}
                  meta={this.state.meta || {}}
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
    this.setState({ showExtensiveInfo: showExtensiveInfo });
  };
  handleFitBounds = bbox => {
    this.setState({ fitBounds: bbox });
  };
  handleShowCurrent = show_current => {
    this.setState({ showCurrent: show_current });
  };
  handleBoundsChange = bbox => {
    this.setState({ actualBounds: bbox });
  };
  handleSpraak = spraak => {
    this.setState({ spraak: spraak });
  };

  handleLokalitetUpdate = async (lng, lat) => {
    this.setState({
      lat,
      lng,
      sted: null,
      wms1: null
    });

    backend.hentPunkt(lng, lat).then(pi => {
      const env = pi.environment;
      if (pi.kommune)
        this.setState({
          kommune: { kommune: pi.kommune, fylke: pi.fylke }
        });
      const sone = env["NN-NA-BS-6SO"];
      if (sone)
        this.setState({
          sone
        });
      const seksjon = env["NN-NA-BS-6SE"];
      if (seksjon)
        this.setState({
          seksjon
        });
      const kalk = env["NN-NA-LKM-KA"];
      if (kalk)
        this.setState({
          kalk
        });
    });

    backend.hentStedsnavn(lng, lat).then(sted => {
      this.setState({
        sted: sted
      });
    });
    //   lng = 9.676521245246727;
    //   lat = 62.83068996597348;
    Object.keys(layers).forEach(key => {
      let url = layers[key];
      url += "&request=GetFeatureInfo";
      url += "&service=WMS";
      url = url.replace("{x}", "&x=" + lng);
      url = url.replace("{y}", "&y=" + lat);
      url = url.replace("{lng}", lng);
      url = url.replace("{lat}", lat);
      const delta = key === "naturtype" ? 0.0001 : 0.01;
      backend.wmsFeatureInfo(url, lat, lng, delta).then(response => {
        const res = XML.parse(response.text);
        res.url = response.url;
        if (key === "naturvern") console.log(key, JSON.stringify(res));
        this.setState({ [key]: res.FIELDS || res });
      });
    });
  };

  handleFullscreen = showFullscreen => {
    this.setState({ showFullscreen: showFullscreen });
  };
  handleClearSearchFor = () => this.setState({ searchFor: null });
  handleToggleLayer = () => {
    this.addSelected(this.state.meta);
  };
  componentDidMount() {
    fetchMeta(this.props.location.pathname, this);
  }

  async downloadMeta() {
    const meta = metadata;
    metaSjekk(meta, this);
    return meta;
  }

  handleRemoveSelectedLayer = kode => {
    let aktive = this.state.aktiveLag;
    delete aktive[kode];
    this.setState({ aktiveLag: aktive });
  };

  handleForvaltningsLayerProp = (layer, key, value) => {
    let nye_lag = this.state.forvaltningsLag;
    for (let item in this.state.forvaltningsLag) {
      if (nye_lag[item].kode === layer) {
        //        nye_lag[item][key] = value;
        setValue(nye_lag[item], key, value);
        break;
      }
    }
    this.setState({
      forvaltningsLag: Object.assign({}, nye_lag)
    });
  };

  handleMouseEnter = ({ kode, url }) => {
    // console.log("mouseenter", kode, url);
    this.setState({ opplystKode: kode, opplyst: { kode: kode, url: url } });
  };

  handleMouseLeave = () => {
    // console.log("mouseleave");
    this.setState({ opplystKode: "", opplyst: {} });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
