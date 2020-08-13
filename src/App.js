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
import { sortKartlag } from "./Funksjoner/sortObject";
import "./style/kartknapper.css";
import db from "./IndexedDB/IndexedDB";
import {
  updateLayersIndexedDB,
  removeUnusedLayersIndexedDB
} from "./IndexedDB/ActionsIndexedDB";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bakgrunnskart,
      completeKartlag: {},
      favoriteKartlag: {},
      kartlag: {},
      valgteLag: {},
      actualBounds: null,
      fitBounds: null,
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
      showSideBar: true,
      showInfobox: false,
      editable: true,
      sted: null,
      adresse: null,
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
      legendVisible: false,
      showSmallInfobox: false,
      showFullscreenSideBar: false
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

      k.underlag = k.underlag || {};
      k.underlag = Object.values(k.underlag).reduce((acc, ul) => {
        ul.key = ul.id;
        ul.id = alphaNumericOnly(k.tittel) + "_" + alphaNumericOnly(ul.tittel);
        ul.opacity = 0.8;
        acc[ul.id] = ul;
        listFavoriteSublayerIds.push(ul.key);

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
                      />
                    )}
                    <div
                      className={
                        this.state.editLayersMode ? "hidden-app-content" : ""
                      }
                    >
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
                        showExtensiveInfo={this.state.showExtensiveInfo}
                        handleExtensiveInfo={this.handleExtensiveInfo}
                        handleAlleLag={this.hentInfoAlleLag}
                        handleValgteLag={this.hentInfoValgteLag}
                        forvaltningsportal={true}
                        show_current={this.state.showCurrent}
                        bounds={this.state.fitBounds}
                        latitude={65.4}
                        longitude={15.8}
                        zoom={this.state.zoom}
                        handleZoomChange={this.handleZoomChange}
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
                        showInfobox={this.state.showInfobox}
                        handleInfobox={this.handleInfobox}
                        loadingFeatures={this.state.loadingFeatures}
                        showSideBar={this.state.showSideBar}
                        showSmallInfobox={this.state.showSmallInfobox}
                        handleSmallInfobox={this.handleSmallInfobox}
                        {...this.state}
                      />
                      <KartVelger
                        onUpdateLayerProp={this.handleSetBakgrunnskart}
                        aktivtFormat={basiskart.kart.aktivtFormat}
                        showSideBar={this.state.showSideBar}
                        showInfobox={this.state.showInfobox}
                        showSmallInfobox={this.state.showSmallInfobox}
                      />
                      <SearchBar
                        onSelectSearchResult={this.handleSelectSearchResult}
                        searchResultPage={this.state.searchResultPage}
                        setKartlagSearchResults={
                          this.handleSetKartlagSearchResult
                        }
                        setGeoSearchResults={this.setGeoSearchResults}
                        handleGeoSelection={this.handleGeoSelection}
                        kartlag={this.state.kartlag}
                        addValgtLag={this.handleNavigateToKartlag}
                        removeValgtLag={this.removeValgtLag}
                        handleSetZoomCoordinates={this.handleSetZoomCoordinates}
                        onUpdateLayerProp={this.handleForvaltningsLayerProp}
                        toggleEditLayers={this.toggleEditLayers}
                        showFavoriteLayers={this.state.showFavoriteLayers}
                        toggleShowFavoriteLayers={this.toggleShowFavoriteLayers}
                      />
                      <KartlagFanen
                        polygon={this.state.polygon}
                        addPolygon={this.addPolygon}
                        hideAndShowPolygon={this.hideAndShowPolygon}
                        handleEditable={this.handleEditable}
                        showPolygon={this.state.showPolygon}
                        polyline={this.state.polyline}
                        addPolyline={this.addPolyline}
                        searchResultPage={this.state.searchResultPage}
                        addValgtLag={this.handleNavigateToKartlag}
                        removeValgtLag={this.removeValgtLag}
                        valgtLag={this.state.valgtLag}
                        onUpdateLayerProp={this.handleForvaltningsLayerProp}
                        changeVisibleSublayers={this.changeVisibleSublayers}
                        changeExpandedLayers={this.changeExpandedLayers}
                        kartlag={this.state.kartlag}
                        showSideBar={this.state.showSideBar}
                        toggleSideBar={this.toggleSideBar}
                        zoom={this.state.zoom}
                        sublayerDetailsVisible={
                          this.state.sublayerDetailsVisible
                        }
                        setSublayerDetailsVisible={
                          this.setSublayerDetailsVisible
                        }
                        legendVisible={this.state.legendVisible}
                        setLegendVisible={this.setLegendVisible}
                        showFullscreenSideBar={this.state.showFullscreenSideBar}
                        toggleFullscreenSideBar={this.toggleFullscreenSideBar}
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
        this.handleForvaltningsLayerProp(item.layerKey, item.propKey, true);
      }
    } else {
      for (const item of this.state.visibleSublayersComplete) {
        this.handleForvaltningsLayerProp(item.layerKey, item.propKey, true);
      }
    }
  };

  hideVisibleLayers = async favorites => {
    if (favorites) {
      for (const item of this.state.visibleSublayersComplete) {
        this.handleForvaltningsLayerProp(item.layerKey, item.propKey, false);
      }
    } else {
      for (const item of this.state.visibleSublayersFavorites) {
        this.handleForvaltningsLayerProp(item.layerKey, item.propKey, false);
      }
    }
  };

  updateFavoriteLayers = async completeKartlag => {
    const favoriteKartlag = this.reduceKartlag(completeKartlag);
    this.setState({ completeKartlag, favoriteKartlag });
    const favorites = this.state.showFavoriteLayers;
    if (favorites) {
      this.hideVisibleLayers(favorites).then(() => {
        this.setState({ kartlag: favoriteKartlag }, () => {
          this.showVisibleLayers(favorites);
        });
      });
    } else {
      this.hideVisibleLayers(favorites).then(() => {
        this.setState({ kartlag: completeKartlag }, () => {
          this.showVisibleLayers(favorites);
        });
      });
    }
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

  removeValgtLag = () => {
    this.setState({ valgtLag: null });
  };

  handleSelectSearchResult = searchResultPage => {
    this.setState({ searchResultPage: searchResultPage });
  };

  setGeoSearchResults = geoSearchResults => {
    this.setState({ geoSearchResults: geoSearchResults });
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

  handleMapMarkerSearch = (lng, lat, zoom) => {
    if (this.state.lat === lat && this.state.lng === lng) return;
    this.handleLatLng(lng, lat);
    this.handleStedsNavn(lng, lat, zoom);
    this.handlePunktSok(lng, lat, zoom);
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

  handleLayersSearch = (lng, lat, zoom, valgteLag) => {
    // If layersResult is not empty or is equal to valgteLag,
    // do not update the state
    const emptyLayersResult =
      Object.keys(this.state.layersResult).length === 0 &&
      this.state.layersResult.constructor === Object;

    const differenceLayersResult =
      Object.keys(this.state.layersResult).length !==
      Object.keys(valgteLag).length;

    if (!emptyLayersResult && !differenceLayersResult) {
      return;
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
      }
    });
    this.setState({ layersResult: layersResult });

    // Add new layer results from selected layers
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikktekst) return;
      if (layersResult[key]) return;
      layersResult[key] = { loading: true };
    });

    const totalFeaturesSearch = Object.keys(layersResult).length;
    let finishedFeaturesSearch = 0;

    // Set an interval to update state
    const updateLayers = setInterval(() => {
      if (totalFeaturesSearch > finishedFeaturesSearch) {
        this.setState({ layersResult });
      }
    }, 1500);

    // Loop though object and send request
    Object.keys(layersResult).forEach(key => {
      if (!layersResult[key].loading) {
        finishedFeaturesSearch += 1;
        if (totalFeaturesSearch === finishedFeaturesSearch) {
          clearInterval(updateLayers);
          this.setState({ loadingFeatures: false });
        }
        return;
      }
      const layer = looplist[key];
      backend
        .getFeatureInfo(layer, { lat, lng, zoom })
        .then(res => {
          if (res.ServiceException) {
            res.error = res.ServiceException;
            delete res.ServiceException;
          }
          finishedFeaturesSearch += 1;
          layersResult[key] = res;
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            clearInterval(updateLayers);
            this.setState({ loadingFeatures: false, layersResult });
          }
        })
        .catch(e => {
          finishedFeaturesSearch += 1;
          layersResult[key] = { error: e.message || key };
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            clearInterval(updateLayers);
            this.setState({ loadingFeatures: false, layersResult });
          }
        });
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

    // Denne henter utvalgte lag baser på listen layers
    let allLayersResult = {};
    let looplist = this.state.kartlag;
    Object.keys(looplist).forEach(key => {
      if (!looplist[key].klikktekst) return;
      allLayersResult[key] = { loading: true };
    });
    const totalFeaturesSearch = Object.keys(allLayersResult).length;
    let finishedFeaturesSearch = 0;

    // Set an interval to update state
    const updateLayers = setInterval(() => {
      if (totalFeaturesSearch > finishedFeaturesSearch) {
        this.setState({ allLayersResult });
      }
    }, 1500);

    // Loop though object and send request
    Object.keys(allLayersResult).forEach(key => {
      const layer = looplist[key];
      backend
        .getFeatureInfo(layer, { lat, lng, zoom })
        .then(res => {
          if (res.ServiceException) {
            res.error = res.ServiceException;
            delete res.ServiceException;
          }
          finishedFeaturesSearch += 1;
          allLayersResult[key] = res;
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            clearInterval(updateLayers);
            this.setState({ loadingFeatures: false, allLayersResult });
          }
        })
        .catch(e => {
          finishedFeaturesSearch += 1;
          allLayersResult[key] = { error: e.message || key };
          if (totalFeaturesSearch === finishedFeaturesSearch) {
            clearInterval(updateLayers);
            this.setState({ loadingFeatures: false, allLayersResult });
          }
        });
    });
    // Visualize the loading bar after all requests have been sent (i.e. initial delay)
    if (totalFeaturesSearch > finishedFeaturesSearch) {
      this.setState({ loadingFeatures: true });
    }
  };

  hentInfoValgteLag = async (lng, lat, zoom) => {
    let kartlag = this.state.kartlag;
    let valgteLag = {};
    for (let i in kartlag) {
      if (kartlag[i].erSynlig) valgteLag[i] = kartlag[i];
    }
    this.setState({ valgteLag: valgteLag });
    this.handleMapMarkerSearch(lng, lat, zoom);
    this.handleLayersSearch(lng, lat, zoom, valgteLag);
  };

  hentInfoAlleLag = async (lng, lat, zoom) => {
    this.handleMapMarkerSearch(lng, lat, zoom);
    this.handleAllLayersSearch(lng, lat, zoom);
  };

  handleForvaltningsLayerProp = (layerkey, key, value) => {
    let nye_lag = this.state.kartlag;
    const layer = nye_lag[layerkey];
    if (!layer) {
      return;
    }
    setValue(layer, key, value);

    let layerVisible = false;
    let numberVisible = 0;
    for (const sublayerId in layer.underlag) {
      if (layer.underlag[sublayerId].erSynlig) {
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

    if (
      this.state.lat &&
      this.state.lng &&
      this.state.showInfobox &&
      !this.state.showExtensiveInfo
    ) {
      this.hentInfoValgteLag(this.state.lng, this.state.lat, this.state.zoom);
    }
  };

  changeVisibleSublayers = (layerKey, sublayerKey, propKey, visible) => {
    if (this.state.showFavoriteLayers) {
      let array = [...this.state.visibleSublayersFavorites];
      if (visible) {
        array.push({ layerKey, sublayerKey, propKey });
      } else {
        array = array.filter(
          item => item.layerKey !== layerKey || item.sublayerKey !== sublayerKey
        );
      }
      this.setState({ visibleSublayersFavorites: array });
    } else {
      let array = [...this.state.visibleSublayersComplete];
      if (visible) {
        array.push({ layerKey, sublayerKey, propKey });
      } else {
        array = array.filter(
          item => item.layerKey !== layerKey || item.sublayerKey !== sublayerKey
        );
      }
      this.setState({ visibleSublayersComplete: array });
    }
  };

  // Stored but not being used: Problems when updating state (no changes)
  changeExpandedLayers = (layerKey, expanded) => {
    if (this.state.showFavoriteLayers) {
      let array = [...this.state.expandedLayersFavorites];
      if (expanded) {
        array.push(layerKey);
      } else {
        array = array.filter(item => item !== layerKey);
      }
      this.setState({ expandedLayersFavorites: array });
    } else {
      let array = [...this.state.expandedLayersComplete];
      if (expanded) {
        array.push(layerKey);
      } else {
        array = array.filter(item => item !== layerKey);
      }
      this.setState({ expandedLayersComplete: array });
    }
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

  toggleFullscreenSideBar = () => {
    this.setState({ showFullscreenSideBar: !this.state.showFullscreenSideBar });
  };

  handleInfobox = bool => {
    this.setState({ showInfobox: bool });
  };

  handleSmallInfobox = show => {
    this.setState({ showSmallInfobox: show });
  };

  handleZoomChange = zoom => {
    this.setState({ zoom: zoom });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);
