import L from "leaflet";
import "./TileLayer.CachedOverview";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
import { LocationSearching, WhereToVote } from "@material-ui/icons";
import InfoboxSide from "../Okologiskegrunnkart/FeatureInfo/InfoboxSide";
import "../style/leaflet.css";
import CustomIcon from "../Common/CustomIcon";
import PolygonActions from "./PolygonActions";
import ArtsdatabankenLogo from "./ArtsdatabankenLogo";
import KartVelger from "./KartVelger";
import { checkPolylineIsValid } from "../Funksjoner/polylineTools";

var inactiveIcon = L.divIcon({ className: "inactive_point" });
var activeIcon = L.divIcon({ className: "active_point" });

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const MAX_MAP_ZOOM_LEVEL = 20;

class Leaflet extends React.Component {
  state = {
    markerType: "klikk",
    coordinates_area: null,
    previousCoordinates: null,
    closeWarning: null,
    wmslayers: {},
    polylineError: false
  };

  componentDidMount() {
    const options = {
      zoomControl: false,
      inertia: true,
      minZoom: 4,
      dragging: true,
      tap: false,
      touchZoom: true,
      maxZoom: MAX_MAP_ZOOM_LEVEL
    };

    let map = L.map(this.mapEl, options);
    this.map = map;
    map.clicked = 0;

    // For servere som bare støtter 900913
    L.CRS.EPSG900913 = Object.assign({}, L.CRS.EPSG3857);
    L.CRS.EPSG900913.code = "EPSG:900913";

    // On map click, set marker
    let timer = null;
    map.on("click", e => {
      map.clicked = map.clicked + 1;
      if (map.clicked === 1) {
        timer = setTimeout(() => {
          this.handleClick(e);
          map.clicked = 0;
        }, 300);
      }
    });

    // On map double click, zoom in
    map.on("dblclick", () => {
      clearTimeout(timer);
      map.clicked = 0;
      map.zoomIn();
      // Make sure timeout is deleted (especially mobile)
      setTimeout(() => {
        clearTimeout(timer);
        map.clicked = 0;
      }, 100);
      setTimeout(() => {
        clearTimeout(timer);
        map.clicked = 0;
      }, 200);
    });

    map.on("zoomend", e => {
      if (!e.hard) {
        const zoom = this.map.getZoom();
        if (zoom === this.props.zoom) return;
        this.props.handleZoomChange(zoom);
      }
    });

    // map.setView(
    //   [this.props.latitude, this.props.longitude],
    //   this.props.zoom * 1.8
    // );
    map.setView([65.4, 15.8], 3.1 * 1.8);

    L.control.zoom({ position: "topright" }).addTo(map);
    L.DomUtil.addClass(map._container, "crosshair-cursor-enabled");
    this.icon = L.icon({
      iconUrl: "/marker/marker-icon-2x-orange.png",
      iconSize: [22, 36],
      iconAnchor: [13, 38]
    });
  }

  coordinatesChanged(prevProps) {
    if ((this.props.lat || this.props.lng) && !this.state.coordinates_area)
      return true;
    if (
      this.props.lat !== prevProps.lat &&
      this.props.lat !== this.state.coordinates_area.lat
    )
      return true;
    if (
      this.props.lng !== prevProps.lng &&
      this.props.lng !== this.state.coordinates_area.lng
    )
      return true;
  }

  borderPolygonVisible(prevProps) {
    if (
      ((this.props.grensePolygon !== prevProps.grensePolygon ||
        this.props.grensePolygonGeom !== prevProps.grensePolygonGeom ||
        this.props.showFylkePolygon !== prevProps.showFylkePolygon) &&
        this.props.grensePolygon === "fylke" &&
        this.props.showFylkePolygon) ||
      ((this.props.grensePolygon !== prevProps.grensePolygon ||
        this.props.grensePolygonGeom !== prevProps.grensePolygonGeom ||
        this.props.showKommunePolygon !== prevProps.showKommunePolygon) &&
        this.props.grensePolygon === "kommune" &&
        this.props.showKommunePolygon) ||
      ((this.props.grensePolygon !== prevProps.grensePolygon ||
        this.props.grensePolygonGeom !== prevProps.grensePolygonGeom ||
        this.props.showEiendomPolygon !== prevProps.showEiendomPolygon) &&
        this.props.grensePolygon === "eiendom" &&
        this.props.showEiendomPolygon)
    ) {
      return true;
    }
    return false;
  }

  borderPolygonInvisible(prevProps) {
    if (
      (this.props.grensePolygon !== prevProps.grensePolygon &&
        this.props.grensePolygon === "none") ||
      (this.props.grensePolygonGeom !== prevProps.grensePolygonGeom &&
        !this.props.grensePolygonGeom) ||
      (this.props.showFylkePolygon !== prevProps.showFylkePolygon &&
        !this.props.showFylkePolygon &&
        this.props.grensePolygon === "fylke") ||
      (this.props.showKommunePolygon !== prevProps.showKommunePolygon &&
        !this.props.showKommunePolygon &&
        this.props.grensePolygon === "kommune") ||
      (this.props.showEiendomPolygon !== prevProps.showEiendomPolygon &&
        !this.props.showEiendomPolygon &&
        this.props.grensePolygon === "eiendom")
    ) {
      return true;
    }
    return false;
  }

  updateUrlWithCoordinates(lng, lat) {
    // Builds new URL with the coordinates
    this.props.handleUpdateChangeInUrl(false);
    const urlParams = new URLSearchParams(window.location.search);
    let layersUrlString = urlParams.get("layers");
    if (!layersUrlString) {
      layersUrlString = "";
    } else {
      layersUrlString = "&layers=" + layersUrlString;
    }
    let favoritesUrlString = urlParams.get("favorites");
    if (!favoritesUrlString) {
      favoritesUrlString = "";
    } else {
      favoritesUrlString = "&favorites=" + favoritesUrlString;
    }
    this.props.history.push(
      "?lng=" + lng + "&lat=" + lat + layersUrlString + favoritesUrlString
    );
    this.props.handleUpdateChangeInUrl(true);
  }

  componentDidUpdate(prevProps) {
    // Render map when token is generated
    if (this.props.token !== prevProps.token) {
      this.updateBaseMap();
      this.openLinksInNewTab();
      this.positionZoomButtons();
      this.positionleafletLink();
      return true;
    }
    // Update map coordinates and zoom
    if (this.props.zoomcoordinates) {
      this.goToSelectedZoomCoordinates();
    }
    // Update layer tiles
    if (this.props.aktiveLag !== prevProps.aktiveLag) {
      this.updateMap(this.props.token, this.props.aktiveLag);
    }
    // Update background map
    if (this.props.bakgrunnskart !== prevProps.bakgrunnskart) {
      this.updateBaseMap();
      return true;
    }
    // Fly to new coordinates
    if (this.coordinatesChanged(prevProps)) {
      this.setState({
        coordinates_area: { lat: this.props.lat, lng: this.props.lng }
      });
      if (this.state.markerType === "polygon") {
        this.setState({ markerType: "klikk" });
        this.props.handleShowMarker(true);
      }
    }
    // Update zoom buttons position
    if (
      this.props.showSideBar !== prevProps.showSideBar ||
      this.props.showInfobox !== prevProps.showInfobox ||
      this.props.isMobile !== prevProps.isMobile
    ) {
      this.positionZoomButtons();
      this.positionleafletLink();
    }
    // Draw marker
    if (
      this.props.showMarker &&
      (this.state.coordinates_area !== this.state.previousCoordinates ||
        this.props.showMarker !== prevProps.showMarker)
    ) {
      this.drawMarker();
    }
    // Remove marker
    if (
      this.props.showMarker !== prevProps.showMarker &&
      !this.props.showMarker
    ) {
      this.removeMarker();
    }
    // Draw polygon
    if (this.props.showPolygon && this.props.grensePolygon === "none") {
      this.drawPolygon();
    }
    // Remove polygon
    if (
      (this.props.showPolygon !== prevProps.showPolygon &&
        !this.props.showPolygon) ||
      this.props.grensePolygon !== "none"
    ) {
      this.removePolyline();
      this.removePolygon();
      this.removeEndPoint();
      this.removeStartPoint();
    }
    // Draw fylke
    if (
      (this.props.showFylkeGeom !== prevProps.showFylkeGeom ||
        this.props.fylkeGeom !== prevProps.fylkeGeom) &&
      this.props.showFylkeGeom
    ) {
      this.drawFylkeGeom();
    }
    // Remove fylke
    if (
      (this.props.showFylkeGeom !== prevProps.showFylkeGeom &&
        !this.props.showFylkeGeom) ||
      (this.props.fylkeGeom !== prevProps.fylkeGeom && !this.props.fylkeGeom)
    ) {
      this.removeFylkeGeom();
    }
    // Draw kommune
    if (
      (this.props.showKommuneGeom !== prevProps.showKommuneGeom ||
        this.props.kommuneGeom !== prevProps.kommuneGeom) &&
      this.props.showKommuneGeom
    ) {
      this.drawKommuneGeom();
    }
    // Remove kommune
    if (
      (this.props.showKommuneGeom !== prevProps.showKommuneGeom &&
        !this.props.showKommuneGeom) ||
      (this.props.kommuneGeom !== prevProps.kommuneGeom &&
        !this.props.kommuneGeom)
    ) {
      this.removeKommuneGeom();
    }
    // Draw property
    if (
      (this.props.showEiendomGeom !== prevProps.showEiendomGeom ||
        this.props.eiendomGeom !== prevProps.eiendomGeom) &&
      this.props.showEiendomGeom
    ) {
      this.drawPropertyGeom();
    }
    // Remove property
    if (
      (this.props.showEiendomGeom !== prevProps.showEiendomGeom &&
        !this.props.showEiendomGeom) ||
      (this.props.eiendomGeom !== prevProps.eiendomGeom &&
        !this.props.eiendomGeom)
    ) {
      this.removePropertyGeom();
    }
    // Draw border geometry
    if (this.borderPolygonVisible(prevProps)) {
      this.drawGrenseGeom();
    }
    // Remove border geometry
    if (this.borderPolygonInvisible(prevProps)) {
      this.removeGrenseGeom();
    }
    // Change infobox state
    if (
      this.props.changeInfoboxState !== prevProps.changeInfoboxState &&
      this.props.changeInfoboxState === "polygon" &&
      this.state.markerType === "klikk"
    ) {
      this.setState({ markerType: "polygon" });
      this.props.handleChangeInfoboxState(null);
    }
  }

  removeMarker() {
    if (!this.marker) return;
    this.map.removeLayer(this.marker);
  }

  removePolygon() {
    if (!this.polygon) return;
    this.map.removeLayer(this.polygon);
  }

  removePolyline() {
    if (!this.polyline) return;
    this.map.removeLayer(this.polyline);
  }

  removeStartPoint() {
    if (!this.startpoint) return;
    this.map.removeLayer(this.startpoint);
  }

  removeEndPoint() {
    if (!this.endpoint) return;
    this.map.removeLayer(this.endpoint);
  }

  removePropertyGeom() {
    if (!this.eiendomGeom) return;
    this.map.removeLayer(this.eiendomGeom);
  }

  removeFylkeGeom() {
    if (!this.fylkeGeom) return;
    this.map.removeLayer(this.fylkeGeom);
  }

  removeKommuneGeom() {
    if (!this.kommuneGeom) return;
    this.map.removeLayer(this.kommuneGeom);
  }

  removeGrenseGeom() {
    if (!this.grensePolygonGeom) return;
    this.map.removeLayer(this.grensePolygonGeom);
  }

  activateMarker = () => {
    this.props.setInfoboxDetailsVisible(false);
    this.props.setPolygonDetailsVisible(false);
    this.setState({ markerType: "klikk" }, () => {
      if (this.props.showEiendomGeom) {
        this.drawPropertyGeom();
      }
      if (this.props.showFylkeGeom) {
        this.drawFylkeGeom();
      }
      if (this.props.showKommuneGeom) {
        this.drawKommuneGeom();
      }
    });
    this.props.handleShowMarker(true);
    this.props.handleInfobox(true);
    this.removeEndPoint();
    this.removeStartPoint();
  };

  activatePolygon = () => {
    this.props.setInfoboxDetailsVisible(false);
    this.props.setPolygonDetailsVisible(false);
    this.setState({ markerType: "polygon" });
    this.props.handleShowMarker(false);
    this.props.handleInfobox(true);
    this.removePropertyGeom();
    this.removeFylkeGeom();
    this.removeKommuneGeom();
  };

  getBackendData = async (lng, lat) => {
    const fetchAllData = !this.props.showExtensiveInfo;
    this.props.handleExtensiveInfo(!this.props.showExtensiveInfo);
    if (fetchAllData) {
      this.props.handleAlleLag(lng, lat, this.map.getZoom());
    } else {
      this.props.handleValgteLag(lng, lat, this.map.getZoom());
    }
  };

  openLinksInNewTab = () => {
    // Remove default leaflet link in map so it
    // isn't selectable with tabs navigation
    const leafletLink = document.querySelector(
      ".leaflet-control-attribution a"
    );
    if (leafletLink) {
      leafletLink.setAttribute("target", "_blank");
      leafletLink.setAttribute("rel", "noopener noreferrer");
    }
  };

  positionZoomButtons = () => {
    // If side panel is open, the buttons need to be repositioned
    const leafletLink = document.querySelector(".leaflet-control-zoom");
    if (this.props.isMobile) {
      if (
        leafletLink &&
        (this.props.showSideBar || this.props.showInfobox) &&
        leafletLink.className.indexOf("side-bar-open") === -1
      ) {
        leafletLink.classList.add("side-bar-open");
      } else if (
        leafletLink &&
        !this.props.showSideBar &&
        !this.props.showInfobox &&
        leafletLink.className.indexOf("side-bar-open") >= 0
      ) {
        leafletLink.classList.remove("side-bar-open");
      }
    } else {
      if (
        leafletLink &&
        this.props.showSideBar &&
        leafletLink.className.indexOf("side-bar-open") === -1
      ) {
        leafletLink.classList.add("side-bar-open");
      } else if (
        leafletLink &&
        !this.props.showSideBar &&
        leafletLink.className.indexOf("side-bar-open") >= 0
      ) {
        leafletLink.classList.remove("side-bar-open");
      }
    }
  };

  positionleafletLink = () => {
    // If side panel is open, the link needs to be repositioned
    const leafletLink = document.querySelector(".leaflet-control-attribution");
    if (this.props.isMobile) {
      if (
        leafletLink &&
        (this.props.showSideBar || this.props.showInfobox) &&
        leafletLink.className.indexOf("side-bar-open") === -1
      ) {
        leafletLink.classList.add("side-bar-open");
      } else if (
        leafletLink &&
        !this.props.showSideBar &&
        !this.props.showInfobox &&
        leafletLink.className.indexOf("side-bar-open") >= 0
      ) {
        leafletLink.classList.remove("side-bar-open");
      }
    } else {
      if (
        leafletLink &&
        this.props.showSideBar &&
        leafletLink.className.indexOf("side-bar-open") === -1
      ) {
        leafletLink.classList.add("side-bar-open");
      } else if (
        leafletLink &&
        !this.props.showSideBar &&
        leafletLink.className.indexOf("side-bar-open") >= 0
      ) {
        leafletLink.classList.remove("side-bar-open");
      }
    }
  };

  clickInactivePoint = e => {
    if (this.props.editable === true) {
      // Setter sammen punktene til et polygon, og gjør den uredigerbar.
      this.props.addPolygon(this.props.polyline);
      this.props.addPolyline([]);
      this.props.handleEditable(false);
    } else {
      // Klikk på inaktivt punkt:
      if (
        e.latlng.lat === this.props.polyline[0][0] &&
        e.latlng.lng === this.props.polyline[0][1]
      ) {
        let polygon_list = this.props.polyline.reverse();
        this.props.addPolyline(polygon_list);
      }
      this.props.handleEditable(true);
    }
  };

  clickActivePoint = e => {
    // CLICKED THE ACTIVE POINT
    // Skal altså AVSLUTTE linjen, og gjøre dette punktet inaktivt!
    this.props.handleEditable(false);
    this.removeEndPoint();

    const latlng = e.latlng;
    this.endpoint = L.marker([latlng.lat, latlng.lng], {
      icon: inactiveIcon
    })
      .on("click", this.clickInactivePoint)
      .addTo(this.map);
  };

  clickMarkerInfobox = () => {
    if (this.state.markerType === "polygon") return;
    const width = window.innerWidth;
    if (width > 768) {
      this.props.handleInfobox(!this.props.showInfobox);
    } else {
      if (this.props.showInfobox) {
        this.props.handleFullscreenInfobox(true);
      } else {
        this.props.handleInfobox(!this.props.showInfobox);
      }
    }
  };

  clickPolygonInfobox = () => {
    if (this.state.markerType === "klikk") return;
    const width = window.innerWidth;
    if (width > 768) {
      this.props.handleInfobox(!this.props.showInfobox);
    } else {
      if (this.props.showInfobox) {
        this.props.handleFullscreenInfobox(true);
      } else {
        this.props.handleInfobox(!this.props.showInfobox);
      }
    }
  };

  async markerClick(e) {
    // Oppdatering av kartmarkøren
    this.setState({
      sted: null,
      adresse: null,
      data: null
    });
    this.removeMarker();

    // Oppdatering av infoboksen
    this.setState({ coordinates_area: e.latlng });

    if (this.props.showExtensiveInfo) {
      this.props.handleAlleLag(e.latlng.lng, e.latlng.lat, this.map.getZoom());
    } else {
      this.props.handleValgteLag(
        e.latlng.lng,
        e.latlng.lat,
        this.map.getZoom()
      );
    }
    this.updateUrlWithCoordinates(e.latlng.lng, e.latlng.lat);
  }

  polygonToolClick(e) {
    if (this.props.editable === true) {
      if (!this.props.polygon) {
        // Hvis polygon er satt, har personen klikket på ferdig-knappen,
        // og polylinje skal da ikke oppdateres.
        this.props.handleInfobox(true);
        const polygon_list = this.props.polyline;
        const latlng = e.latlng;
        // Check if new line intersects existing lines (polyline valid)
        const isValid = checkPolylineIsValid(
          latlng.lat,
          latlng.lng,
          this.props.polyline
        );
        if (!isValid) {
          this.setState({ polylineError: true });
        } else {
          polygon_list.push([latlng.lat, latlng.lng]);
          this.props.addPolyline(polygon_list);
        }
      }
    }
  }

  handlePolylineError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ polylineError: false });
  };

  handleGetNewPolygon(e) {
    this.props.handleInfobox(true);
    const latlng = e.latlng;
    this.props.fetchGrensePolygon(latlng.lat, latlng.lng);
  }

  handleClick = async e => {
    if (
      this.state.markerType === "polygon" &&
      this.props.grensePolygon === "none"
    ) {
      this.polygonToolClick(e);
    } else if (this.state.markerType === "polygon") {
      this.handleGetNewPolygon(e);
    } else if (this.state.markerType === "klikk") {
      this.markerClick(e).then(() => this.props.handleInfobox(true));
    }
    return;
  };

  updateMap(token, aktiveLag) {
    if (!token) return; // not yet loaded
    this.syncWmsLayers(aktiveLag);
  }

  updateBaseMap() {
    const config = this.props.bakgrunnskart;
    if (!this.bakgrunnskart_egk)
      this.bakgrunnskart_egk = L.tileLayer(config.kart.format.egk.url, {
        gkt: this.props.token,
        maxZoom: MAX_MAP_ZOOM_LEVEL,
        maxNativeZoom: 8
      }).addTo(this.map);
    if (!this.bakgrunnskart)
      this.bakgrunnskart = L.tileLayer("", {
        gkt: this.props.token,
        maxZoom: MAX_MAP_ZOOM_LEVEL,
        maxNativeZoom: 18
      }).addTo(this.map);
    this.bakgrunnskart.setUrl(config.kart.format[config.kart.aktivtFormat].url);
  }

  syncWmsLayers(aktive) {
    let layers = { ...this.state.wmslayers };
    let layersChanged = false;
    Object.keys(aktive).forEach(akey => {
      const kartlag = aktive[akey];
      if (!kartlag.wmsurl) return; // Not a WMS layer
      Object.keys(kartlag.underlag).forEach(underlagsnøkkel => {
        const underlag = kartlag.underlag[underlagsnøkkel];
        let layer = layers[underlag.id];
        if (!underlag.erSynlig) {
          if (layer) {
            this.map.removeLayer(layer);
            delete layers[underlag.id];
            layersChanged = true;
          }
          return;
        }

        const url = this.makeWmsUrl(kartlag.wmsurl);
        let srs = "EPSG3857";
        if (kartlag.projeksjon) {
          srs = kartlag.projeksjon.replace(":", "");
        }
        if (!layer) {
          layer = L.tileLayer.cachedOverview("", {
            id: underlag.id,
            zoomThreshold: underlag.minzoom,
            layers: underlag.wmslayer,
            transparent: true,
            crs: L.CRS[srs],
            format: "image/png",
            maxZoom: MAX_MAP_ZOOM_LEVEL,
            maxNativeZoom: underlag.maxzoom
          });
          layer.on("loading", () => {
            this.props.onTileStatus(kartlag.id, underlag.id, "loading");
          });
          layer.on("load", l => {
            //        this.props.onTileStatus(kartlag.id, underlag.id, "loaded");
          });
          layer.on("tileerror", e => {
            if (!underlag.tileerror) {
              this.props.onTileStatus(kartlag.id, underlag.id, "error");
            }
          });
          layers[underlag.id] = layer;
          this.map.addLayer(layer);
          layer.setUrl(url);
          layer.setOpacity(underlag.opacity);
          layersChanged = true;
        } else if (
          layer.options &&
          layer.options.opacity &&
          layer.options.opacity !== underlag.opacity
        ) {
          layer.setOpacity(underlag.opacity);
          layersChanged = true;
        }
      });
    });
    if (layersChanged) {
      this.setState({ wmslayers: layers });
    }
  }

  makeWmsUrl(url) {
    url = url.replace(/request=GetCapabilities/gi, "");
    url = url.replace(/service=WMS/gi, "");
    url = url.replace(/[&?]*$/gi, "");
    url = url.replace("{gkt}", this.props.token);
    url = url.replace(/srs=(?<srs>[^&]+)/i, "");
    return url;
  }

  markerButtonClass() {
    let name = "marker_type_button_container";
    if (this.props.showInfobox) name = name + " infobox-open";
    if (!this.props.isMobile) name = name + " margin-animation";
    return name;
  }

  goToSelectedZoomCoordinates = () => {
    // Zooming av kart
    let new_bounds;
    let max1 = this.props.zoomcoordinates.maxcoord[1];
    let max0 = this.props.zoomcoordinates.maxcoord[0];
    let min1 = this.props.zoomcoordinates.mincoord[1];
    let min0 = this.props.zoomcoordinates.mincoord[0];
    // Formobile, the ceter needs to be moved up since
    // the infobox takes the lower part of the screen
    if (this.props.isMobile) {
      const newMax1 = max1 - (max1 - min1) / 2;
      const newMin1 = min1 - (max1 - min1) / 2;
      new_bounds = [[newMax1, max0], [newMin1, min0]];
    } else {
      new_bounds = [[max1, max0], [min1, min0]];
    }
    this.map.flyToBounds(new_bounds);
    this.props.handleRemoveZoomCoordinates();
  };

  drawMarker = () => {
    // Draw map marker
    if (this.props.showMarker && this.state.coordinates_area) {
      this.removeMarker();
      this.setState({ previousCoordinates: this.state.coordinates_area });
      const lat = this.state.coordinates_area.lat;
      const lng = this.state.coordinates_area.lng;
      if (!lat || !lng) return;
      this.marker = L.marker([lat, lng], {
        icon: this.icon
      })
        .addTo(this.map)
        .on("click", () => this.clickMarkerInfobox())
        .on("keydown", e => {
          if (e.originalEvent && e.originalEvent.keyCode === 13) {
            this.clickMarkerInfobox();
          }
        });
    }
  };

  drawPolygon = () => {
    if ((this.props.polyline || this.props.polygon) && this.props.showPolygon) {
      // Starter med å fjerne forrige figur for å unngå duplikater
      this.removePolyline();
      this.removePolygon();
      this.removeEndPoint();
      this.removeStartPoint();

      // Draw polygon
      if (this.props.polyline && this.props.polyline.length > 0) {
        // I dette tilfellet har vi utelukkende en polylinje å tegne opp
        let polygon_list = this.props.polyline;

        // Tegn polylinjen:
        if (polygon_list.length > 1) {
          // Må ha mer enn et punkt for å tegne ei linje!
          this.polyline = L.polyline(polygon_list, {
            color: "red",
            lineJoin: "round"
          }).addTo(this.map);
        }

        // Tegn startspunktet på linjen
        this.startpoint = L.marker(polygon_list[0], {
          icon: inactiveIcon
        })
          .on("click", this.clickInactivePoint)
          .addTo(this.map);

        // Tegn sluttpunktet på linjen
        let length = polygon_list.length - 1 || 0;
        this.endpoint = L.marker(polygon_list[length], {
          icon: activeIcon
        })
          .on("click", this.clickActivePoint)
          .addTo(this.map);
      } else if (this.props.polygon) {
        // I dette tilfellet har vi utelukkende et polygon å tegne opp
        this.polygon = L.polygon(this.props.polygon, {
          color: "blue",
          lineJoin: "round"
        })
          .addTo(this.map)
          .on("click", () => this.clickPolygonInfobox());
      }
    }
  };

  drawFylkeGeom = () => {
    if (
      this.props.fylkeGeom &&
      this.props.showFylkeGeom &&
      this.state.markerType === "klikk"
    ) {
      // Remove to avoid duplicates
      this.removeFylkeGeom();

      // Draw polygon
      if (this.props.fylkeGeom.length > 0) {
        this.fylkeGeom = L.polygon(this.props.fylkeGeom, {
          color: "red",
          lineJoin: "round"
        }).addTo(this.map);
      }
    }
  };

  drawKommuneGeom = () => {
    if (
      this.props.kommuneGeom &&
      this.props.showKommuneGeom &&
      this.state.markerType === "klikk"
    ) {
      // Remove to avoid duplicates
      this.removeKommuneGeom();

      // Draw polygon
      if (this.props.kommuneGeom.length > 0) {
        this.kommuneGeom = L.polygon(this.props.kommuneGeom, {
          color: "#274e88",
          lineJoin: "round"
        }).addTo(this.map);
      }
    }
  };

  drawPropertyGeom = () => {
    if (
      this.props.eiendomGeom &&
      this.props.showEiendomGeom &&
      this.state.markerType === "klikk"
    ) {
      // Remove to avoid duplicates
      this.removePropertyGeom();

      // Draw polygon
      if (this.props.eiendomGeom.length > 0) {
        this.eiendomGeom = L.polygon(this.props.eiendomGeom, {
          color: "orange",
          lineJoin: "round"
        }).addTo(this.map);
      }
    }
  };

  drawGrenseGeom = () => {
    if (this.props.grensePolygonGeom) {
      // Remove to avoid duplicates
      this.removeGrenseGeom();

      // Draw polygon
      if (this.props.grensePolygonGeom.length > 0) {
        this.grensePolygonGeom = L.polygon(this.props.grensePolygonGeom, {
          color: "blue",
          lineJoin: "round"
        }).addTo(this.map);
      }
    }
  };

  render() {
    return (
      <>
        <InfoboxSide
          markerType={this.state.markerType}
          coordinates_area={this.state.coordinates_area}
          getBackendData={this.getBackendData}
          showInfobox={this.props.showInfobox}
          handleInfobox={this.props.handleInfobox}
          showFullscreenInfobox={this.props.showFullscreenInfobox}
          handleFullscreenInfobox={this.props.handleFullscreenInfobox}
          layersResult={this.props.layersResult}
          allLayersResult={this.props.allLayersResult}
          valgteLag={this.props.valgteLag}
          sted={this.props.sted}
          adresse={this.props.adresse}
          matrikkel={this.props.matrikkel}
          elevation={this.props.elevation}
          resultat={this.props.resultat}
          kartlag={this.props.kartlag}
          showExtensiveInfo={this.props.showExtensiveInfo}
          handleExtensiveInfo={this.props.handleExtensiveInfo}
          loadingFeatures={this.props.loadingFeatures}
          isMobile={this.props.isMobile}
          polygon={this.props.polygon}
          polyline={this.props.polyline}
          showPolygon={this.props.showPolygon}
          hideAndShowPolygon={this.props.hideAndShowPolygon}
          handleEditable={this.props.handleEditable}
          addPolygon={this.props.addPolygon}
          addPolyline={this.props.addPolyline}
          polygonResults={this.props.polygonResults}
          handlePolygonResults={this.props.handlePolygonResults}
          infoboxDetailsVisible={this.props.infoboxDetailsVisible}
          setInfoboxDetailsVisible={this.props.setInfoboxDetailsVisible}
          polygonDetailsVisible={this.props.polygonDetailsVisible}
          setPolygonDetailsVisible={this.props.setPolygonDetailsVisible}
          setLayerInfoboxDetails={this.props.setLayerInfoboxDetails}
          sortKey={this.props.sortKey}
          tagFilter={this.props.tagFilter}
          matchAllFilters={this.props.matchAllFilters}
          showEiendomGeom={this.props.showEiendomGeom}
          handlePropertyGeom={this.props.handlePropertyGeom}
          showFylkeGeom={this.props.showFylkeGeom}
          handleFylkeGeom={this.props.handleFylkeGeom}
          showKommuneGeom={this.props.showKommuneGeom}
          handleKommuneGeom={this.props.handleKommuneGeom}
          grensePolygon={this.props.grensePolygon}
          grensePolygonGeom={this.props.grensePolygonGeom}
          handleGrensePolygon={this.props.handleGrensePolygon}
          removeGrensePolygon={this.props.removeGrensePolygon}
          showFylkePolygon={this.props.showFylkePolygon}
          showKommunePolygon={this.props.showKommunePolygon}
          showEiendomPolygon={this.props.showEiendomPolygon}
          grensePolygonData={this.props.grensePolygonData}
          legendVisible={this.props.legendVisible}
          setLegendVisible={this.props.setLegendVisible}
          legendPosition={this.props.legendPosition}
          uploadPolygonFile={this.props.uploadPolygonFile}
          handlePolygonSaveModal={this.props.handlePolygonSaveModal}
          getSavedPolygons={this.props.getSavedPolygons}
        />
        <div className="leaflet-main-wrapper">
          {(!this.props.isMobile ||
            (this.props.isMobile && !this.props.showAppName)) && (
            <div className={this.markerButtonClass()}>
              <button
                id="marker-button-map"
                className={this.state.markerType === "klikk" ? "active" : ""}
                title="Marker tool"
                alt="Marker tool"
                onClick={() => this.activateMarker()}
                onMouseDown={e => e.preventDefault()}
              >
                <WhereToVote />
              </button>
              <button
                id="polygon-button-map"
                className={this.state.markerType === "polygon" ? "active" : ""}
                title="Polygon tool"
                alt="Polygon tool"
                onClick={() => this.activatePolygon()}
                onMouseDown={e => e.preventDefault()}
              >
                <CustomIcon
                  id="polygon-button-icon"
                  icon="hexagon-slice-4"
                  size={24}
                  color={"#FFFFFF"}
                />
              </button>
            </div>
          )}

          <KartVelger
            handleSetBakgrunnskart={this.props.handleSetBakgrunnskart}
            aktivtFormat={this.props.aktivtFormat}
            showSideBar={this.props.showSideBar}
            showInfobox={this.props.showInfobox}
            isMobile={this.props.isMobile}
          />

          <div
            style={{ zIndex: -100, cursor: "default" }}
            ref={ref => {
              this.mapEl = ref;
            }}
          />

          <ArtsdatabankenLogo
            showSideBar={this.props.showSideBar}
            showInfobox={this.props.showInfobox}
            isMobile={this.props.isMobile}
          />

          <button
            className="map_button currentlyhidden"
            alt="Geolokalisering"
            title="Geolokalisering"
            onClick={() => {
              //this.props.handleFullscreen(false);
              //this.handleLocate();
            }}
          >
            <LocationSearching />
          </button>
          <PolygonActions
            showPolygonSaveModal={this.props.showPolygonSaveModal}
            handlePolygonSaveModal={this.props.handlePolygonSaveModal}
            polygonActionResult={this.props.polygonActionResult}
            closePolygonActionResult={this.props.closePolygonActionResult}
            savePolygon={this.props.savePolygon}
            showSavedPolygons={this.props.showSavedPolygons}
            savedPolygons={this.props.savedPolygons}
            handleShowSavedPolygons={this.props.handleShowSavedPolygons}
            openSavedPolygon={this.props.openSavedPolygon}
            deleteSavedPolygon={this.props.deleteSavedPolygon}
            updateSavedPolygon={this.props.updateSavedPolygon}
            polylineError={this.state.polylineError}
            handlePolylineError={this.handlePolylineError}
            isMobile={this.props.isMobile}
          />
        </div>
      </>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default Leaflet;
