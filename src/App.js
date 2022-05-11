import React from "react";
import { withRouter } from "react-router";
import { SettingsContext } from "./SettingsContext";
import backend from "./Funksjoner/backend";
import KartlagFanen from "./Okologiskegrunnkart/KartlagFanen";
import SearchBar from "./Okologiskegrunnkart/SearchBar/SearchBar";
import Kart from "./Kart/Leaflet";
import KartlagSettings from "./Settings/KartlagSettings";
import AuthenticationContext from "./AuthenticationContext";
import bakgrunnskart from "./Kart/Bakgrunnskart/bakgrunnskarttema";
import CookieWarning from "./Okologiskegrunnkart/CookieWarning";
import { setValue } from "./Funksjoner/setValue";
import {
  initialKartlagSort,
  sortKartlag,
  sortUnderlag,
  kartlagByEnvironment
} from "./Funksjoner/kartlagTools";
import "./style/kartknapper.css";
import db from "./IndexedDB/IndexedDB";
import {
  updateLayersIndexedDB,
  removeUnusedLayersIndexedDB,
  savePolygonIndexedDB,
  getPolygonsIndexedDB,
  deletePolygonIndexedDB,
  updatePolygonIndexedDB
} from "./IndexedDB/ActionsIndexedDB";
import proj4 from "proj4";
import {
  getPolygonDepth,
  sortPolygonCoord,
  transformUploadedPolygon
} from "./Funksjoner/polygonTools";
import AppName from "./Okologiskegrunnkart/AppName";
import getProjection from "./Funksjoner/getProjection";

class App extends React.Component {
  state = {
    bakgrunnskart,
    completeKartlag: {},
    favoriteKartlag: {},
    kartlag: { aa: {} },
    allSublayers: {},
    valgteLag: {},
    navigation_history: [],
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
    matrikkel: null,
    elevation: null,
    layersResult: {},
    allLayersResult: {},
    zoom: 3.1,
    lat: null,
    lng: null,
    loadingFeatures: false,
    editLayersMode: false,
    someLayersFavorite: "none",
    listFavoriteLayerIds: [],
    listFavoriteSublayerIds: [],
    showFavoriteLayers: false,
    visibleSublayersFavorites: [],
    visibleSublayersComplete: [],
    expandedLayersFavorites: [],
    expandedLayersComplete: [],
    sublayerDetailsVisible: false,
    infoboxDetailsVisible: false,
    polygonDetailsVisible: false,
    layerInfoboxDetails: null,
    legendVisible: false,
    legendPosition: "right",
    showFullscreenInfobox: false,
    isMobile: false,
    windowHeight: 0,
    showMarker: true,
    sortKey: "tema",
    tagFilter: {},
    matchAllFilters: true,
    resultat: null,
    fylkeGeom: null,
    showFylkeGeom: false,
    kommuneGeom: null,
    showKommuneGeom: false,
    eiendomGeom: null,
    showEiendomGeom: false,
    grensePolygon: "none",
    grensePolygonGeom: null,
    fylkePolygon: null,
    showFylkePolygon: true,
    kommunePolygon: null,
    showKommunePolygon: true,
    eiendomPolygon: null,
    showEiendomPolygon: true,
    grensePolygonData: {},
    automaticZoomUpdate: false,
    trefftype: null,
    treffitemtype: null,
    showAppName: true,
    showAboutModal: false,
    aboutPage: null,
    updateChangeInUrl: false,
    showPolygonSaveModal: false,
    polygonActionResult: null,
    changeInfoboxState: null,
    showSavedPolygons: false,
    savedPolygons: []
  };

  // ------------------------------------------------------------------------------------- //
  // ---------------------------------- SET UP KARTLAG ----------------------------------- //
  // ------------------------------------------------------------------------------------- //
  async lastNedKartlag() {
    // Run hard refresh the first time page is loaded
    if (!window.location.hash) {
      window.location = window.location + "#/";
      window.location.reload();
    }

    // Get environment based on URL
    let env = "test";
    const host = window.location.host;
    const hostname = window.location.hostname;
    if (host === "okologiskegrunnkart.artsdatabanken.no") env = "prod";
    if (hostname === "localhost") env = "local";

    // Get layers from URL
    const urlParams = new URLSearchParams(window.location.search);
    let urlLayers = urlParams.get("layers");
    if (urlLayers) {
      urlLayers = JSON.parse("[" + urlLayers + "]");
    }

    // Get favorites from URL
    let urlFavorites = urlParams.get("favorites");
    if (urlFavorites) {
      urlFavorites = JSON.parse(urlFavorites);
    }

    // Get kartlag.json file from server as default, except for localhost
    let kartlag = await backend.hentLokalFil("/kartlag.json");
    // When not possible, get local kartlag.json file from test server
    if (!kartlag || env === "local") {
      kartlag = await backend.hentLokalFil(
        "https://okologiskegrunnkart.test.artsdatabanken.no/kartlag.json"
      );
    }
    // If none of the above work, load the preview file
    if (!kartlag) {
      console.error(
        "Du har ikke opprettet databasen og hentet ned datadump, og blir derfor vist et testdatasett."
      );
      kartlag = await backend.hentLokalFil("/kartlag_preview.json");
      console.error(
        "Gå til https://github.com/Artsdatabanken/okologiskegrunnkart/wiki/Databaseoppsett for mer informasjon"
      );
    }

    const alphaNumericOnly = s => s.replace(/[^a-zA-Z0-9]/g, "");

    // Get layers and sublayers from indexed DB
    const layersdb = await db.layers.toArray();
    const sublayersdb = await db.sublayers.toArray();
    const listFavoriteLayerIds = [];
    const listFavoriteSublayerIds = [];

    // Initial sorting and selection of sublayers based on environment
    kartlag = initialKartlagSort(kartlag);
    kartlag = kartlagByEnvironment(kartlag, env);

    // Modify and store kartlag in state
    let allSublayers = {};
    let someLayersFavorite = "none";
    let allLayersFavorite = true;
    let showFavoriteLayers = false;
    let urlLayersInFavorites = null;
    if (urlLayers !== null) urlLayersInFavorites = true;
    Object.entries(kartlag).forEach(async ([key, k]) => {
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

      if (someLayersFavorite === "none" && k.favorite) {
        someLayersFavorite = "some";
      }
      if (allLayersFavorite && !k.favorite) {
        allLayersFavorite = false;
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
      let aggFaktaark = {};
      let aggKey = null;

      k.underlag = k.underlag || {};
      k.underlag = Object.values(k.underlag).reduce((acc, ul) => {
        ul.key = ul.id;
        ul.id = alphaNumericOnly(k.tittel) + "_" + alphaNumericOnly(ul.tittel);
        ul.opacity = 0.8;
        acc[ul.id] = ul;
        listFavoriteSublayerIds.push(ul.key);
        ul.tileerror = false;
        ul.erSynlig = false;

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
          if (ul.faktaark && ul.faktaark.length > 0) {
            aggFaktaark = {
              ...aggFaktaark,
              [ul.id]: ul.faktaark
            };
          }
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

        // Create list of sublayers for update with URL
        const subVisible = {
          layerKey: k.id,
          sublayerKey: ul.id,
          favorite: ul.favorite,
          aggregated: ul.wmslayer === k.aggregatedwmslayer
        };
        allSublayers = { ...allSublayers, [ul.key]: subVisible };

        // Check if layers is in URL layers and in favorites
        if (urlLayersInFavorites && urlLayers && urlLayers.includes(ul.key)) {
          if (!ul.favorite) urlLayersInFavorites = false;
        }

        // Set favourites state
        if (someLayersFavorite === "none" && ul.favorite) {
          someLayersFavorite = "some";
        }
        if (allLayersFavorite && !ul.favorite) {
          allLayersFavorite = false;
        }
        if (!showFavoriteLayers && ul.favorite) {
          showFavoriteLayers = true;
        }

        return acc;
      }, {});
      if (aggKey) {
        k.allcategorieslayer.klikktekst = { [aggKey]: aggClickText };
        k.allcategorieslayer.klikktekst2 = { [aggKey]: aggClickText2 };
        k.allcategorieslayer.faktaark = { [aggKey]: aggFaktaark };
      }
    });

    // Set list of all sublayers
    this.setState({ allSublayers });

    // Set favorites in state
    if (allLayersFavorite) someLayersFavorite = "all";
    if (urlFavorites === false || urlLayersInFavorites === false) {
      this.setState({ someLayersFavorite, showFavoriteLayers: false });
    } else {
      this.setState({ someLayersFavorite, showFavoriteLayers });
    }

    // Sort kartlag object aplhabetically based on title.
    // Sublayers are ordered alphabetically or based on position.
    const sortedKartlag = sortKartlag(kartlag);

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

  // ------------------------------------------------------------------------------------- //
  // -------------------------------- LIFECYCLE HOOKS ------------------------------------ //
  // ------------------------------------------------------------------------------------- //
  async componentDidMount() {
    await this.lastNedKartlag();
    removeUnusedLayersIndexedDB(
      this.state.listFavoriteLayerIds,
      this.state.listFavoriteSublayerIds
    );

    // Update URL
    const urlParams = new URLSearchParams(window.location.search);
    let lat = urlParams.get("lat");
    let lng = urlParams.get("lng");
    let layers = urlParams.get("layers");
    let latUrlString = "";
    if (lat && lng) {
      latUrlString = "?lng=" + lng + "&lat=" + lat;
    }
    let layersUrlString = "";
    if (lat && lng && layers) {
      layersUrlString = "&layers=" + layers;
    } else if ((!lat || !lng) && layers) {
      layersUrlString = "?layers=" + layers;
    }
    // When mounted, favorites is updated based on the real value
    // from state, since this is calulated when loading kartlag
    let favoritesUrlString;
    if ((lat && lng) || layers) {
      favoritesUrlString = "&favorites=" + this.state.showFavoriteLayers;
    } else {
      favoritesUrlString = "?favorites=" + this.state.showFavoriteLayers;
    }
    this.props.history.push(
      latUrlString + layersUrlString + favoritesUrlString
    );

    this.handleUpdateChangeInUrl(true);
    this.updateLocationFromUrl(urlParams);
    this.updateLayersFromUrl(urlParams);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isFylke(prevState)) {
      const geom = this.state.fylkeGeom;
      this.updateZoomWithGeometry(geom, "Fylke");
      this.setState({ automaticZoomUpdate: false });
    }
    if (this.isKommune(prevState)) {
      const geom = this.state.kommuneGeom;
      this.updateZoomWithGeometry(geom, "Kommune");
      this.setState({ automaticZoomUpdate: false });
    }
    if (this.isEiendom(prevState)) {
      const geom = this.state.eiendomGeom;
      this.updateZoomWithGeometry(geom, "Eiendom");
      this.setState({ automaticZoomUpdate: false });
    }
    if (this.isStedsnavn(prevState)) {
      const geom = this.state.eiendomGeom;
      this.updateZoomWithGeometry(geom, "Stedsnavn");
      this.setState({ automaticZoomUpdate: false });
    }
    if (
      this.state.updateChangeInUrl &&
      this.props.location !== prevProps.location
    ) {
      const urlParams = new URLSearchParams(this.props.location.search);
      this.updateFavoritesFromUrl(urlParams).then(() => {
        this.updateLocationFromUrl(urlParams);
        this.updateLayersFromUrl(urlParams);
      });
    }
  }

  // ------------------------------------------------------------------------------------- //
  // ----------------------- ACTIONS RUN WITH UPDATE LIFECYCLE HOOK ---------------------- //
  // ------------------------------------------------------------------------------------- //
  isFylke = prevState => {
    if (
      this.state.fylkeGeom !== prevState.fylkeGeom &&
      this.state.treffitemtype === "Fylke" &&
      this.state.automaticZoomUpdate
    ) {
      return true;
    }
    return false;
  };

  isKommune = prevState => {
    if (
      this.state.kommuneGeom !== prevState.kommuneGeom &&
      this.state.automaticZoomUpdate &&
      (this.state.treffitemtype === "Kommune" ||
        this.state.treffitemtype === "By")
    ) {
      return true;
    }
    return false;
  };

  isEiendom = prevState => {
    if (
      this.state.eiendomGeom !== prevState.eiendomGeom &&
      this.state.automaticZoomUpdate &&
      (this.state.trefftype.includes("KNR") ||
        this.state.trefftype.includes("GNR") ||
        this.state.trefftype.includes("BNR") ||
        this.state.trefftype === "Adresse")
    ) {
      return true;
    }
    return false;
  };

  isStedsnavn = prevState => {
    if (
      this.state.eiendomGeom !== prevState.eiendomGeom &&
      this.state.automaticZoomUpdate &&
      this.state.trefftype === "Stedsnavn" &&
      this.state.treffitemtype !== "Fylke" &&
      this.state.treffitemtype !== "Kommune" &&
      this.state.treffitemtype !== "By"
    ) {
      return true;
    }
    return false;
  };

  updateZoomWithGeometry = (geom, type = null) => {
    if (!geom || geom.length === 0) return;
    const depth = getPolygonDepth(geom);
    let maxLat = 0;
    let minLat = 9999999999;
    let maxLng = 0;
    let minLng = 9999999999;
    if (depth === 2) {
      for (const coord of geom) {
        if (coord[0] > maxLat) maxLat = coord[0];
        if (coord[0] < minLat) minLat = coord[0];
        if (coord[1] > maxLng) maxLng = coord[1];
        if (coord[1] < minLng) minLng = coord[1];
      }
    } else if (depth === 3) {
      for (const coord of geom[0]) {
        if (coord[0] > maxLat) maxLat = coord[0];
        if (coord[0] < minLat) minLat = coord[0];
        if (coord[1] > maxLng) maxLng = coord[1];
        if (coord[1] < minLng) minLng = coord[1];
      }
    } else if (depth === 4) {
      for (const poly of geom) {
        for (const coord of poly[0]) {
          if (coord[0] > maxLat) maxLat = coord[0];
          if (coord[0] < minLat) minLat = coord[0];
          if (coord[1] > maxLng) maxLng = coord[1];
          if (coord[1] < minLng) minLng = coord[1];
        }
      }
    } else return;
    let margin = 0.02;
    if (type === "Eiendom") margin = 0.1;
    if (type === "Stedsnavn") margin = 0.2;
    const diffLng = (maxLng - minLng) * margin;
    const diffLat = (maxLat - minLat) * margin;
    const mincoord = [minLng - diffLng, minLat - diffLat];
    const maxcoord = [maxLng + diffLng, maxLat + diffLat];
    if (mincoord && maxcoord) {
      this.handleSetZoomCoordinates(mincoord, maxcoord);
    }
  };

  updateFavoritesFromUrl = async urlParams => {
    let favorites = urlParams.get("favorites");
    if (favorites) {
      favorites = JSON.parse(favorites);
    }

    if (favorites !== null && favorites !== this.state.showFavoriteLayers) {
      this.setState({
        showFavoriteLayers: favorites,
        sublayerDetailsVisible: false,
        legendVisible: false
      });

      // Update visible layers if favorites has changed in URL
      // Has to be done here because update layers from URL
      // won't see any changes
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
    }
  };

  updateLocationFromUrl = urlParams => {
    let lat = urlParams.get("lat");
    let lng = urlParams.get("lng");
    if (lat && lng) {
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      if (lat !== this.state.lat && lng !== this.state.lng) {
        this.handleCoordinatesUrl(lat, lng);
      }
    } else {
      this.setState({ lat: null, lng: null });
    }
  };

  updateLayersFromUrl = urlParams => {
    let layers = urlParams.get("layers");
    let previousLayers = [];
    if (this.state.showFavoriteLayers) {
      previousLayers = this.state.visibleSublayersFavorites;
    } else {
      previousLayers = this.state.visibleSublayersComplete;
    }
    if (layers) {
      // Layers defined in URL
      const allSublayers = this.state.allSublayers;
      layers = JSON.parse("[" + layers + "]");

      // Find all layers
      const listLayers = this.getKartlagLayersUrl(layers, allSublayers);

      // Find all sublayers in a layer and
      // layers with aggregated sublayers
      const { layerHierarchy, layerAggregated } = this.getAllSublayersUrl(
        layers,
        listLayers
      );

      // Create array with visble sublayers
      const array = this.getVisibleSublayersUrl(
        layers,
        allSublayers,
        layerHierarchy,
        layerAggregated
      );

      if (this.state.showFavoriteLayers) {
        if (
          JSON.stringify(this.state.visibleSublayersFavorites) ===
          JSON.stringify(array)
        )
          return;
        this.toggleShowLayersUrl(array);
      } else {
        if (
          JSON.stringify(this.state.visibleSublayersComplete) ===
          JSON.stringify(array)
        )
          return;
        this.toggleShowLayersUrl(array);
      }
    } else if (previousLayers.length > 0) {
      // No layers in URL, but there were before (e.g. changed url in browser)
      this.toggleShowLayersUrl([]);
    }
  };

  getKartlagLayersUrl = (layers, allSublayers) => {
    // Find all layers
    const listLayers = [];
    for (const sublayerId of layers) {
      const sublayer = allSublayers[sublayerId];
      if (!sublayer) continue;
      const id = sublayer.layerKey;
      if (listLayers.indexOf(id) === -1) {
        listLayers.push(id);
      }
    }
    return listLayers;
  };

  getAllSublayersUrl = (layers, listLayers) => {
    // Find all sublayers in a layer and
    // layers with aggregated sublayers
    let layerHierarchy = {};
    const layerAggregated = [];
    for (const layerId of listLayers) {
      const layer = this.state.kartlag[layerId];
      if (!layer) continue;
      const sublayers = layer.underlag;
      const sublayerHierarchy = [];
      for (const sublayerId in sublayers) {
        const sublayer = sublayers[sublayerId];
        sublayerHierarchy.push(sublayer.key);
      }
      if (sublayerHierarchy.length > 0) {
        layerHierarchy[layerId] = sublayerHierarchy;
      }
      if (
        layerAggregated.indexOf(layer.id) === -1 &&
        layer.aggregatedwmslayer
      ) {
        const aggregated = layer.underlag[layer.allcategorieslayer.id];
        if (aggregated && layers.includes(aggregated.key)) {
          layerAggregated.push(layer.id);
        }
      }
    }
    return { layerHierarchy, layerAggregated };
  };

  getVisibleSublayersUrl = (
    layers,
    allSublayers,
    layerHierarchy,
    layerAggregated
  ) => {
    // Create array with visble sublayers
    const array = [];
    const allCategoriesAdded = [];
    for (const sublayerId of layers) {
      const sublayer = allSublayers[sublayerId];
      if (!sublayer) continue;
      // Add allcategoriesLayer visible when all sublayers in layer are visible
      const layerKey = sublayer.layerKey;
      const listSublayers = layerHierarchy[layerKey];
      if (
        !allCategoriesAdded.includes(layerKey) &&
        listSublayers.every(item => layers.includes(item))
      ) {
        const propKeys = [{ key: "allcategorieslayer.erSynlig", value: true }];
        const item = {
          layerKey: layerKey,
          sublayerKey: "allcategorieslayer",
          propKeys,
          key: null
        };
        array.push(item);
        allCategoriesAdded.push(layerKey);
      }
      // Make sublayers visible when relevant
      const code = "underlag." + sublayer.sublayerKey + ".";

      let propKeys;
      if (layerAggregated.includes(sublayer.layerKey) && !sublayer.aggregated) {
        // Layer has an aggregated layer which is visible, but not this one.
        // Make slider visible in UI, but don't activate the tiles.
        propKeys = [
          { key: code + "visible", value: true },
          { key: code + "erSynlig", value: false }
        ];
      } else {
        // Make slider visible in UI and activate the tiles.
        propKeys = [
          { key: code + "visible", value: true },
          { key: code + "erSynlig", value: true }
        ];
      }
      const item = {
        layerKey: sublayer.layerKey,
        sublayerKey: sublayer.sublayerKey,
        propKeys,
        key: sublayerId
      };
      array.push(item);
    }
    return array;
  };

  toggleShowLayersUrl = async array => {
    const favorites = this.state.showFavoriteLayers;
    if (favorites) {
      this.hideVisibleLayersUrl(array).then(() => {
        this.showVisibleLayersUrl(array).then(() => {
          this.setState({ visibleSublayersFavorites: array });
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
    } else {
      this.hideVisibleLayersUrl(array).then(() => {
        this.showVisibleLayersUrl(array).then(() => {
          this.setState({ visibleSublayersComplete: array });
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
    }
  };

  showVisibleLayersUrl = async array => {
    let layersList;
    if (this.state.showFavoriteLayers) {
      layersList = this.state.visibleSublayersFavorites;
    } else {
      layersList = this.state.visibleSublayersComplete;
    }

    for (const item of array) {
      const filtered = layersList.filter(
        elem =>
          elem.layerKey === item.layerKey &&
          elem.sublayerKey === item.sublayerKey
      );
      if (
        filtered.length === 0 ||
        JSON.stringify(filtered[0]) !== JSON.stringify(item)
      ) {
        for (const prop of item.propKeys) {
          this.handleKartlagLayerProp(item.layerKey, prop.key, prop.value);
        }
      }
    }
    this.hentInfoAlleValgteLag(this.state.lng, this.state.lat, this.state.zoom);
  };

  hideVisibleLayersUrl = async array => {
    let layersList;
    if (this.state.showFavoriteLayers) {
      layersList = this.state.visibleSublayersFavorites;
    } else {
      layersList = this.state.visibleSublayersComplete;
    }

    for (const item of layersList) {
      const filtered = array.filter(
        elem =>
          elem.layerKey === item.layerKey &&
          elem.sublayerKey === item.sublayerKey
      );
      if (filtered.length === 0) {
        for (const prop of item.propKeys) {
          this.handleKartlagLayerProp(item.layerKey, prop.key, false);
        }
      }
    }
    this.hentInfoAlleValgteLag(this.state.lng, this.state.lat, this.state.zoom);
  };

  handleExtensiveInfo = showExtensiveInfo => {
    // funksjonen som bestemmer om man søker eller ikke ved klikk
    this.setState({ showExtensiveInfo: showExtensiveInfo });
  };

  handleSpraak = spraak => {
    this.setState({ spraak: spraak });
  };

  // ------------------------------------------------------------------------------------- //
  // ---------------------------------- FAVOURITE LAYERS --------------------------------- //
  // ------------------------------------------------------------------------------------- //
  toggleEditLayers = () => {
    this.setState({ editLayersMode: !this.state.editLayersMode });
  };

  handleSomeLayersFavorite = someLayersFavorite => {
    this.setState({ someLayersFavorite });
  };

  handleShowFavoriteLayers = async showFavoriteLayers => {
    this.handleUpdateChangeInUrl(false);
    this.setState({ showFavoriteLayers });

    // Update URL
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set("favorites", showFavoriteLayers);
    if (showFavoriteLayers) {
      queryParams.delete("layers");
    }
    this.props.history.push("?" + queryParams.toString());
    setTimeout(() => {
      this.handleUpdateChangeInUrl(true);
    }, 50);
  };

  toggleShowFavoriteLayers = async favorites => {
    this.setState({
      showFavoriteLayers: favorites,
      sublayerDetailsVisible: false,
      legendVisible: false
    });

    // Update URL. Layers are updated based on the state visible sublayers
    this.handleUpdateChangeInUrl(false);
    const urlParams = new URLSearchParams(window.location.search);
    // Get coordinates
    let lat = urlParams.get("lat");
    let lng = urlParams.get("lng");
    let latUrlString = "";
    if (lat && lng) {
      latUrlString = "?lng=" + lng + "&lat=" + lat;
    }
    // Get layers
    let layersObject;
    if (favorites) {
      layersObject = this.state.visibleSublayersFavorites;
    } else {
      layersObject = this.state.visibleSublayersComplete;
    }
    const layerKeys = layersObject.map(item => item.key);
    const cleanKeys = layerKeys.filter(item => item !== null);
    const uniqueKeys = [...new Set(cleanKeys)];
    let layersUrlString = "";
    if (lat && lng && uniqueKeys.length > 0) {
      layersUrlString = "&layers=" + uniqueKeys;
    } else if ((!lat || !lng) && uniqueKeys.length > 0) {
      layersUrlString = "?layers=" + uniqueKeys;
    }
    // Get favorites
    let favoritesUrlString = urlParams.get("favorites");
    if ((lat && lng) || uniqueKeys.length > 0) {
      favoritesUrlString = "&favorites=" + favorites;
    } else {
      favoritesUrlString = "?favorites=" + favorites;
    }
    this.props.history.push(
      latUrlString + layersUrlString + favoritesUrlString
    );
    setTimeout(() => {
      this.handleUpdateChangeInUrl(true);
    }, 50);

    // Update visible layers
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
          this.handleKartlagLayerProp(item.layerKey, prop.key, prop.value);
        }
      }
    } else {
      for (const item of this.state.visibleSublayersComplete) {
        for (const prop of item.propKeys) {
          this.handleKartlagLayerProp(item.layerKey, prop.key, prop.value);
        }
      }
    }
    this.hentInfoAlleValgteLag(this.state.lng, this.state.lat, this.state.zoom);
  };

  hideVisibleLayers = async favorites => {
    if (favorites) {
      for (const item of this.state.visibleSublayersComplete) {
        for (const prop of item.propKeys) {
          this.handleKartlagLayerProp(item.layerKey, prop.key, false);
        }
      }
    } else {
      for (const item of this.state.visibleSublayersFavorites) {
        for (const prop of item.propKeys) {
          this.handleKartlagLayerProp(item.layerKey, prop.key, false);
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

  // ------------------------------------------------------------------------------------- //
  // -------------------- CHANGE SUBLAYER VISIBILITY FROM KARTLAG PANEL ------------------ //
  // ------------------------------------------------------------------------------------- //
  changeVisibleSublayers = sublayersArray => {
    let array;
    if (this.state.showFavoriteLayers) {
      array = [...this.state.visibleSublayersFavorites];
    } else {
      array = [...this.state.visibleSublayersComplete];
    }

    for (const sub of sublayersArray) {
      if (sub.add) {
        // Find index of layer in array
        const index = array.findIndex(item => {
          return (
            item.layerKey === sub.layerKey &&
            item.sublayerKey === sub.sublayerKey
          );
        });
        if (index > -1) {
          // If layer exists in array, modify layer
          array[index] = {
            layerKey: sub.layerKey,
            sublayerKey: sub.sublayerKey,
            propKeys: sub.propKeys,
            key: sub.key
          };
        } else {
          // If layer does not exist in array, push new layer
          array.push({
            layerKey: sub.layerKey,
            sublayerKey: sub.sublayerKey,
            propKeys: sub.propKeys,
            key: sub.key
          });
        }
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

    // Get a list of Ids of visible layers and remove duplicates with Set
    this.handleUpdateChangeInUrl(false);
    const layerKeys = array.map(item => item.key);
    const cleanKeys = layerKeys.filter(item => item !== null);
    const uniqueKeys = [...new Set(cleanKeys)];

    // Builds new URL with the visible layers
    const urlParams = new URLSearchParams(window.location.search);
    let lat = urlParams.get("lat");
    let lng = urlParams.get("lng");
    let latUrlString = "";
    if (lat && lng) {
      latUrlString = "?lng=" + lng + "&lat=" + lat;
    }
    let layersUrlString = "";
    if (lat && lng && uniqueKeys.length > 0) {
      layersUrlString = "&layers=" + uniqueKeys;
    } else if ((!lat || !lng) && uniqueKeys.length > 0) {
      layersUrlString = "?layers=" + uniqueKeys;
    }
    let favoritesUrlString = urlParams.get("favorites");
    if (!favoritesUrlString && ((lat && lng) || uniqueKeys.length > 0)) {
      favoritesUrlString = "&favorites=" + this.state.showFavoriteLayers;
    } else if (!favoritesUrlString) {
      favoritesUrlString = "?favorites=" + this.state.showFavoriteLayers;
    } else if ((lat && lng) || uniqueKeys.length > 0) {
      favoritesUrlString = "&favorites=" + favoritesUrlString;
    } else {
      favoritesUrlString = "?favorites=" + favoritesUrlString;
    }
    this.props.history.push(
      latUrlString + layersUrlString + favoritesUrlString
    );

    setTimeout(() => {
      this.handleUpdateChangeInUrl(true);
    }, 100);
  };

  // ------------------------------------------------------------------------------------- //
  // ---------------------------- SEARCH RESULT SELECTION -------------------------------- //
  // ------------------------------------------------------------------------------------- //
  handleNavigateToKartlag = (valgtLag, trefftype) => {
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

  handleSelectSearchResult = searchResultPage => {
    this.setState({ searchResultPage: searchResultPage });
  };

  // ------------------------------------------------------------------------------------- //
  // -------------------- AUTOMATIC UPDATE OF MAP POSITION AND ZOOM ---------------------- //
  // ------------------------------------------------------------------------------------- //
  handleRemoveZoomCoordinates = () => {
    this.setState({ zoomcoordinates: null });
  };

  handleSetZoomCoordinates = (mincoord, maxcoord) => {
    this.setState({
      zoomcoordinates: {
        mincoord: mincoord,
        maxcoord: maxcoord
      }
    });
  };

  handleGeoSelection = async (geostring, trefftype, itemtype) => {
    let mincoord = null;
    let maxcoord = null;
    let lng = null;
    let lat = null;

    if (geostring.ssrId) {
      mincoord = [
        parseFloat(geostring.aust) - 0.5,
        parseFloat(geostring.nord) - 0.5
      ];
      maxcoord = [
        parseFloat(geostring.aust) + 0.5,
        parseFloat(geostring.nord) + 0.5
      ];
      lng = parseFloat(geostring.aust);
      lat = parseFloat(geostring.nord);
    } else {
      let koordinater = geostring.representasjonspunkt;
      mincoord = [
        parseFloat(koordinater.lon) - 0.5,
        parseFloat(koordinater.lat) - 0.5
      ];
      maxcoord = [
        parseFloat(koordinater.lon) + 0.5,
        parseFloat(koordinater.lat) + 0.5
      ];
      lng = parseFloat(koordinater.lon);
      lat = parseFloat(koordinater.lat);
    }

    // Update state
    if (maxcoord) this.setState({ maxcoord });
    if (mincoord) this.setState({ mincoord });

    // Update URL wih the coordinates
    this.handleUpdateChangeInUrl(false);
    const urlParams = new URLSearchParams(window.location.search);
    let latUrl = urlParams.get("lat");
    let lngUrl = urlParams.get("lng");
    let layers = urlParams.get("layers");
    let layersUrlString = "";
    if (!layers) {
      layersUrlString = "";
    } else if (latUrl && lngUrl) {
      layersUrlString = "&layers=" + layers;
    } else {
      layersUrlString = "layers=" + layers;
    }
    let favoritesUrlString = urlParams.get("favorites");
    if (!favoritesUrlString && ((lat && lng) || layers)) {
      favoritesUrlString = "&favorites=" + this.state.showFavoriteLayers;
    } else if (!favoritesUrlString) {
      favoritesUrlString = "?favorites=" + this.state.showFavoriteLayers;
    } else if ((lat && lng) || layers) {
      favoritesUrlString = "&favorites=" + favoritesUrlString;
    } else {
      favoritesUrlString = "?favorites=" + favoritesUrlString;
    }
    this.props.history.push(
      "?lng=" + lng + "&lat=" + lat + layersUrlString + favoritesUrlString
    );
    this.handleUpdateChangeInUrl(true);

    // Update coordinates and infobox
    if (lng && lat) {
      this.handleInfobox(true);
      this.setState({
        automaticZoomUpdate: true,
        trefftype,
        treffitemtype: itemtype
      });
      // Wait some miliseconds so the tiles are fetched before the GetFeatureInfo
      setTimeout(() => {
        if (trefftype === "Punkt" && maxcoord && mincoord) {
          this.handleSetZoomCoordinates(mincoord, maxcoord);
          this.setState({ automaticZoomUpdate: false });
        }
        if (!this.state.showExtensiveInfo) {
          this.hentInfoAlleValgteLag(lng, lat, this.state.zoom);
        } else {
          this.hentInfoAlleLag(lng, lat, this.state.zoom);
        }
      }, 250);
    }
  };

  handleCoordinatesUrl = async (lat, lng) => {
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

  // ------------------------------------------------------------------------------------- //
  // ------------------- DATA UPDATES AFTER COORDINATES SELECTION IN MAP ----------------- //
  // ------------------------------------------------------------------------------------- //
  handleMapMarkerSearch = async (lng, lat, zoom) => {
    if (this.state.lat === lat && this.state.lng === lng) return;
    this.handleLatLng(lng, lat);
    this.handleStedsNavn(lng, lat, zoom);
    this.handleMatrikkel(lng, lat);
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
      if (!sted || !Array.isArray(sted)) return null;
      sted = sted.sort((a, b) =>
        a.distancemeters > b.distancemeters ? 1 : -1
      );
      this.setState({
        sted: sted.length > 0 ? sted[0] : null
      });
    });
  };

  handleMatrikkel = (lng, lat) => {
    // Returnerer matrikkel search
    backend.hentMatrikkel(lng, lat).then(data => {
      // Get fylke geometry
      if (!data || !Array.isArray(data)) return;
      const fylkeData = data.filter(item => item.datasettkode === "FYL");
      if (fylkeData.length > 0) {
        this.handleFylkeData(fylkeData[0]);
      }
      // Get kommune geometry
      const kommuneData = data.filter(item => item.datasettkode === "KOM");
      if (kommuneData.length > 0) {
        this.handleKommuneData(kommuneData[0]);
      }
      // Get property data
      let propertyData = data.filter(item => item.datasettkode === "MAT");
      if (propertyData.length === 0) {
        this.setState({ matrikkel: null, adresse: null, eiendomGeom: null });
        return;
      }
      // Select the closest matrikkel to the point position
      let propertyResult = null;
      if (propertyData.length === 1 && propertyData[0].data) {
        // Only one property
        propertyResult = propertyData[0];
        this.handleEiendomData(propertyResult);

        const knr = propertyResult.data.kommunenr;
        const gnr = propertyResult.data.gardsnr;
        const bnr = propertyResult.data.bruksnr;
        backend.hentAdresseSok(knr, gnr, bnr).then(sok => {
          this.selectAdress(sok, propertyResult);
        });
      } else if (propertyData.length > 1 && propertyData[0].data) {
        // Several properties. Loop and select the closest address
        propertyResult = propertyData[0];
        this.handleEiendomData(propertyResult);

        const countEnd = propertyData.length - 1;
        for (let i = 0; i < propertyData.length; i++) {
          const property = propertyData[i];
          if (!property.data) return;
          const knr = property.data.kommunenr;
          const gnr = property.data.gardsnr;
          const bnr = property.data.bruksnr;
          let allAddresses = [];
          backend.hentAdresseSok(knr, gnr, bnr).then(sok => {
            if (sok && sok.adresser && sok.adresser.length > 0) {
              allAddresses = allAddresses.concat(sok.adresser);
            }
            if (i === countEnd) {
              const newSok = { adresser: allAddresses };
              this.selectAdress(newSok, propertyResult);
            }
          });
        }
      } else {
        this.setState({ matrikkel: null, adresse: null, eiendomGeom: null });
      }
    });
  };

  selectAdress = (sok, propertyResult) => {
    let matrikkel = propertyResult.data.matrikkelnr;
    let address = null;
    if (sok && sok.adresser && sok.adresser.length === 1) {
      // Only one address
      address = sok.adresser[0];
      this.setState({ adresse: address, matrikkel: matrikkel });
    } else if (sok && sok.adresser && sok.adresser.length > 1) {
      // Several addresses. Select one
      const vegAdresse = sok.adresser.filter(
        item => item.objtype === "Vegadresse"
      );
      if (vegAdresse.length === 1) {
        // Only one vegadresse
        address = vegAdresse[0];
        this.setState({ adresse: address, matrikkel: matrikkel });
      } else if (vegAdresse.length > 1) {
        // Several vegadresser. Select the closest one
        let dist = 99999999999999.9;
        const geographicProjection = "+proj=longlat +datum=WGS84 +no_defs";
        const utm33Projection =
          "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";
        const [coordX, coordY] = proj4(geographicProjection, utm33Projection, [
          this.state.lng,
          this.state.lat
        ]);
        for (const result of vegAdresse) {
          const lng = result.representasjonspunkt.lon;
          const lat = result.representasjonspunkt.lat;
          const [x, y] = proj4(geographicProjection, utm33Projection, [
            lng,
            lat
          ]);
          const newDist = Math.sqrt(
            Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2)
          );
          if (newDist < dist) {
            dist = newDist;
            address = result;
          }
        }
        this.setState({ adresse: address, matrikkel: matrikkel });
      } else {
        // None vegadresser. Select other results, first matrikkeladresse
        address = sok.adresser[0];
        this.setState({ adresse: address, matrikkel: matrikkel });
      }
    } else if (matrikkel) {
      // Matrikkel exists but no addresses. Use matrikkel to select address
      const data = propertyResult.data;
      if (!data.gardsnr || data.gardsnr === "0") return;
      if (!data.bruksnr || data.bruksnr === "0") return;
      const adressetekst = `${data.gardsnr} / ${data.bruksnr} / ${data.festenr}`;
      const adresse = { adressetekst: adressetekst };
      this.setState({ matrikkel: matrikkel, adresse: adresse });
    } else {
      // No matrikkel or address
      this.setState({ matrikkel: null, adresse: null });
    }
  };

  handleHoydedata = (lng, lat) => {
    // returnerer punkt søk
    backend.hentHoydedata(lng, lat).then(hoydedata => {
      if (hoydedata) {
        this.setState({ elevation: hoydedata.elevation || null });
      }
    });
  };

  // ------------------------------------------------------------------------------------- //
  // ------------- BORDER POLYGON UPDATES AFTER COORDINATES SELECTION IN MAP ------------- //
  // ------------------------------------------------------------------------------------- //
  handleFylkeData = fylkeData => {
    const geom = fylkeData.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ fylkeGeom: allGeoms });
    } else {
      this.setState({ fylkeGeom: null });
    }
  };

  handleKommuneData = kommuneData => {
    const geom = kommuneData.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ kommuneGeom: allGeoms });
    } else {
      this.setState({ kommuneGeom: null });
    }
  };

  handleEiendomData = eiendomData => {
    const geom = eiendomData.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ eiendomGeom: allGeoms });
    } else {
      this.setState({ eiendomGeom: null });
    }
  };

  handleFylkePolygon = fylkePolygon => {
    const geom = fylkePolygon.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ fylkePolygon: allGeoms });
      if (this.state.grensePolygon === "fylke") {
        this.setState({ grensePolygonGeom: allGeoms });
      }
    } else {
      this.setState({ fylkePolygon: null });
    }
  };

  handleKommunePolygon = kommunePolygon => {
    const geom = kommunePolygon.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ kommunePolygon: allGeoms });
      if (this.state.grensePolygon === "kommune") {
        this.setState({ grensePolygonGeom: allGeoms });
      }
    } else {
      this.setState({ kommunePolygon: null });
    }
  };

  handleEiendomPolygon = eiendomPolygon => {
    const geom = eiendomPolygon.geom;
    if (geom && geom.coordinates && geom.coordinates.length > 0) {
      const allGeoms = sortPolygonCoord(geom);
      this.setState({ eiendomPolygon: allGeoms });
      if (this.state.grensePolygon === "eiendom") {
        this.setState({ grensePolygonGeom: allGeoms });
      }
    } else {
      this.setState({ eiendomPolygon: null });
    }
  };

  handleGrensePolygon = value => {
    if (value === "none") {
      this.setState({ grensePolygonGeom: null, showPolygon: true });
    }
    if (value === "fylke") {
      this.setState({
        grensePolygonGeom: this.state.fylkePolygon,
        showFylkePolygon: true
      });
    }
    if (value === "kommune") {
      this.setState({
        grensePolygonGeom: this.state.kommunePolygon,
        showKommunePolygon: true
      });
    }
    if (value === "eiendom") {
      this.setState({
        grensePolygonGeom: this.state.eiendomPolygon,
        showEiendomPolygon: true
      });
    }
    this.setState({
      grensePolygon: value,
      polygonResults: null,
      showPolygon: true
    });
  };

  handleStedsNavnPolygon = (lng, lat) => {
    // returnerer stedsnavn som vist øverst i feltet
    backend.hentStedsnavn(lng, lat, 20).then(sted => {
      if (!sted || !Array.isArray(sted)) return null;
      sted = sted.sort((a, b) =>
        a.distancemeters > b.distancemeters ? 1 : -1
      );
      if (sted.length > 0) {
        const newData = {
          ...this.state.grensePolygonData,
          [this.state.grensePolygon]: sted[0]
        };
        this.setState({
          grensePolygonData: newData
        });
      }
    });
  };

  fetchGrensePolygon = (lat, lng) => {
    const grensePolygon = this.state.grensePolygon;
    if (grensePolygon === "none") return;

    backend.hentMatrikkel(lng, lat).then(data => {
      // Get fylke geometry
      if (!data || !Array.isArray(data)) return;
      const fylkeData = data.filter(item => item.datasettkode === "FYL");
      if (fylkeData.length > 0) {
        if (this.state.grensePolygon === "fylke") {
          this.handleFylkePolygon(fylkeData[0]);
          this.handleStedsNavnPolygon(lng, lat);
        }
      }
      // Get kommune geometry
      const kommuneData = data.filter(item => item.datasettkode === "KOM");
      if (kommuneData.length > 0) {
        if (this.state.grensePolygon === "kommune") {
          this.handleKommunePolygon(kommuneData[0]);
          this.handleStedsNavnPolygon(lng, lat);
        }
      }
      // Get property data
      const propertyData = data.filter(item => item.datasettkode === "MAT");
      if (propertyData.length > 0) {
        if (this.state.grensePolygon === "eiendom") {
          this.handleEiendomPolygon(propertyData[0]);
          const newData = {
            ...this.state.grensePolygonData,
            [this.state.grensePolygon]: propertyData[0].id
          };
          this.setState({
            grensePolygonData: newData
          });
        }
      }
      // Update rest of relevant state variables
      this.hideAndShowPolygon(true);
      this.setState({ polygonResults: null });
    });
  };

  removeGrensePolygon = () => {
    this.setState({ grensePolygonGeom: null });
    if (this.state.grensePolygon === "fylke") {
      this.setState({ fylkePolygon: null });
    }
    if (this.state.grensePolygon === "kommune") {
      this.setState({ kommunePolygon: null });
    }
    if (this.state.grensePolygon === "eiendom") {
      this.setState({ eiendomPolygon: null });
    }
  };

  // ------------------------------------------------------------------------------------- //
  // ---------------------- INFOBOX LAYER RESULTS UPDATE: MARKER ------------------------- //
  // ------------------------------------------------------------------------------------- //
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
    if (!layer && layersResult[layerkey]) {
      delete layersResult[layerkey];
      this.setState({ layersResult });
      return;
    }
    if (!layer) {
      return;
    }
    if (layer && layer.queryable === false) {
      layersResult[layerkey] = {
        queryable: false,
        dataeier: layer.dataeier,
        tema: layer.tema,
        tags: layer.tags,
        id: layer.id
      };
      this.setState({ layersResult });
      return;
    }
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
      if (looplist[key].queryable === false) {
        // None of the sublayers are queryable
        const layer = looplist[key];
        layersResult[key] = {
          queryable: false,
          dataeier: layer.dataeier,
          tema: layer.tema,
          tags: layer.tags,
          id: layer.id,
          loading: false
        };
      } else if (
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
      if (layersResult[key].queryable === false) return;
      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        // Use GetFeatureInfo with list of sublayers per layer
        // with list of sublayers
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
      if (looplist[key].queryable === false) {
        // None of the sublayers are queryable
        const layer = looplist[key];
        allLayersResult[key] = {
          queryable: false,
          dataeier: layer.dataeier,
          tema: layer.tema,
          tags: layer.tags,
          id: layer.id,
          loading: false
        };
      } else if (
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

      if (allLayersResult[key].queryable === false) return;
      if (
        wmsinfoformat === "application/vnd.ogc.gml" ||
        wmsinfoformat === "application/vnd.esri.wms_raw_xml"
      ) {
        // Use GetFeatureInfo with list of sublayers per layer
        // with list of sublayers
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
        // Use GetFeatureInfo per sublayer
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

  // ------------------------------------------------------------------------------------- //
  // ------------- LAYER UPDATE FROM KARTLAG PANEL, SEARCH BAR, OR FAVOURITES ------------ //
  // ------------------------------------------------------------------------------------- //
  handleKartlagLayerProp = (layerkey, key, value, update = false) => {
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

  // ------------------------------------------------------------------------------------- //
  // ---------------------------- SIMPLE STATE CHANGE ACTIONS ---------------------------- //
  // ------------------------------------------------------------------------------------- //
  setSublayerDetailsVisible = visible => {
    this.setState({ sublayerDetailsVisible: visible });
  };

  setInfoboxDetailsVisible = visible => {
    this.setState({ infoboxDetailsVisible: visible });
  };

  setPolygonDetailsVisible = visible => {
    this.setState({ polygonDetailsVisible: visible });
  };

  setLayerInfoboxDetails = layer => {
    this.setState({ layerInfoboxDetails: layer });
  };

  setLegendVisible = visible => {
    this.setState({ legendVisible: visible });
    if (!visible) {
      this.setState({ legendPosition: "right" });
    }
  };

  handleLegendPosition = () => {
    if (this.state.legendPosition === "right") {
      this.setState({
        showInfobox: true,
        legendVisible: true,
        legendPosition: "left"
      });
    }
    if (this.state.legendPosition === "left") {
      this.setState({ legendPosition: "right" });
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

  updateWindowHeight = windowHeight => {
    this.setState({ windowHeight });
  };

  handlePropertyGeom = () => {
    this.setState({ showEiendomGeom: !this.state.showEiendomGeom });
  };

  handleFylkeGeom = () => {
    this.setState({ showFylkeGeom: !this.state.showFylkeGeom });
  };

  handleKommuneGeom = () => {
    this.setState({ showKommuneGeom: !this.state.showKommuneGeom });
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

  closeAppName = () => {
    this.setState({ showAppName: false });
  };

  handleAboutModal = value => {
    this.setState({ showAboutModal: value });
    if (value) this.openAboutPage();
  };

  openAboutPage = () => {
    backend.getAboutPage().then(aboutPage => {
      this.setState({ aboutPage });
    });
  };

  handleUpdateChangeInUrl = value => {
    this.setState({ updateChangeInUrl: value });
  };

  // ------------------------------------------------------------------------------------- //
  // --------------------------------- POLYGON ACTIONS ----------------------------------- //
  // ------------------------------------------------------------------------------------- //
  addPolyline = polyline => {
    this.setState({ polyline: polyline });
  };

  addPolygon = polygon => {
    this.setState({ polygon: polygon });
  };

  hideAndShowPolygon = show => {
    if (this.state.grensePolygon === "none") {
      this.setState({ showPolygon: show });
    } else if (this.state.grensePolygon === "fylke") {
      this.setState({ showFylkePolygon: show });
    } else if (this.state.grensePolygon === "kommune") {
      this.setState({ showKommunePolygon: show });
    } else if (this.state.grensePolygon === "eiendom") {
      this.setState({ showEiendomPolygon: show });
    }
  };

  handleEditable = editable => {
    this.setState({ editable: editable });
  };

  handlePolygonResults = results => {
    if (results === null) {
      this.setState({ polygonResults: null });
      return;
    }
    let updatedResults = { ...this.state.polygonResults };
    for (const resultId in results) {
      const result = results[resultId];
      updatedResults[resultId] = result;
    }
    this.setState({ polygonResults: updatedResults });
  };

  handleShowMarker = showMarker => {
    this.setState({ showMarker: showMarker });
  };

  removeValgtLag = () => {
    this.setState({ valgtLag: null });
  };

  uploadPolygonFile = (from = null) => {
    const fileSelector = document.getElementById("file-input");
    fileSelector.click();

    fileSelector.onchange = () => {
      const selectedFiles = fileSelector.files;
      if (fileSelector.files.length > 0) {
        // If extension is not ".json" or ".geojson", do not upload
        // and give a warning
        if (
          selectedFiles[0].type !== "application/json" &&
          selectedFiles[0].name.toLowerCase().slice(-8) !== ".geojson"
        ) {
          this.setState({
            polygonActionResult: [
              "upload_error",
              "Kunne ikke laste opp filen. Feil format."
            ]
          });
          return;
        }

        const reader = new FileReader();

        // This event will happen when the reader has read the file
        reader.onload = () => {
          var result = JSON.parse(reader.result);
          let allGeoms = [];
          if (result && result.features && result.features.length > 0) {
            this.setState({ automaticZoomUpdate: true });

            // Get projection
            let projection = "";
            if (
              result.crs &&
              result.crs.properties &&
              result.crs.properties.name
            ) {
              let crs = result.crs.properties.name;
              projection = getProjection(crs);
            }

            for (const geom of result.features) {
              if (
                geom.geometry &&
                geom.geometry &&
                geom.geometry.coordinates &&
                geom.geometry.coordinates.length > 0
              ) {
                const depth = getPolygonDepth(geom.geometry.coordinates);
                const result = transformUploadedPolygon(
                  geom.geometry,
                  projection
                );
                if (depth === 2 || depth === 3) {
                  allGeoms.push(result);
                } else if (depth === 4) {
                  allGeoms = allGeoms.concat(result);
                }
              }
            }
            this.addPolygon(allGeoms);
            this.addPolyline([]);
            this.updateZoomWithGeometry(allGeoms, "UploadedPolygon");
            this.setState({
              automaticZoomUpdate: false,
              polygonResults: null,
              showPolygon: true
            });
            if (from === "menu") {
              this.setState({
                grensePolygon: "none",
                changeInfoboxState: "polygon",
                showInfobox: true
              });
            }
          } else {
            this.setState({
              polygonActionResult: [
                "upload_error",
                "Kunne ikke laste opp filen"
              ]
            });
          }
          if (allGeoms.length === 0) {
            this.setState({
              polygonActionResult: [
                "upload_error",
                "Kunne ikke laste opp filen"
              ]
            });
          }
          document.getElementById("file-input").value = "";
        };
        reader.readAsText(selectedFiles[0]);
      }
    };
  };

  savePolygon = (name, from = null) => {
    if (!name || name === "") {
      this.setState({
        polygonActionResult: [
          "save_error",
          "Kunne ikke lagre polygonen",
          "Navnet kan ikke være tomt"
        ]
      });
      return;
    }
    savePolygonIndexedDB(name, this.state.polygon)
      .then(() => {
        this.setState({
          polygonActionResult: ["save_success", "Polygon lagret"]
        });
        this.setState({ showPolygonSaveModal: false });
        if (from === "menu") {
          this.setState({
            grensePolygon: "none",
            changeInfoboxState: "polygon"
          });
        }
      })
      .catch(() => {
        this.setState({
          polygonActionResult: [
            "save_error",
            "Kunne ikke lagre polygonen",
            "Navn allerede brukt"
          ]
        });
      });
  };

  getSavedPolygons = () => {
    getPolygonsIndexedDB().then(polygons => {
      this.setState({ savedPolygons: polygons });
    });
    this.setState({ showSavedPolygons: true });
  };

  openSavedPolygon = polygon => {
    if (polygon && polygon.geometry) {
      const geom = polygon.geometry;
      this.setState({ automaticZoomUpdate: true });
      this.addPolygon(geom);
      this.addPolyline([]);
      this.updateZoomWithGeometry(geom, "UploadedPolygon");
      this.setState({ automaticZoomUpdate: false, showSavedPolygons: false });
      this.setState({
        grensePolygon: "none",
        changeInfoboxState: "polygon",
        showPolygon: true,
        showInfobox: true,
        polygonResults: null
      });
    } else {
      this.setState({
        polygonActionResult: ["open_error", "Kunne ikke åpne polygonen"]
      });
    }
  };

  handlePolygonSaveModal = value => {
    this.setState({ showPolygonSaveModal: value });
  };

  handleShowSavedPolygons = value => {
    this.setState({ showSavedPolygons: value });
  };

  closePolygonActionResult = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ polygonActionResult: null });
  };

  handleChangeInfoboxState = change => {
    this.setState({ changeInfoboxState: change });
  };

  deleteSavedPolygon = id => {
    deletePolygonIndexedDB(id)
      .then(() => {
        this.setState({
          polygonActionResult: ["delete_success", "Polygon slettet"]
        });
        this.refreshSavedPolygons();
      })
      .catch(() => {
        this.setState({
          polygonActionResult: ["delete_error", "Kunne ikke slette polygonen"]
        });
      });
  };

  updateSavedPolygon = async polygon => {
    if (
      !polygon ||
      !polygon.id ||
      !polygon.editname ||
      polygon.editname === ""
    ) {
      this.setState({
        polygonActionResult: [
          "edit_error",
          "Kunne ikke endre polygonen",
          "Navnet kan ikke være tomt"
        ]
      });
      return;
    }
    updatePolygonIndexedDB(polygon)
      .then(() => {
        this.setState({
          polygonActionResult: ["edit_success", "Polygon endret"]
        });
        this.refreshSavedPolygons();
      })
      .catch(() => {
        this.setState({
          polygonActionResult: [
            "edit_error",
            "Kunne ikke endre polygonen",
            "Navn allerede brukt"
          ]
        });
      });
  };

  refreshSavedPolygons = async () => {
    getPolygonsIndexedDB().then(polygons => {
      this.setState({ savedPolygons: polygons });
    });
  };

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
                      <AppName
                        showAppName={this.state.showAppName}
                        closeAppName={this.closeAppName}
                        showAboutModal={this.state.showAboutModal}
                        handleAboutModal={this.handleAboutModal}
                        aboutPage={this.state.aboutPage}
                        showInfobox={this.state.showInfobox}
                        isMobile={this.state.isMobile}
                      />
                      <Kart
                        kartlag={this.state.kartlag}
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
                        handleShowMarker={this.handleShowMarker}
                        zoomcoordinates={this.state.zoomcoordinates}
                        handleRemoveZoomCoordinates={
                          this.handleRemoveZoomCoordinates
                        }
                        showExtensiveInfo={this.state.showExtensiveInfo}
                        handleExtensiveInfo={this.handleExtensiveInfo}
                        handleAlleLag={this.hentInfoAlleLag}
                        handleValgteLag={this.hentInfoAlleValgteLag}
                        zoom={this.state.zoom}
                        handleZoomChange={this.handleZoomChange}
                        aktiveLag={this.state.kartlag}
                        bakgrunnskart={this.state.bakgrunnskart}
                        history={history}
                        sted={this.state.sted}
                        adresse={this.state.adresse}
                        matrikkel={this.state.matrikkel}
                        handlePropertyGeom={this.handlePropertyGeom}
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
                        polygonDetailsVisible={this.state.polygonDetailsVisible}
                        setPolygonDetailsVisible={this.setPolygonDetailsVisible}
                        setLayerInfoboxDetails={this.setLayerInfoboxDetails}
                        onTileStatus={this.onTileStatus}
                        sortKey={this.state.sortKey}
                        tagFilter={this.state.tagFilter}
                        matchAllFilters={this.state.matchAllFilters}
                        lat={this.state.lat}
                        lng={this.state.lng}
                        resultat={this.state.resultat}
                        fylkeGeom={this.state.fylkeGeom}
                        showFylkeGeom={this.state.showFylkeGeom}
                        handleFylkeGeom={this.handleFylkeGeom}
                        kommuneGeom={this.state.kommuneGeom}
                        showKommuneGeom={this.state.showKommuneGeom}
                        eiendomGeom={this.state.eiendomGeom}
                        showEiendomGeom={this.state.showEiendomGeom}
                        handleKommuneGeom={this.handleKommuneGeom}
                        grensePolygonGeom={this.state.grensePolygonGeom}
                        grensePolygon={this.state.grensePolygon}
                        handleGrensePolygon={this.handleGrensePolygon}
                        fetchGrensePolygon={this.fetchGrensePolygon}
                        removeGrensePolygon={this.removeGrensePolygon}
                        showFylkePolygon={this.state.showFylkePolygon}
                        showKommunePolygon={this.state.showKommunePolygon}
                        showEiendomPolygon={this.state.showEiendomPolygon}
                        grensePolygonData={this.state.grensePolygonData}
                        showAppName={this.state.showAppName}
                        legendVisible={this.state.legendVisible}
                        setLegendVisible={this.setLegendVisible}
                        legendPosition={this.state.legendPosition}
                        handleUpdateChangeInUrl={this.handleUpdateChangeInUrl}
                        uploadPolygonFile={this.uploadPolygonFile}
                        showPolygonSaveModal={this.state.showPolygonSaveModal}
                        handlePolygonSaveModal={this.handlePolygonSaveModal}
                        savePolygon={this.savePolygon}
                        polygonActionResult={this.state.polygonActionResult}
                        closePolygonActionResult={this.closePolygonActionResult}
                        changeInfoboxState={this.state.changeInfoboxState}
                        handleChangeInfoboxState={this.handleChangeInfoboxState}
                        showSavedPolygons={this.state.showSavedPolygons}
                        savedPolygons={this.state.savedPolygons}
                        getSavedPolygons={this.getSavedPolygons}
                        handleShowSavedPolygons={this.handleShowSavedPolygons}
                        openSavedPolygon={this.openSavedPolygon}
                        deleteSavedPolygon={this.deleteSavedPolygon}
                        updateSavedPolygon={this.updateSavedPolygon}
                        handleSetBakgrunnskart={this.handleSetBakgrunnskart}
                        aktivtFormat={basiskart.kart.aktivtFormat}
                      />
                      <SearchBar
                        onSelectSearchResult={this.handleSelectSearchResult}
                        searchResultPage={this.state.searchResultPage}
                        handleGeoSelection={this.handleGeoSelection}
                        kartlag={this.state.kartlag}
                        addValgtLag={this.handleNavigateToKartlag}
                        removeValgtLag={this.removeValgtLag}
                        toggleEditLayers={this.toggleEditLayers}
                        showFavoriteLayers={this.state.showFavoriteLayers}
                        toggleShowFavoriteLayers={this.toggleShowFavoriteLayers}
                        isMobile={this.state.isMobile}
                        windowHeight={this.state.windowHeight}
                        showSideBar={this.state.showSideBar}
                        handleSideBar={this.handleSideBar}
                        handleInfobox={this.handleInfobox}
                        handleFullscreenInfobox={this.handleFullscreenInfobox}
                        loadingFeatures={this.state.loadingFeatures}
                        handleAboutModal={this.handleAboutModal}
                        uploadPolygonFile={this.uploadPolygonFile}
                        getSavedPolygons={this.getSavedPolygons}
                      />
                      <KartlagFanen
                        searchResultPage={this.state.searchResultPage}
                        removeValgtLag={this.removeValgtLag}
                        valgtLag={this.state.valgtLag}
                        onUpdateLayerProp={this.handleKartlagLayerProp}
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
                        legendPosition={this.state.legendPosition}
                        handleLegendPosition={this.handleLegendPosition}
                        updateIsMobile={this.updateIsMobile}
                        updateWindowHeight={this.updateWindowHeight}
                        handleSelectSearchResult={this.handleSelectSearchResult}
                        handleSortKey={this.handleSortKey}
                        handleTagFilter={this.handleTagFilter}
                        handleMatchAllFilters={this.handleMatchAllFilters}
                        showFavoriteLayers={this.state.showFavoriteLayers}
                        toggleShowFavoriteLayers={this.toggleShowFavoriteLayers}
                      />
                      <CookieWarning isSideBarOpen={this.state.showSideBar} />
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

  static contextType = SettingsContext;
}

export default withRouter(App);
