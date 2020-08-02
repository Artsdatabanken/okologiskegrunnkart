import L from "leaflet";
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
  }

  removePolygon() {
    this.polygon && this.map.removeLayer(this.polygon);
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
      leafletLink.setAttribute("target", "_blank");
      leafletLink.setAttribute("rel", "noopener noreferrer");
    }
  };

  clickInactivePoint = e => {
    const index = e.target.options.index;
    const polyline = this.props.polyline;
    polyline.selectedIndex = polyline.selectedIndex === index ? null : index;
    this.props.addPolyline(polyline);
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
    if (!this.props.editable) return;

    if (!this.props.polygon) {
      // Hvis polygon er satt, har personen klikket på ferdig-knappen,
      // og polylinje skal da ikke oppdateres.
      let polyline = this.props.polyline;
      const latlng = e.latlng;
      const point = { coords: [latlng.lat, latlng.lng] };
      const index = polyline.coords.length;
      polyline.coords.push(point);
      this.props.addPolyline(polyline);
      backend
        .hentStedsnavn(latlng.lng, latlng.lat, this.map.getZoom())
        .then(r => {
          const sted = r.pop();
          const point = this.props.polyline.coords[index];
          point.sted = sted.komplettskrivemåte[0];
          this.props.addPolyline(polyline);
        });
    }
  }

  handleClick = e => {
    const markerType = this.getMarkerType();
    if (markerType === "polygon") {
      this.polygonToolClick(e);
    } else if (markerType === "klikk") {
      this.markerClick(e);
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
        gkt: this.props.token
      }).addTo(this.map);
    if (!this.bakgrunnskart)
      this.bakgrunnskart = L.tileLayer("", { gkt: this.props.token }).addTo(
        this.map
      );
    this.bakgrunnskart.setUrl(config.kart.format[config.kart.aktivtFormat].url);
  }

  syncWmsLayers(aktive) {
    Object.keys(aktive).forEach(akey => {
      const al = aktive[akey];
      const layerName = "wms_" + akey;
      if (al.underlag) {
        Object.keys(al.underlag).forEach(underlagsnøkkel => {
          const nøkkel = layerName + ":" + underlagsnøkkel;
          this.syncUnderlag(nøkkel, al, al.underlag[underlagsnøkkel]);
        });
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
        layer = L.tileLayer.wms("", {
          layers: underlag.wmslayer,
          transparent: true,
          crs: L.CRS[srs],
          format: "image/png",
          opacity: underlag.opacity
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
    // Polygontegning og Polylinjetegning
    const polyline = this.props.polyline;
    if (polyline) {
      // Starter med å fjerne forrige figur for å unngå duplikater
      this.removePolyline();
      this.removePolygon();

      const coords = polyline.coords.map(co => co.coords);
      if (polyline.coords.length > 0) {
        if (polyline.shapeType === "linje") {
          // Tegn polylinjen:
          if (coords.length > 1) {
            // Må ha mer enn et punkt for å tegne ei linje!
            this.polyline = L.polyline(coords, {
              color: "red",
              lineJoin: "round"
            }).addTo(this.map);
          }
        } else if (polyline.shapeType === "polygon") {
          // I dette tilfellet har vi utelukkende et polygon å tegne opp
          this.polygon = L.polygon(coords, {
            color: "blue",
            lineJoin: "round"
          }).addTo(this.map);
        }
        for (var marker of this.polylinemarkers) this.map.removeLayer(marker);
        this.polylinemarkers = [];
        for (var i = 0; i < polyline.coords.length; i++) {
          var marker = L.marker(polyline.coords[i].coords, {
            icon: L.divIcon({
              className:
                i === polyline.selectedIndex
                  ? "active_point"
                  : "inactive_point",
              html: i
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
