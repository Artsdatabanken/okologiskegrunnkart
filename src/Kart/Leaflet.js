import L from "leaflet";
import "./TileLayer.CachedOverview";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
import { LocationSearching, WhereToVote, Gesture } from "@material-ui/icons";
import InfoboxSide from "../Forvaltningsportalen/FeatureInfo/InfoboxSide";
import "../style/leaflet.css";

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
    windowXpos: 0,
    windowYpos: 0,
    showPopup: false,
    buttonUrl: null,
    sted: null,
    adresse: null,
    data: null,
    koordinat: null,
    clickCoordinates: { x: 0, y: 0 },
    markerType: "klikk",
    coordinates_area: null,
    zoom: 0,
    showForbidden: false,
    closeWarning: null
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

    // For servere som bare støtter 900913
    L.CRS.EPSG900913 = Object.assign({}, L.CRS.EPSG3857);
    L.CRS.EPSG900913.code = "EPSG:900913";
    map.on("click", e => {
      this.handleClick(e);
    });

    map.on("zoomend", e => {
      if (!e.hard) {
        const zoom = this.map.getZoom();
        if (zoom === this.props.zoom) return;
        this.syncWmsLayers(this.props.aktiveLag);
        this.props.handleZoomChange(zoom);
      }
    });

    map.setView(
      [this.props.latitude, this.props.longitude],
      this.props.zoom * 1.8
    );

    L.control.zoom({ position: "topright" }).addTo(map);
    L.DomUtil.addClass(map._container, "crosshair-cursor-enabled");
    this.icon = L.icon({
      iconUrl: "/marker/marker-icon-2x-orange.png",
      iconSize: [22, 36],
      iconAnchor: [11, 36]
    });
  }
  erEndret(prevProps) {
    if (this.props.aktiveLag !== prevProps.aktiveLag) return true;
    if (this.props.bakgrunnskart !== prevProps.bakgrunnskart) return true;
    if (this.props.show_current !== prevProps.show_current) return true;
    if (this.props.token !== prevProps.token) return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.zoomcoordinates) {
      this.goToSelectedZoomCoordinates();
    }
    if (this.erEndret(prevProps)) {
      this.updateMap(this.props);
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

  getBackendData = async (lng, lat, e) => {
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
    this.setState({
      coordinates_area: e.latlng,
      layerevent: e.layerPoint
    });

    if (this.props.showExtensiveInfo) {
      this.props.handleAlleLag(e.latlng.lng, e.latlng.lat, this.map.getZoom());
    } else {
      this.props.handleValgteLag(
        e.latlng.lng,
        e.latlng.lat,
        this.map.getZoom()
      );
    }

    // Bygger ny url, ikke egentlig i bruk på dette tidspunkt, men vil bli etter hvert
    let urlparams = (this.props.path || "").split("?");
    let newurlstring = "";
    for (let i in urlparams) {
      if (!urlparams[i].includes("lng") && urlparams[i] !== "") {
        newurlstring += "?" + urlparams[i];
      }
    }
    this.props.history.push(
      "?lng=" + e.latlng.lng + "&lat=" + e.latlng.lat + newurlstring
    );
  }

  checkIntersectingLines(lat1, lng1, lat2, lng2, lat3, lng3, lat4, lng4) {
    const det = (lat2 - lat1) * (lng4 - lng3) - (lat4 - lat3) * (lng2 - lng1);
    if (det === 0) {
      return false;
    } else {
      const lambda =
        ((lng4 - lng3) * (lat4 - lat1) + (lat3 - lat4) * (lng4 - lng1)) / det;
      const gamma =
        ((lng1 - lng2) * (lat4 - lat1) + (lat2 - lat1) * (lng4 - lng1)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  checkPolylineIsValid(newLat, newLng) {
    const polyline = this.props.polyline;
    if (!polyline || polyline.length < 2) return true;
    const lat1 = polyline[polyline.length - 1][0];
    const lng1 = polyline[polyline.length - 1][1];
    for (let i = 1; i < polyline.length; i++) {
      const lat3 = polyline[i - 1][0];
      const lng3 = polyline[i - 1][1];
      const lat4 = polyline[i][0];
      const lng4 = polyline[i][1];
      const intersecting = this.checkIntersectingLines(
        lat1,
        lng1,
        newLat,
        newLng,
        lat3,
        lng3,
        lat4,
        lng4
      );
      if (intersecting) return false;
    }
    return true;
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
        const isValid = this.checkPolylineIsValid(latlng.lat, latlng.lng);
        if (!isValid) {
          if (this.state.closeWarning) {
            clearTimeout(this.state.closeWarning);
            this.setState({ closeWarning: null });
          }
          const x = e.containerPoint ? e.containerPoint.x - 55 : null;
          const y = e.containerPoint
            ? Math.max(e.containerPoint.y - 50, 0)
            : "50px";
          const box = document.querySelector(".polygon-warning-wrapper");
          box.style.setProperty("--x", x + "px");
          box.style.setProperty("--y", y + "px");
          const closeWarning = setTimeout(
            () => this.setState({ showForbidden: false, closeWarning: null }),
            1500
          );
          this.setState({ showForbidden: true, closeWarning });
        } else {
          polygon_list.push([latlng.lat, latlng.lng]);
          this.props.addPolyline(polygon_list);
        }
      }
    }
  }

  handleClick = async e => {
    if (this.state.markerType === "polygon") {
      this.polygonToolClick(e);
    } else if (this.state.markerType === "klikk") {
      this.markerClick(e).then(() => this.props.handleInfobox(true));
    }
    return;
  };

  updateMap(props) {
    if (!this.props.token) return; // not yet loaded
    this.updateBaseMap();
    this.syncWmsLayers(props.aktiveLag);
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
    Object.keys(aktive).forEach(akey => {
      const kartlag = aktive[akey];
      if (!kartlag.wmsurl) return; // Not a WMS layer
      Object.keys(kartlag.underlag).forEach(underlagsnøkkel =>
        this.syncUnderlag(kartlag, kartlag.underlag[underlagsnøkkel])
      );
    });
  }

  wmslayers = {};

  syncUnderlag(kartlag, underlag) {
    var layer = this.wmslayers[underlag.id];
    if (!underlag.erSynlig) {
      if (layer) {
        this.map.removeLayer(layer);
        delete this.wmslayers[underlag.id];
      }
      return;
    }

    var url = this.makeWmsUrl(kartlag.wmsurl);
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
      this.wmslayers[underlag.id] = layer;
      this.map.addLayer(layer);
    }
    layer.setUrl(url);
    layer.setOpacity(underlag.opacity);
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
    // Opptegning av markør
    this.removeMarker();
    this.marker = L.marker(
      [
        this.props.zoomcoordinates.centercoord[1],
        this.props.zoomcoordinates.centercoord[0]
      ],
      {
        icon: this.icon
      }
    ).addTo(this.map);

    // Zooming av kart?
    let new_bounds = [
      [
        this.props.zoomcoordinates.maxcoord[1],
        this.props.zoomcoordinates.maxcoord[0]
      ],
      [
        this.props.zoomcoordinates.mincoord[1],
        this.props.zoomcoordinates.mincoord[0]
      ]
    ];
    this.map.fitBounds(new_bounds);
    this.props.handleRemoveZoomCoordinates();
  };

  render() {
    this.openLinksInNewTab();
    this.positionZoomButtons();
    this.positionleafletLink();
    // Polygontegning og Polylinjetegning
    if (this.props.polyline || this.props.polygon) {
      // Starter med å fjerne forrige figur for å unngå duplikater
      this.removePolyline();
      this.removePolygon();
      this.removeEndPoint();
      this.removeStartPoint();

      // Draw polygon
      if (this.props.polyline && this.props.polyline.length > 0) {
        // I dette tilfellet har vi utelukkende en polylinje å tegne opp
        if (this.props.showPolygon) {
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
        }
      } else if (this.props.polygon) {
        // I dette tilfellet har vi utelukkende et polygon å tegne opp
        if (this.props.showPolygon) {
          this.polygon = L.polygon(this.props.polygon, {
            color: "blue",
            lineJoin: "round"
          })
            .addTo(this.map)
            .on("click", () => this.clickMarkerInfobox());
        }
      }
    }

    // Draw map marker
    if (
      this.props.showMarker &&
      this.state.markerType === "klikk" &&
      this.state.coordinates_area
    ) {
      this.removeMarker();
      this.marker = L.marker(
        [this.state.coordinates_area.lat, this.state.coordinates_area.lng],
        {
          icon: this.icon
        }
      )
        .addTo(this.map)
        .on("click", () => this.clickMarkerInfobox());
    } else if (!this.props.showMarker) {
      this.removeMarker();
    }

    return (
      <div className="leaflet-main-wrapper">
        <div className={this.markerButtonClass()}>
          <button
            id="marker-button-map"
            className={this.state.markerType === "klikk" ? "active" : ""}
            title="Marker tool"
            alt="Marker tool"
            onClick={() => {
              this.setState({
                markerType: "klikk"
              });
              this.props.hideAndShowPolygon(false);
              this.props.hideAndShowMarker(true);
              this.props.handleInfobox(true);
            }}
            onMouseDown={e => e.preventDefault()}
          >
            <WhereToVote />
          </button>
          <button
            id="poligon-button-map"
            className={this.state.markerType === "polygon" ? "active" : ""}
            title="Polygon tool"
            alt="Polygon tool"
            onClick={() => {
              this.setState({
                markerType: "polygon"
              });
              this.props.hideAndShowMarker(false);
              this.props.hideAndShowPolygon(true);
              this.props.handleInfobox(true);
            }}
            onMouseDown={e => e.preventDefault()}
          >
            <Gesture />
          </button>
        </div>

        <div
          style={{ zIndex: -100, cursor: "default" }}
          ref={ref => {
            this.mapEl = ref;
          }}
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
        <InfoboxSide
          markerType={this.state.markerType}
          coordinates_area={this.state.coordinates_area}
          layerevent={this.state.layerevent}
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
          setLayerInfoboxDetails={this.props.setLayerInfoboxDetails}
        />
        {this.state.markerType === "polygon" && (
          <div
            className={`polygon-warning-wrapper${
              this.state.showForbidden ? "" : " hidden-warning"
            }`}
          >
            Polygon kanter kan ikke krysse
          </div>
        )}
      </div>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default Leaflet;
