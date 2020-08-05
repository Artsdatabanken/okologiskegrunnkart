import L from "leaflet";
import "./TileLayer.CachedOverview";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
// import InfoBox from "../Forvaltningsportalen/FeatureInfo/InfoBox";
import InfoboxSide from "../Forvaltningsportalen/FeatureInfo/InfoboxSide";
import "../style/leaflet.css";
import { withRouter } from "react-router-dom";
import backend from "../Funksjoner/backend";

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
    coordinates_area: null
  };

  componentDidMount() {
    const options = {
      zoomControl: false,
      inertia: true,
      minZoom: 3
    };

    let map = L.map(this.mapEl, options);
    // For servere som bare støtter 900913
    L.CRS.EPSG900913 = Object.assign({}, L.CRS.EPSG3857);
    L.CRS.EPSG900913.code = "EPSG:900913";
    map.on("click", e => {
      this.handleClick(e);
    });
    map.on("drag", e => {
      if (!e.hard) {
        this.props.onMapBoundsChange(map.getBounds());
      }
    });
    map.on("zoomend", e => {
      if (!e.hard) {
        this.props.onMapBoundsChange(map.getBounds());
      }
    });
    map.on("resize", e => {
      if (!e.hard) {
        this.props.onMapBoundsChange(map.getBounds());
      }
    });
    map.setView(
      [this.props.latitude, this.props.longitude],
      this.props.zoom * 1.8
    );
    this.map = map;
    this.polylinemarkers = [];
    this.layers = {};
    this.icon = L.icon({
      iconUrl: "/marker/pdoc.png",
      iconSize: [38, 51],
      iconAnchor: [19, 41]
    });
  }
  erEndret(prevProps) {
    if (this.props.aktiveLag !== prevProps.aktiveLag) return true;
    if (this.props.bakgrunnskart !== prevProps.bakgrunnskart) return true;
    if (this.props.show_current !== prevProps.show_current) return true;
    if (this.props.token !== prevProps.token) return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.bounds !== prevProps.bounds) {
      const bounds = this.props.bounds;
      if (bounds) {
        this.map.flyToBounds(bounds);
      }
    }
    if (this.erEndret(prevProps)) {
      this.updateMap(this.props);
      return;
    }
  }

  removeMarker() {
    this.setState({
      sted: null,
      adresse: null,
      data: null
    });
    if (!this.marker) return;
    this.map.removeLayer(this.marker);
  }

  removePolyline() {
    this.polyline && this.map.removeLayer(this.polyline);
    this.polygon && this.map.removeLayer(this.polygon);
    if (this.polylinemarkers)
      for (var marker of this.polylinemarkers) this.map.removeLayer(marker);
  }

  getBackendData = async (lng, lat, e) => {
    this.props.handleExtensiveInfo(true);
    this.props.handleLokalitetUpdate(lng, lat, this.map.getZoom());
  };

  openLinksInNewTab = () => {
    // Remove default leaflet link in map so it
    // isn't selectable with tabs navigation
    const leafletLink = document.querySelector(
      ".leaflet-control-attribution a"
    );
    if (leafletLink) {
      leafletLink.style = "display: none";
      leafletLink.setAttribute("target", "_blank");
      leafletLink.setAttribute("rel", "noopener noreferrer");
    }
  };

  clickInactivePoint = e => {
    const index = e.target.options.index;
    const polyline = this.props.polyline;
    polyline.selectedIndex = polyline.selectedIndex === index ? null : index;
    this.props.onUpdatePolyline(polyline);
  };

  markerClick(e) {
    // Oppdatering av kartmarkøren
    this.removeMarker();
    this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: this.icon
    }).addTo(this.map);

    // Oppdatering av infoboksen
    this.props.handleExtensiveInfo(false);
    this.setState({
      coordinates_area: e.latlng,
      layerevent: e.layerPoint
    });
    this.props.handleInfobox(true);
    this.props.handleValgteLag(e.latlng.lng, e.latlng.lat, this.map.getZoom());

    this.props.history.push("?lng=" + e.latlng.lng + "&lat=" + e.latlng.lat);
  }

  polygonToolClick(e) {
    let polyline = this.props.polyline;
    if (!polyline) return;
    const latlng = e.latlng;
    const point = { coords: [latlng.lat, latlng.lng] };
    const index = polyline.selectedIndex;
    polyline.selectedIndex = index + 1;
    polyline.coords.splice(index + 1, 0, point);
    polyline.coords = polyline.coords.slice();
    this.props.onUpdatePolyline(polyline);
    backend
      .hentStedsnavn(latlng.lng, latlng.lat, this.map.getZoom())
      .then(r => {
        const sted = r.pop();
        point.sted =
          sted && sted.komplettskrivemåte && sted.komplettskrivemåte[0];
        this.props.onUpdatePolyline(polyline);
      });
  }

  handleClick = e => {
    const markerType = this.getMarkerType();
    if (markerType === "polygon") this.polygonToolClick(e);
    else if (markerType === "klikk") this.markerClick(e);
  };

  updateMap(props) {
    if (!this.props.token) return; // not yet loaded
    this.updateBaseMap();
    this.syncWmsLayers(props.aktiveLag);
  }

  showGeojson(key, layer) {
    if (!layer) {
      if (!this.layers[key]) return;
      this.map.removeLayer(this.layers[key]);
      this.layers[key] = null;
      return;
    }

    var myLines = [
      {
        type: "LineString",
        coordinates: [[-100, 40], [-105, 45], [-110, 55]]
      },
      {
        type: "LineString",
        coordinates: [[-105, 40], [-110, 45], [-115, 55]]
      }
    ];

    var myStyle = {
      color: "#ff7800",
      weight: 5,
      opacity: 0.65
    };

    const geojson = layer.kart.format.geojson.data;
    this.layers[key] = L.geoJSON(geojson, {
      style: myStyle
    }).addTo(this.map);
    this.map.flyToBounds(geojson.bounds);
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

  syncWmsLayers(kartlag) {
    Object.keys(kartlag).forEach(akey => {
      const layer = kartlag[akey];
      if (!layer) return;
      const format = Object.keys(layer.kart.format)[0];
      if (format === "geojson") this.showGeojson(akey, layer);
      if (format === "wms") {
        if (layer.underlag) {
          Object.keys(layer.underlag).forEach(underlagsnøkkel => {
            const nøkkel = "wms_" + akey + ":" + underlagsnøkkel;
            this.syncUnderlag(nøkkel, layer, layer.underlag[underlagsnøkkel]);
          });
        }
      }
    });
  }
  wms = {};

  syncUnderlag(layerName, al, underlag) {
    var layer = this.wms[layerName];
    if (underlag.opacity > 0) {
      const url = this.makeWmsUrl(al.wmsurl);
      let srs = "EPSG3857";
      if (al.projeksjon) {
        srs = al.projeksjon.replace(":", "");
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
        this.wms[layerName] = layer;
        this.map.addLayer(layer);
      }
      layer.setUrl(url);
      layer.setOpacity(underlag.opacity);
    } else {
      if (layer) {
        this.map.removeLayer(layer);
        delete this.wms[layerName];
      }
    }
  }

  makeWmsUrl(url) {
    url = url.replace(/service=WMS/gi, "");
    url = url.replace(/[&?]*$/gi, "");
    url = url.replace("{gkt}", this.props.token);
    url = url.replace(/srs=(?<srs>[^&]+)/i, "");
    return url;
  }

  getMarkerType() {
    return this.props.location.pathname === "/tegn/kartlag"
      ? "polygon"
      : "klikk";
  }

  render() {
    const markerType = this.getMarkerType();
    this.openLinksInNewTab();
    const polyline = this.props.polyline;
    if (polyline) {
      // Starter med å fjerne forrige figur for å unngå duplikater
      this.removePolyline();

      const coords = polyline.coords.map(co => co.coords);
      if (polyline.coords.length > 0) {
        if (polyline.shapeType === "linje") {
          if (coords.length > 1) {
            this.polyline = L.polyline(coords, {
              color: "rgba(255,50,50,0.5)",
              lineJoin: "round"
            }).addTo(this.map);
          }
        } else if (polyline.shapeType === "polygon") {
          // I dette tilfellet har vi utelukkende et polygon å tegne opp
          this.polygon = L.polygon(coords, {
            color: "rgba(255,50,50,0.5)",
            _lineJoin: "round"
          }).addTo(this.map);
        }
        this.polylinemarkers = [];
        for (var i = 0; i < polyline.coords.length; i++) {
          var marker = L.marker(polyline.coords[i].coords, {
            icon: L.divIcon({
              className:
                i === polyline.selectedIndex
                  ? "active_point"
                  : "inactive_point",
              html:
                '<div style="position: relative; top: 8px; left: 8px">' +
                (i + 1) +
                "</div>"
            }),
            index: i
          })
            .on("click", this.clickInactivePoint)
            .addTo(this.map);
          this.polylinemarkers.push(marker);
        }
      }
    }

    // Opptegning av markør
    if (this.props.zoomcoordinates) {
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
    }
    return (
      <>
        <div
          style={{ zIndex: -100, cursor: "default" }}
          ref={ref => {
            this.mapEl = ref;
          }}
        />

        {markerType === "klikk" && this.props.showInfobox && (
          <InfoboxSide
            coordinates_area={this.state.coordinates_area}
            layerevent={this.state.layerevent}
            getBackendData={this.getBackendData}
            layersResult={this.props.layersResult}
            valgteLag={this.props.valgteLag}
            sted={this.props.sted}
            adresse={this.props.adresse}
            handleInfobox={this.props.handleInfobox}
            onUpdateLayerProp={this.props.onUpdateLayerProp}
            showExtensiveInfo={this.props.showExtensiveInfo}
            handleExtensiveInfo={this.props.handleExtensiveInfo}
            {...this.props}
          />
        )}
      </>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default withRouter(Leaflet);
