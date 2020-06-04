import L from "leaflet";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
import { LocationSearching, WhereToVote, Gesture } from "@material-ui/icons";
import InfoBox from "../Forvaltningsportalen/FeatureInfo/InfoBox";
import "../style/leaflet.css";

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
    markerType: "klikk",
    showInfobox: false,
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
    L.control.zoom({ position: "topright" }).addTo(map);
    L.DomUtil.addClass(map._container, "crosshair-cursor-enabled");
    this.map = map;
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

  removePolygon() {
    if (!this.polygon) return;
    this.map.removeLayer(this.polygon);
  }

  removePolyline() {
    if (!this.polyline) return;
    this.map.removeLayer(this.polyline);
  }

  getBackendData = async (lng, lat, e) => {
    this.props.handleExtensiveInfo(true);
    this.props.handleLokalitetUpdate(lng, lat, this.map.getZoom());
  };

  handleInfobox = bool => {
    this.setState({ showInfobox: bool });
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

  handleClick = e => {
    if (this.state.markerType === "polygon") {
      if (!this.props.polygon) {
        // Hvis polygon er satt, har personen klikket på ferdig-knappen.
        let polygon_list = this.props.polyline;
        const latlng = e.latlng;
        polygon_list.push([latlng.lat, latlng.lng]);
        this.props.addPolyline(polygon_list);
      }
    }

    if (this.state.markerType !== "klikk") return;
    this.props.handleExtensiveInfo(false);
    const latlng = e.latlng;
    this.removeMarker();
    this.setState({
      showInfobox: true,
      coordinates_area: latlng,
      layerevent: e.layerPoint
    });

    let urlparams = (this.props.path || "").split("?");
    let newurlstring = "";
    for (let i in urlparams) {
      if (!urlparams[i].includes("lng") && urlparams[i] !== "") {
        newurlstring += "?" + urlparams[i];
      }
    }

    this.marker = L.marker([latlng.lat, latlng.lng], {
      icon: this.icon
    }).addTo(this.map);
    this.props.history.push(
      "?lng=" + latlng.lng + "&lat=" + latlng.lat + newurlstring
    );
    this.props.handleValgteLag(latlng.lng, latlng.lat, this.map.getZoom());
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
    if (al.erSynlig && underlag.erSynlig) {
      const { url, srs } = this.makeWmsUrl(al.wmsurl);
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
    url = url.replace(/request=GetCapabilities/gi, "");
    url = url.replace(/service=WMS/gi, "");
    url = url.replace(/[&?]*$/gi, "");
    url = url.replace("{gkt}", this.props.token);
    var srs = url.match(/srs=(?<srs>[^&]+)/i);
    url = url.replace(/srs=(?<srs>[^&]+)/i, "");
    return { url, srs: srs && srs.groups.srs.replace(":", "") };
  }

  render() {
    this.openLinksInNewTab();
    if (this.props.polyline && this.props.polyline.length > 0) {
      this.removePolyline();
      if (this.props.showPolygon) {
        let polygon_list = this.props.polyline;
        if (polygon_list.length < 2) {
          // Midelertidig hack inntil jeg får fiksa et startpunkt i steden.
          if (polygon_list[0]) {
            polygon_list.push([
              polygon_list[0][0] + 0.0001,
              polygon_list[0][1] + 0.0001
            ]);
          }
        }
        this.polyline = L.polyline(polygon_list, {
          color: "red",
          lineJoin: "round"
        }).addTo(this.map);
      }
    } else {
      this.removePolyline();
    }
    if (this.props.polygon) {
      this.removePolygon();
      if (this.props.showPolygon) {
        this.polygon = L.polygon(this.props.polygon, {
          color: "blue",
          lineJoin: "round"
        }).addTo(this.map);
      }
    } else {
      this.removePolygon();
    }
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
        <div className="marker_type_button_container">
          <button
            className={this.state.markerType === "klikk" ? "active" : ""}
            title="Marker tool"
            alt="Marker tool"
            onClick={e => {
              this.setState({
                markerType: "klikk"
              });
            }}
          >
            <WhereToVote />
          </button>
          <button
            className={this.state.markerType === "polygon" ? "active" : ""}
            title="Polygon tool"
            alt="Polygon tool"
            onClick={e => {
              this.setState({
                markerType: "polygon"
              });
            }}
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
        {this.state.markerType === "klikk" && this.state.showInfobox && (
          <InfoBox
            coordinates_area={this.state.coordinates_area}
            layerevent={this.state.layerevent}
            getBackendData={this.getBackendData}
            layersresultat={this.props.layersresultat}
            valgteLag={this.props.valgteLag}
            sted={this.props.sted}
            adresse={this.props.adresse}
            handleInfobox={this.handleInfobox}
            onUpdateLayerProp={this.props.onUpdateLayerProp}
          />
        )}
      </>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default Leaflet;
