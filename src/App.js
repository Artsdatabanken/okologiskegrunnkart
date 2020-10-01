import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import backend from "./Funksjoner/backend";
import KartlagFanen from "./Forvaltningsportalen/KartlagFanen";
import KartVelger from "./Forvaltningsportalen/KartVelger";
import SearchBar from "./Forvaltningsportalen/SearchBar/SearchBar";
import Kart from "./Kart/Leaflet";
import KartlagSettings from "./Settings/KartlagSettings";
import AuthenticationContext from "./AuthenticationContext";
import bakgrunnskart from "./Kart/Bakgrunnskart/bakgrunnskarttema";
import { setValue } from "./Funksjoner/setValue";
import { sortKartlag, sortUnderlag } from "./Funksjoner/sortObject";
import "./style/kartknapper.css";
import db from "./IndexedDB/IndexedDB";
import {
  updateLayersIndexedDB,
  removeUnusedLayersIndexedDB
} from "./IndexedDB/ActionsIndexedDB";

class App extends React.Component {
  state = {
    bakgrunnskart,
    completeKartlag: {},
    favoriteKartlag: {},
    kartlag: {},
    valgteLag: {},
    navigation_history: [],
    showCurrent: true,
    spraak: "nb",
    showExtensiveInfo: false,
    zoomcoordinates: null,
    valgtLag: null,
    searchResultPage: false,
    polygon: null,
    polyline: [],
    showPolygon: true,
    polygonResults: null,
    showSideBar: true,
    showInfobox: false,
    editable: true,
    sted: null,
    adresse: null,
    elevation: null,
    layersResult: {},
    allLayersResult: {},
    zoom: 3.1,
    lat: null,
    lng: null,
    loadingFeatures: false,
    editLayersMode: false,
    someLayersFavorite: false,
    listFavoriteLayerIds: [],
    listFavoriteSublayerIds: [],
    showFavoriteLayers: false,
    visibleSublayersFavorites: [],
    visibleSublayersComplete: [],
    expandedLayersFavorites: [],
    expandedLayersComplete: [],
    sublayerDetailsVisible: false,
    infoboxDetailsVisible: false,
    layerInfoboxDetails: null,
    legendVisible: false,
    showFullscreenInfobox: false,
    isMobile: false,
    showMarker: true,
    sortKey: "alfabetisk",
    tagFilter: {},
    matchAllFilters: true
  };

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

    const alphaNumericOnly = s => s.replace(/[^a-zA-Z0-9]/g, "");

    // Sort kartlag object aplhabetically based on title
    const sortedKartlag = sortKartlag(kartlag);

    // Get layers and sublayers from indexed DB
    const layersdb = await db.layers.toArray();
    const sublayersdb = await db.sublayers.toArray();
    const listFavoriteLayerIds = [];
    const listFavoriteSublayerIds = [];

    // Modify and store kartlag in state
    Object.entries(sortedKartlag).forEach(async ([key, k]) => {
      k.id = key;
      k.kart = { format: { wms: { url: k.wmsurl, layer: k.wmslayer } } };
      k.expanded = false;
      listFavoriteLayerIds.push(key);

      // Check if layer is already stored in indexed DB. Add layer if not
      const existingLayer = layersdb.filter(e => e.id === key);
      if (existingLayer.length === 0) {
        db.layers.add({
          id: key,
          title: k.tittel,
          favorite: false
        });
        k.favorite = false;
      } else if (existingLayer[0].title !== k.tittel) {
        db.layers
          .where("id")
          .equals(key)
          .modify({ title: k.tittel });
        k.favorite = existingLayer[0].favorite;
      } else {
        k.favorite = existingLayer[0].favorite;
      }

      if (!this.state.someLayersFavorite && k.favorite) {
        this.setState({ someLayersFavorite: true });
      }

      // Add a pseudo-sublayer for all categories
      k.allcategorieslayer = {
        erSynlig: false,
        tittel: "Alle kategorier",
        wmslayer: null,
        opacity: 0.8
      };

      // Get all klikktekst input for aggregated layers
      let aggClickText = {};
      let aggClickText2 = {};
      let aggKey = null;

      k.underlag = k.underlag || {};
      k.underlag = Object.values(k.underlag).reduce((acc, ul) => {
        ul.key = ul.id;
        ul.id = alphaNumericOnly(k.tittel) + "_" + alphaNumericOnly(ul.tittel);
        ul.opacity = 0.8;
        acc[ul.id] = ul;
        listFavoriteSublayerIds.push(ul.key);
        ul.tileerror = false;

        // Replace pseudo-sublayer for all categories if an actual sublayer exists
        ul.aggregatedwmslayer = ul.wmslayer === k.aggregatedwmslayer;
        ul.visible = false;
        if (ul.wmslayer === k.aggregatedwmslayer) {
          // NOTE that "ul" this is copy of the layer..
          // Changes to "ul" will not affect "allcategorieslayer"
          k.allcategorieslayer = { ...ul };
          k.allcategorieslayer.tittel = "Alle kategorier";
          aggKey = ul.id;
        }

        // Create aggregated klikktekst
        if (
          ul.wmslayer !== k.aggregatedwmslayer &&
          !ul.wmslayer.toLowerCase().includes("dekningskart")
        ) {
          aggClickText = {
            ...aggClickText,
            [ul.id]: ul.klikktekst
          };
          aggClickText2 = {
            ...aggClickText2,
            [ul.id]: ul.klikktekst2
          };
        }

        // Check if sublayer is already stored in indexed DB. Add sublayer if not
        const existingSublayer = sublayersdb.filter(e => e.id === ul.key);
        if (existingSublayer.length === 0) {
          db.sublayers.add({
            id: ul.key,
            title: ul.tittel,
            favorite: false
          });
          ul.favorite = false;
        } else if (existingSublayer[0].title !== ul.tittel) {
          db.sublayers
            .where("id")
            .equals(ul.key)
            .modify({ title: ul.tittel });
          ul.favorite = existingSublayer[0].favorite;
        } else {
          ul.favorite = existingSublayer[0].favorite;
        }

        if (!this.state.someLayersFavorite && ul.favorite) {
          this.setState({ someLayersFavorite: true });
        }
        if (!this.state.showFavoriteLayers && ul.favorite) {
          this.setState({ showFavoriteLayers: true });
        }

        return acc;
      }, {});
      if (aggKey) {
        k.allcategorieslayer.klikktekst = { [aggKey]: aggClickText };
        k.allcategorieslayer.klikktekst2 = { [aggKey]: aggClickText2 };
      }
    });
    this.setState({
      completeKartlag: sortedKartlag,
      listFavoriteLayerIds,
      listFavoriteSublayerIds
    });

    const reducedKartlag = this.reduceKartlag(sortedKartlag);
    this.setState({ favoriteKartlag: reducedKartlag });

    if (this.state.showFavoriteLayers) {
      this.setState({ kartlag: reducedKartlag });
    } else {
      this.setState({ kartlag: sortedKartlag });
    }
  }

  async componentDidMount() {
    await this.lastNedKartlag();
    removeUnusedLayersIndexedDB(
      this.state.listFavoriteLayerIds,
      this.state.listFavoriteSublayerIds
    );
  }

  render() {
    const { history } = this.props;
    const basiskart = this.state.bakgrunnskart;
    return (
      <SettingsContext.Consumer>
        {context => {
          return (
            <AuthenticationContext.Consumer>
              {token => {
                return (
                  <>
                    {this.state.editLayersMode && (
                      <KartlagSettings
                        kartlag={this.state.completeKartlag}
                        someLayersFavorite={this.state.someLayersFavorite}
                        handleSomeLayersFavorite={this.handleSomeLayersFavorite}
                        toggleEditLayers={this.toggleEditLayers}
                        updateFavoriteLayers={this.updateFavoriteLayers}
                        handleShowFavoriteLayers={this.handleShowFavoriteLayers}
                        isMobile={this.state.isMobile}
                      />
                    )}
                    <div
                      className={
                        this.state.editLayersMode ? "hidden-app-content" : ""
                      }
                    >
                      <Kart
                        polygon={this.state.polygon}
                        polyline={this.state.polyline}
                        showPolygon={this.state.showPolygon}
                        hideAndShowPolygon={this.hideAndShowPolygon}
                        handleEditable={this.handleEditable}
                        addPolygon={this.addPolygon}
                        addPolyline={this.addPolyline}
                        editable={this.state.editable}
                        polygonResults={this.state.polygonResults}
                        handlePolygonResults={this.handlePolygonResults}
                        showMarker={this.state.showMarker}
                        hideAndShowMarker={this.hideAndShowMarker}
                        zoomcoordinates={this.state.zoomcoordinates}
                        handleRemoveZoomCoordinates={
                          this.handleRemoveZoomCoordinates
                        }
                        showExtensiveInfo={this.state.showExtensiveInfo}
                        handleExtensiveInfo={this.handleExtensiveInfo}
                        handleAlleLag={this.hentInfoAlleLag}
                        handleValgteLag={this.hentInfoAlleValgteLag}
                        forvaltningsportal={true}
                        show_current={this.state.showCurrent}
                        latitude={65.4}
                        longitude={15.8}
                        zoom={this.state.zoom}
                        handleZoomChange={this.handleZoomChange}
                        aktiveLag={this.state.kartlag}
                        bakgrunnskart={this.state.bakgrunnskart}
                        onMapMove={context.onMapMove}
                        history={history}
                        sted={this.state.sted}
                        adresse={this.state.adresse}
                        elevation={this.state.elevation}
                        layersResult={this.state.layersResult}
                        allLayersResult={this.state.allLayersResult}
                        valgteLag={this.state.valgteLag}
                        token={token}
                        loadingFeatures={this.state.loadingFeatures}
                        showSideBar={this.state.showSideBar}
                        showInfobox={this.state.showInfobox}
                        handleInfobox={this.handleInfobox}
                        showFullscreenInfobox={this.state.showFullscreenInfobox}
                        handleFullscreenInfobox={this.handleFullscreenInfobox}
                        isMobile={this.state.isMobile}
                        infoboxDetailsVisible={this.state.infoboxDetailsVisible}
                        setInfoboxDetailsVisible={this.setInfoboxDetailsVisible}
                        setLayerInfoboxDetails={this.setLayerInfoboxDetails}
                        onTileStatus={this.onTileStatus}
                        sortKey={this.state.sortKey}
                        tagFilter={this.state.tagFilter}
                        matchAllFilters={this.state.matchAllFilters}
                        lat={this.state.lat}
                        lng={this.state.lng}
                        {...this.state}
                      />
                      <KartVelger
                        onUpdateLayerProp={this.handleSetBakgrunnskart}
                        aktivtFormat={basiskart.kart.aktivtFormat}
                        showSideBar={this.state.showSideBar}
                        showInfobox={this.state.showInfobox}
                        isMobile={this.state.isMobile}
                      />
                      <SearchBar
                        onSelectSearchResult={this.handleSelectSearchResult}
                        searchResultPage={this.state.searchResultPage}
                        setKartlagSearchResults={
                          this.handleSetKartlagSearchResult
                        }
                        handleGeoSelection={this.handleGeoSelection}
                        kartlag={this.state.kartlag}
                        addValgtLag={this.handleNavigateToKartlag}
                        removeValgtLag={this.removeValgtLag}
                        handleSetZoomCoordinates={this.handleSetZoomCoordinates}
                        onUpdateLayerProp={this.handleForvaltningsLayerProp}
                        toggleEditLayers={this.toggleEditLayers}
                        showFavoriteLayers={this.state.showFavoriteLayers}
                        toggleShowFavoriteLayers={this.toggleShowFavoriteLayers}
                        isMobile={this.state.isMobile}
                        showSideBar={this.state.showSideBar}
                        handleSideBar={this.handleSideBar}
                        handleInfobox={this.handleInfobox}
                        handleFullscreenInfobox={this.handleFullscreenInfobox}
                        loadingFeatures={this.state.loadingFeatures}
                      />
                      <KartlagFanen
                        searchResultPage={this.state.searchResultPage}
                        removeValgtLag={this.removeValgtLag}
                        valgtLag={this.state.valgtLag}
                        onUpdateLayerProp={this.handleForvaltningsLayerProp}
                        changeVisibleSublayers={this.changeVisibleSublayers}
                        kartlag={this.state.kartlag}
                        showSideBar={this.state.showSideBar}
                        handleSideBar={this.handleSideBar}
                        sublayerDetailsVisible={
                          this.state.sublayerDetailsVisible
                        }
                        setSublayerDetailsVisible={
                          this.setSublayerDetailsVisible
                        }
                        legendVisible={this.state.legendVisible}
                        setLegendVisible={this.setLegendVisible}
                        updateIsMobile={this.updateIsMobile}
                        handleSelectSearchResult={this.handleSelectSearchResult}
                        handleSortKey={this.handleSortKey}
                        handleTagFilter={this.handleTagFilter}
                        handleMatchAllFilters={this.handleMatchAllFilters}
                      />
                    </div>
                  </>
                );
              }}
            </AuthenticationContext.Consumer>
          );
        }}
      </SettingsContext.Consumer>
    );
  }

  setSublayerDetailsVisible = visible => {
    this.setState({ sublayerDetailsVisible: visible });
  };

  setInfoboxDetailsVisible = visible => {
    this.setState({ infoboxDetailsVisible: visible });
  };

  setLayerInfoboxDetails = layer => {
    this.setState({ layerInfoboxDetails: layer });
  };

  setLegendVisible = visible => {
    this.setState({ legendVisible: visible });
  };

  toggleEditLayers = () => {
    this.setState({ editLayersMode: !this.state.editLayersMode });
  };

  handleSomeLayersFavorite = someLayersFavorite => {
    this.setState({ someLayersFavorite });
  };

  handleShowFavoriteLayers = async showFavoriteLayers => {
    this.setState({ showFavoriteLayers });
  };

  toggleShowFavoriteLayers = async favorites => {
    this.setState({
      showFavoriteLayers: favorites,
      sublayerDetailsVisible: false,
      legendVisible: false
    });
    if (favorites) {
      this.hideVisibleLayers(favorites).then(() => {
        this.setState({ kartlag: this.state.favoriteKartlag }, () => {
          this.showVisibleLayers(favorites).then(() => {
            if (this.state.showInfobox && this.state.showExtensiveInfo) {
              this.setState({ allLayersResult: {} });
              this.handleAllLayersSearch(
                this.state.lng,
                this.state.lat,
                this.state.zoom
              );
            }
          });
        });
      });
    } else {
      this.hideVisibleLayers(favorites).then(() => {
        this.setState({ kartlag: this.state.completeKartlag }, () => {
          this.showVisibleLayers(favorites).then(() => {
            if (this.state.showInfobox && this.state.showExtensiveInfo) {
              this.setState({ allLayersResult: {} });
              this.handleAllLayersSearch(
                this.state.lng,
                this.state.lat,
                this.state.zoom
              );
            }
          });
        });
      });
    }
  };

  showVisibleLayers = async favorites => {
    if (favorites) {
      for (const item of this.state.visibleSublayersFavorites) {
        for (const prop of item.propKeys) {
          this.handleForvaltningsLayerProp(item.layerKey, prop.key, prop.value);
        }
      }
    } else {
      for (const item of this.state.visibleSublayersComplete) {
        for (const prop of item.propKeys) {
          this.handleForvaltningsLayerProp(item.layerKey, prop.key, prop.value);
        }
      }
    }
    this.hentInfoAlleValgteLag(this.state.lng, this.state.lat, this.state.zoom);
  };

  hideVisibleLayers = async favorites => {
    if (favorites) {
      for (const item of this.state.visibleSublayersComplete) {
        for (const prop of item.propKeys) {
          this.handleForvaltningsLayerProp(item.layerKey, prop.key, false);
        }
      }
    } else {
      for (const item of this.state.visibleSublayersFavorites) {
        for (const prop of item.propKeys) {
          this.handleForvaltningsLayerProp(item.layerKey, prop.key, false);
        }
      }
    }
    this.hentInfoAlleValgteLag(this.state.lng, this.state.lat, this.state.zoom);
  };

  updateFavoriteLayers = async completeKartlag => {
    const favoriteKartlag = this.reduceKartlag(completeKartlag);
    this.setState({
      completeKartlag,
      favoriteKartlag,
      infoboxDetailsVisible: false
    });

    this.setState({ kartlag: completeKartlag }, () => {
      this.hideVisibleLayers(false).then(() => {
        this.setState({ kartlag: favoriteKartlag }, () => {
          this.hideVisibleLayers(true);
        });
      });
    });

    this.setState({
      visibleSublayersFavorites: [],
      showFavoriteLayers: true
    });
    updateLayersIndexedDB(completeKartlag);
  };

  reduceKartlag = layers => {
    // Reduce kartlag for favorite layers only
    let reducedLayers = {};
    Object.keys(layers).forEach(layerId => {
      const layer = layers[layerId];
      if (layer.favorite) {
        let reducedSublayers = {};
        Object.keys(layer.underlag).forEach(sublayerId => {
          const sublayer = layer.underlag[sublayerId];
          if (sublayer.favorite) {
            reducedSublayers[sublayerId] = sublayer;
          }
          return reducedSublayers;
        });
        const reducedLayer = { ...layer, underlag: reducedSublayers };
        reducedLayers[layerId] = reducedLayer;
      }
      return reducedLayers;
    });
    return reducedLayers;
  };

  handleExtensiveInfo = showExtensiveInfo => {
    // funksjonen som bestemmer om man søker eller ikke ved klikk
    this.setState({ showExtensiveInfo: showExtensiveInfo });
  };
  handleSpraak = spraak => {
    this.setState({ spraak: spraak });
  };

  handleNavigateToKartlag = (valgtLag, trefftype) => {
    this.props.history.push("/kartlag/" + valgtLag.id.trim());
    if (trefftype === "Underlag") {
      const id = valgtLag.id;
      const parentId = valgtLag.parentId;
      const selectedUnderlayer = {
        [id]: this.state.kartlag[parentId].underlag[id]
      };
      const selectedLayer = this.state.kartlag[parentId];
      const selected = { ...selectedLayer, underlag: selectedUnderlayer };
      this.setState({ valgtLag: selected });
    } else {
      this.setState({ valgtLag: valgtLag });
    }
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

  handlePolygonResults = results => {
    this.setState({ polygonResults: results });
  };

  hideAndShowMarker = showMarker => {
    this.setState({ showMarker: showMarker });
  };

  removeValgtLag = () => {
    this.setState({ valgtLag: null });
  };

  handleSelectSearchResult = searchResultPage => {
    this.setState({ searchResultPage: searchResultPage });
  };

  handleSetKartlagSearchResult = kartlagSearchResults => {
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
    let mincoord = null;
    let maxcoord = null;
    let centercoord = null;
    let lng = null;
    let lat = null;

    if (geostring.ssrId) {
      mincoord = [
        parseFloat(geostring.aust) - 1,
        parseFloat(geostring.nord) - 1
      ];
      maxcoord = [
        parseFloat(geostring.aust) + 1,
        parseFloat(geostring.nord) + 1
      ];
      centercoord = [parseFloat(geostring.aust), parseFloat(geostring.nord)];
      lng = parseFloat(geostring.aust);
      lat = parseFloat(geostring.nord);
    } else {
      let koordinater = geostring.representasjonspunkt;
      mincoord = [
        parseFloat(koordinater.lon) - 1,
        parseFloat(koordinater.lat) - 1
      ];
      maxcoord = [
        parseFloat(koordinater.lon) + 1,
        parseFloat(koordinater.lat) + 1
      ];
      centercoord = [parseFloat(koordinater.lon), parseFloat(koordinater.lat)];
      lng = parseFloat(koordinater.lon);
      lat = parseFloat(koordinater.lat);
    }

    // Update map position and zoom
    if (mincoord && maxcoord && centercoord) {
      this.handleSetZoomCoordinates(mincoord, maxcoord, centercoord);
    }
    // Update coordinates and infobox
    if (lng && lat) {
      this.handleInfobox(true);
      // Wait some miliseconds so the tiles are fetched before the GetFeatureInfo
      setTimeout(() => {
        if (!this.state.showExtensiveInfo) {
          this.hentInfoAlleValgteLag(lng, lat, this.state.zoom);
        } else {
          this.hentInfoAlleLag(lng, lat, this.state.zoom);
        }
      }, 250);
    }
  };

  handleMapMarkerSearch = async (lng, lat, zoom) => {
    if (this.state.lat === lat && this.state.lng === lng) return;
    this.handleLatLng(lng, lat);
    this.handleStedsNavn(lng, lat, zoom);
    this.handlePunktSok(lng, lat, zoom);
    this.handleHoydedata(lng, lat);
  };

  handleLatLng = (lng, lat) => {
    // Denne henter koordinatet og dytter det som state. Uten det kommer man ingensted.
    // Layer results are emptied when coordinates change (new click on map)
    this.setState({
      lat,
      lng,
      layersResult: {},
      allLayersResult: {}
    });
  };

  handleStedsNavn = (lng, lat, zoom) => {
    // returnerer stedsnavn som vist øverst i feltet
    backend.hentStedsnavn(lng, lat, zoom).then(sted => {
      if (!sted) return null;
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
  handleHoydedata = (lng, lat) => {
    // returnerer punkt søk
    backend.hentHoydedata(lng, lat).then(hoydedata => {
      if (hoydedata) {
        this.setState({
          elevation: hoydedata.elevation || null
        });
      }
    });
  };

  handleOneLayerSearch = (lng, lat, zoom, layerkey, sublayerkey, value) => {
    let kartlag = { ...this.state.kartlag };
    let kartlagLayer = kartlag[layerkey];
    let valgteLag = { ...this.state.valgteLag };
    let layersResult = { ...this.state.layersResult } || {};

    if (!value && !sublayerkey) {
      // Remove
      Object.keys(valgteLag[layerkey].underlag || {}).forEach(subkey => {
        if (
          valgteLag[layerkey] &&
          valgteLag[layerkey].underlag &&
          valgteLag[layerkey].underlag[subkey] &&
          !kartlagLayer.underlag[subkey].erSynlig
        ) {
          delete valgteLag[layerkey].underlag[subkey];
          const allSub = Object.keys(valgteLag[layerkey].underlag);
          if (allSub.length === 0) {
            delete valgteLag[layerkey];
          }
        }
      });
    }
    if (value && !sublayerkey) {
      // Add
      if (!valgteLag[layerkey]) {
        valgteLag[layerkey] = { ...kartlagLayer };
        valgteLag[layerkey].underlag = {};
      }
      Object.keys(kartlagLayer.underlag || {}).forEach(subkey => {
        if (
          !valgteLag[layerkey].underlag[subkey] &&
          kartlagLayer.underlag[subkey].erSynlig
        ) {
          valgteLag[layerkey].underlag[subkey] = {
            ...kartlagLayer.underlag[subkey]
          };
        }
      });
    }
    if (!value && sublayerkey) {
      // Remove agregated, add all other visible sublayers
      delete valgteLag[layerkey].underlag[sublayerkey];
      Object.keys(kartlagLayer.underlag || {}).forEach(subkey => {
        if (
          valgteLag[layerkey] &&
          valgteLag[layerkey].underlag &&
          kartlagLayer.underlag[subkey] &&
          kartlagLayer.underlag[subkey].erSynlig
        ) {
          valgteLag[layerkey].underlag[subkey] = {
            ...kartlagLayer.underlag[subkey]
          };
        }
      });
    }
    if (value && sublayerkey) {
      // Remove all other visible sublayers, add aggregated
      Object.keys(valgteLag[layerkey].underlag || {}).forEach(subkey => {
        if (
          valgteLag[layerkey] &&
          valgteLag[layerkey].underlag &&
          valgteLag[layerkey].underlag[subkey] &&
          !kartlagLayer.underlag[subkey].erSynlig
        ) {
          delete valgteLag[layerkey].underlag[subkey];
        }
      });
      valgteLag[layerkey].underlag[sublayerkey] = {
        ...kartlagLayer.underlag[sublayerkey]
      };
    }

    // Close detail in infobox if the layer has been deactivated
    const detailLayer = this.state.layerInfoboxDetails;
    if (detailLayer && detailLayer.id) {
      const valgte = valgteLag[detailLayer.id];
      if (!valgte) {
        this.setInfoboxDetailsVisible(false);
        this.setLayerInfoboxDetails(null);
      }
    }

    this.setState({ valgteLag });

    let totalFeaturesSearch = 1;
    let finishedFeaturesSearch = 0;

    // Loop though object and send request
    const layer = valgteLag[layerkey];
    if (!layer) return;
    const wmsinfoformat = layer.wmsinfoformat;
    const dataeier = layer.dataeier;
    const tema = layer.tema;
    const tags = layer.tags;
    const id = layer.id;
    if (
      wmsinfoformat === "application/vnd.ogc.gml" ||
      wmsinfoformat === "application/vnd.esri.wms_raw_xml"
    ) {
      backend
        .getFeatureInfo(layer, null, { lat, lng, zoom })
        .then(res => {
          if (res.ServiceException) {
            res.error = res.ServiceException;
            delete res.ServiceException;
          }
          finishedFeaturesSearch += 1;
          layersResult[layerkey] = sortUnderlag(res);
          layersResult[layerkey] = {
            ...layersResult[layerkey],
            dataeier,
            tema,
            tags,
            id
          };
          this.setState({ layersResult });
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            this.setState({ loadingFeatures: false });
          }
        })
        .catch(e => {
          finishedFeaturesSearch += 1;
          layersResult[layerkey] = {
            error: e.message || layerkey
          };
          layersResult[layerkey] = {
            ...layersResult[layerkey],
            dataeier,
            tema,
            tags,
            id
          };
          this.setState({ layersResult });
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            this.setState({ loadingFeatures: false });
          }
        });
    } else {
      // Use GetFeatureInfo per sublayer
      if (!valgteLag[layerkey].underlag) return;
      Object.keys(valgteLag[layerkey].underlag).forEach(subkey => {
        const sublayer = valgteLag[layerkey].underlag[subkey];
        backend
          .getFeatureInfo(layer, sublayer, { lat, lng, zoom })
          .then(res => {
            if (res.ServiceException) {
              res.error = res.ServiceException;
              delete res.ServiceException;
            }
            finishedFeaturesSearch += 1;
            if (!layersResult[layerkey]) {
              layersResult[layerkey] = { dataeier, tema, tags, id };
              layersResult[layerkey].underlag = {};
            }
            layersResult[layerkey].underlag[subkey] = sortUnderlag(res);
            this.setState({ layersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
          })
          .catch(e => {
            finishedFeaturesSearch += 1;
            if (!layersResult[layerkey]) {
              layersResult[layerkey] = { dataeier, tema, tags, id };
              layersResult[layerkey].underlag = {};
            }
            layersResult[layerkey].underlag[subkey] = {
              error: e.message || layerkey
            };
            this.setState({ layersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
          });
      });
    }

    // Visualize the loading bar after all requests have been sent (i.e. initial delay)
    if (
      Object.keys(valgteLag).length > 0 &&
      totalFeaturesSearch > finishedFeaturesSearch
    ) {
      this.setState({ loadingFeatures: true });
    }
  };

  handleLayersSearch = (lng, lat, zoom, valgteLag) => {
    // If layersResult is not empty or is equal to valgteLag,
    // do not update the state
    if (!valgteLag) return;
    const emptyLayersResult =
      Object.keys(this.state.layersResult).length === 0 &&
      this.state.layersResult.constructor === Object;

    const differenceLayersResult =
      Object.keys(this.state.layersResult).length !==
      Object.keys(valgteLag).length;

    if (!emptyLayersResult && !differenceLayersResult) {
      return;
    }

    // Close detail in infobox if the layer has been deactivated
    const detailLayer = this.state.layerInfoboxDetails;
    if (detailLayer && detailLayer.id) {
      const valgte = valgteLag[detailLayer.id];
      if (!valgte) {
        this.setInfoboxDetailsVisible(false);
        this.setLayerInfoboxDetails(null);
      }
    }

    // Denne henter utvalgte lag baser på listen layers
    // This depends/assumes that layersResults are
    // emptied when coordinates change
    const looplist = valgteLag || {};
    let layersResult = this.state.layersResult || {};

    // Remove layer results that are not in selected layers
    Object.keys(layersResult).forEach(key => {
      if (!looplist[key]) {
        delete layersResult[key];
      } else if (layersResult[key] && layersResult[key].underlag) {
        Object.keys(layersResult[key].underlag).forEach(subkey => {
          if (!looplist[key].underlag[subkey]) {
            delete layersResult[key].underlag[subkey];
          }
        });
      }
    });
    this.setState({ layersResult: layersResult });

    // Add new layer results from selected layers
    let totalFeaturesSearch = 0;
    Object.keys(looplist).forEach(key => {
      const wmsinfoformat = looplist[key].wmsinfoformat;
      const dataeier = looplist[key].dataeier;
      const tema = looplist[key].tema;
      const tags = looplist[key].tags;
      const id = looplist[key].id;
      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        // Check that at least one sublayer is queriable
        const subkeyList = Object.keys(looplist[key].underlag);
        for (let subkey of subkeyList) {
          const subLooplist = looplist[key].underlag[subkey];
          if (subLooplist.queryable || subLooplist.klikkurl !== "") {
            // Use GetFeatureInfo with list of sublayers per layer
            totalFeaturesSearch += 1;
            layersResult[key] = {
              loading: true,
              wmsinfoformat,
              dataeier,
              tema,
              tags,
              id
            };
            break;
          }
        }
      } else {
        // Use GetFeatureInfo per sublayer
        Object.keys(looplist[key].underlag).forEach(subkey => {
          const subLooplist = looplist[key].underlag[subkey];
          if (!subLooplist.queryable && subLooplist.klikkurl === "") return;
          if (!subLooplist.klikktekst || subLooplist.klikktekst === "") return;
          totalFeaturesSearch += 1;
          if (!layersResult[key]) {
            layersResult[key] = {
              wmsinfoformat,
              dataeier,
              tema,
              tags,
              id
            };
            layersResult[key].underlag = {};
          }
          if (!layersResult[key].underlag[subkey]) {
            layersResult[key].underlag[subkey] = { loading: true };
          }
        });
      }
    });

    let finishedFeaturesSearch = 0;

    // Loop though object and send request
    Object.keys(layersResult).forEach(key => {
      const layer = looplist[key];
      const wmsinfoformat = layersResult[key].wmsinfoformat;

      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        // Use GetFeatureInfo with list of sublayers per layer
        if (!layersResult[key].loading) {
          finishedFeaturesSearch += 1;
          this.setState({ layersResult });
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            this.setState({ loadingFeatures: false });
          }
          return;
        }
        backend
          .getFeatureInfo(layer, null, { lat, lng, zoom })
          .then(res => {
            if (res.ServiceException) {
              res.error = res.ServiceException;
              delete res.ServiceException;
            }
            finishedFeaturesSearch += 1;
            if (layersResult[key]) {
              layersResult[key] = {
                ...layersResult[key],
                ...res,
                loading: false
              };
            }
            this.setState({ layersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
          })
          .catch(e => {
            finishedFeaturesSearch += 1;
            if (layersResult[key]) {
              layersResult[key] = {
                ...layersResult[key],
                error: e.message || key,
                loading: false
              };
            }
            this.setState({ layersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
          });
      } else {
        // Use GetFeatureInfo per sublayer
        if (!layersResult[key].underlag) return;
        Object.keys(layersResult[key].underlag).forEach(subkey => {
          if (!layersResult[key].underlag[subkey].loading) {
            finishedFeaturesSearch += 1;
            this.setState({ layersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
            return;
          }
          const sublayer = looplist[key].underlag[subkey];
          backend
            .getFeatureInfo(layer, sublayer, { lat, lng, zoom })
            .then(res => {
              if (res.ServiceException) {
                res.error = res.ServiceException;
                delete res.ServiceException;
              }
              finishedFeaturesSearch += 1;
              if (layersResult[key]) {
                layersResult[key].underlag[subkey] = res;
              }
              this.setState({ layersResult });
              if (totalFeaturesSearch === finishedFeaturesSearch) {
                this.setState({ loadingFeatures: false });
              }
            })
            .catch(e => {
              finishedFeaturesSearch += 1;
              if (layersResult[key]) {
                layersResult[key].underlag[subkey] = {
                  error: e.message || key
                };
              }
              this.setState({ layersResult });
              if (totalFeaturesSearch === finishedFeaturesSearch) {
                this.setState({ loadingFeatures: false });
              }
            });
        });
      }
    });

    // Visualize the loading bar after all requests have been sent (i.e. initial delay)
    if (
      Object.keys(valgteLag).length > 0 &&
      totalFeaturesSearch > finishedFeaturesSearch
    ) {
      this.setState({ loadingFeatures: true });
    }
  };

  handleAllLayersSearch = (lng, lat, zoom) => {
    const emptylayersResult =
      Object.keys(this.state.allLayersResult).length === 0 &&
      this.state.allLayersResult.constructor === Object;

    if (!emptylayersResult) {
      return;
    }

    // Reset the layer results
    this.setState({
      allLayersResult: {}
    });

    // Denne henter utvalgte lag basert på listen layers
    let allLayersResult = {};
    const looplist = this.state.kartlag;
    let totalFeaturesSearch = 0;
    Object.keys(looplist).forEach(key => {
      const wmsinfoformat = looplist[key].wmsinfoformat;
      const dataeier = looplist[key].dataeier;
      const tema = looplist[key].tema;
      const tags = looplist[key].tags;
      const id = looplist[key].id;
      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        // Check that at least one sublayer is queriable
        const subkeyList = Object.keys(looplist[key].underlag);
        for (let subkey of subkeyList) {
          const subLooplist = looplist[key].underlag[subkey];
          if (subLooplist.queryable || subLooplist.klikkurl !== "") {
            // Use GetFeatureInfo with list of sublayers per layer
            totalFeaturesSearch += 1;
            allLayersResult[key] = {
              loading: true,
              wmsinfoformat,
              dataeier,
              tema,
              tags,
              id
            };
            break;
          }
        }
      } else {
        Object.keys(looplist[key].underlag).forEach(subkey => {
          const subLooplist = looplist[key].underlag[subkey];
          if (!subLooplist.queryable && subLooplist.klikkurl === "") return;
          if (!subLooplist.klikktekst || subLooplist.klikktekst === "") return;
          if (
            looplist[key].aggregatedwmslayer &&
            looplist[key].aggregatedwmslayer !== ""
          ) {
            if (
              !subLooplist.aggregatedwmslayer &&
              !subLooplist.wmslayer.toLowerCase().includes("dekningskart")
            ) {
              return;
            }
          }
          totalFeaturesSearch += 1;
          if (!allLayersResult[key]) {
            allLayersResult[key] = {
              wmsinfoformat,
              dataeier,
              tema,
              tags,
              id
            };
            allLayersResult[key].underlag = {};
          }
          if (!allLayersResult[key].underlag[subkey]) {
            allLayersResult[key].underlag[subkey] = { loading: true };
          }
        });
      }
    });

    let finishedFeaturesSearch = 0;

    // // Set an interval to update state
    // const updateLayers = setInterval(() => {
    //   if (totalFeaturesSearch > finishedFeaturesSearch) {
    //     this.setState({ allLayersResult });
    //   }
    // }, 1500);

    // Loop though object and send request
    Object.keys(allLayersResult).forEach(key => {
      const layer = looplist[key];
      const wmsinfoformat = allLayersResult[key].wmsinfoformat;

      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        if (!allLayersResult[key].loading) {
          finishedFeaturesSearch += 1;
          this.setState({ allLayersResult });
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            // clearInterval(updateLayers);
            this.setState({ loadingFeatures: false });
          }
          return;
        }
        backend
          .getFeatureInfo(layer, null, { lat, lng, zoom })
          .then(res => {
            if (res.ServiceException) {
              res.error = res.ServiceException;
              delete res.ServiceException;
            }
            finishedFeaturesSearch += 1;
            allLayersResult[key] = {
              ...allLayersResult[key],
              ...res,
              loading: false
            };
            this.setState({ allLayersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              this.setState({ loadingFeatures: false });
            }
          })
          .catch(e => {
            finishedFeaturesSearch += 1;
            allLayersResult[key] = {
              ...allLayersResult[key],
              error: e.message || key,
              loading: false
            };
            this.setState({ allLayersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              // clearInterval(updateLayers);
              this.setState({ loadingFeatures: false });
            }
          });
      } else {
        if (!allLayersResult[key].underlag) return;
        Object.keys(allLayersResult[key].underlag).forEach(subkey => {
          if (!allLayersResult[key].underlag[subkey].loading) {
            finishedFeaturesSearch += 1;
            this.setState({ allLayersResult });
            if (totalFeaturesSearch === finishedFeaturesSearch) {
              // clearInterval(updateLayers);
              this.setState({ loadingFeatures: false });
            }
            return;
          }
          const sublayer = looplist[key].underlag[subkey];

          backend
            .getFeatureInfo(layer, sublayer, { lat, lng, zoom })
            .then(res => {
              if (res.ServiceException) {
                res.error = res.ServiceException;
                delete res.ServiceException;
              }
              finishedFeaturesSearch += 1;
              allLayersResult[key].underlag[subkey] = res;
              this.setState({ allLayersResult });
              if (totalFeaturesSearch === finishedFeaturesSearch) {
                // clearInterval(updateLayers);
                this.setState({ loadingFeatures: false });
              }
            })
            .catch(e => {
              finishedFeaturesSearch += 1;
              allLayersResult[key].underlag[subkey] = {
                error: e.message || key
              };
              this.setState({ allLayersResult });
              if (totalFeaturesSearch === finishedFeaturesSearch) {
                // clearInterval(updateLayers);
                this.setState({ loadingFeatures: false });
              }
            });
        });
      }
    });
    // Visualize the loading bar after all requests have been sent (i.e. initial delay)
    if (totalFeaturesSearch > finishedFeaturesSearch) {
      this.setState({ loadingFeatures: true });
    }
  };

  hentInfoAlleValgteLag = async (lng, lat, zoom) => {
    let kartlag = this.state.kartlag;
    let valgteLag = {};
    for (let i in kartlag) {
      if (kartlag[i].erSynlig) {
        let lag = { ...kartlag[i], underlag: {} };
        for (let j in kartlag[i].underlag) {
          if (kartlag[i].underlag[j].erSynlig) {
            lag.underlag[j] = kartlag[i].underlag[j];
          }
        }
        valgteLag[i] = lag;
      }
    }
    this.setState({ valgteLag: valgteLag });
    await this.handleMapMarkerSearch(lng, lat, zoom);
    this.handleLayersSearch(lng, lat, zoom, valgteLag);
  };

  hentInfoAlleLag = async (lng, lat, zoom) => {
    await this.handleMapMarkerSearch(lng, lat, zoom);
    this.handleAllLayersSearch(lng, lat, zoom);
  };

  handleForvaltningsLayerProp = (layerkey, key, value, update = false) => {
    if (update) {
      // Only update getFeatureInfo
      if (this.state.lat && this.state.lng && !this.state.showExtensiveInfo) {
        this.handleOneLayerSearch(
          this.state.lng,
          this.state.lat,
          this.state.zoom,
          layerkey,
          key,
          value
        );
      }
      return;
    }

    let nye_lag = { ...this.state.kartlag };
    const layer = nye_lag[layerkey];
    if (!layer) {
      return;
    }
    setValue(layer, key, value);

    let layerVisible = false;
    let numberVisible = 0;
    for (const sublayerId in layer.underlag) {
      const sublayer = layer.underlag[sublayerId];
      if (
        (sublayer.erSynlig || sublayer.visible) &&
        layer.allcategorieslayer.wmslayer !== sublayer.wmslayer
      ) {
        layerVisible = true;
        numberVisible += 1;
      }
    }
    if (layerVisible) {
      setValue(layer, "erSynlig", true);
      setValue(layer, "numberVisible", numberVisible);
    } else {
      setValue(layer, "erSynlig", false);
      setValue(layer, "numberVisible", numberVisible);
    }
    // Update also selected layers from search bar
    if (this.state.valgtLag) {
      setValue(this.state.valgtLag, "numberVisible", numberVisible);
    }

    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  // Relevant for switching between all layers and favourite layers
  changeVisibleSublayers = sublayersArray => {
    let array;
    if (this.state.showFavoriteLayers) {
      array = [...this.state.visibleSublayersFavorites];
    } else {
      array = [...this.state.visibleSublayersComplete];
    }

    for (const sub of sublayersArray) {
      if (sub.add) {
        array.push({
          layerKey: sub.layerKey,
          sublayerKey: sub.sublayerKey,
          propKeys: sub.propKeys
        });
      } else {
        array = array.filter(
          item =>
            item.layerKey !== sub.layerKey ||
            item.sublayerKey !== sub.sublayerKey
        );
      }
    }

    if (this.state.showFavoriteLayers) {
      this.setState({ visibleSublayersFavorites: array });
    } else {
      this.setState({ visibleSublayersComplete: array });
    }
  };

  handleSetBakgrunnskart = (key, value) => {
    let bakgrunnskart = this.state.bakgrunnskart;
    setValue(bakgrunnskart, key, value);
    this.setState({
      bakgrunnskart: Object.assign({}, bakgrunnskart)
    });
  };

  handleSideBar = show => {
    this.setState({ showSideBar: show });
  };

  handleInfobox = bool => {
    this.setState({ showInfobox: bool });
  };

  handleFullscreenInfobox = show => {
    this.setState({ showFullscreenInfobox: show });
  };

  handleZoomChange = zoom => {
    this.setState({ zoom: zoom });
  };

  updateIsMobile = isMobile => {
    this.setState({ isMobile });
  };

  onTileStatus = (layerkey, sublayerkey, status) => {
    let nye_lag = this.state.kartlag;
    const layer = nye_lag[layerkey];
    if (sublayerkey === layer.allcategorieslayer.id) {
      Object.keys(layer.underlag).forEach(subkey => {
        const sublayer = layer.underlag[subkey];
        const isDekkningKart = sublayer.wmslayer
          .toLowerCase()
          .includes("dekningskart");
        if (status === "error" && !isDekkningKart) {
          const code = "underlag." + subkey + ".tileerror";
          setValue(layer, code, true);
        }
        if (status === "loading" && !isDekkningKart) {
          const code = "underlag." + subkey + ".tileerror";
          setValue(layer, code, false);
        }
      });
    } else {
      if (status === "error") {
        const code = "underlag." + sublayerkey + ".tileerror";
        setValue(layer, code, true);
      }
      if (status === "loading") {
        const code = "underlag." + sublayerkey + ".tileerror";
        setValue(layer, code, false);
      }
    }

    this.setState({
      kartlag: Object.assign({}, nye_lag)
    });
  };

  handleSortKey = sortKey => {
    this.setState({ sortKey });
  };

  handleTagFilter = tagFilter => {
    this.setState({ tagFilter });
  };

  handleMatchAllFilters = matchAllFilters => {
    this.setState({ matchAllFilters });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
