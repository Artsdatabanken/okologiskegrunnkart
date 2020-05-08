import L from "leaflet";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
import Tangram from "tangram";
import { createScene, updateScene } from "./scene/scene";
import { LocationSearching, WhereToVote } from "@material-ui/icons";
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
    data: null,
    koordinat: null,
    clickCoordinates: { x: 0, y: 0 },
    markerTool: true,
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
    let def = {
      scene: createScene(this.props),
      events: {
        hover: function(selection) {},
        click: this.handleClick,
        drag: this.handleDrag
      },
      attribution: '<a href="https://artsdatabanken.no">Artsdatabanken</a>'
    };

    this.layer = Tangram.leafletLayer(def);
    this.map.addLayer(this.layer);
    // this.layer.loadScene(this.layer.scene)
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
      data: null
    });
    if (!this.marker) return;
    this.map.removeLayer(this.marker);
  }

  getBackendData = async (lng, lat, e) => {
    this.props.handleExtensiveInfo(true);
    this.props.handleLokalitetUpdate(lng, lat);
  };

  handleInfobox = bool => {
    this.setState({ showInfobox: bool });
  };

  handleClick = e => {
    if (!this.state.markerTool) return;
    this.props.handleExtensiveInfo(false);
    const latlng = e.leaflet_event.latlng;
    this.removeMarker();
    this.setState({
      showInfobox: true,
      coordinates_area: latlng,
      layerevent: e.leaflet_event.layerPoint
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
    if (!this.layer.scene.config) return; // not yet loaded
    updateScene(this.layer.scene.config, props);
    this.layer.scene.updateConfig({ rebuild: true });
    this.syncWmsLayers(props.aktiveLag);
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
        {this.state.markerTool === true && this.state.showInfobox && (
          <InfoBox
            coordinates_area={this.state.coordinates_area}
            layerevent={this.state.layerevent}
            getBackendData={this.getBackendData}
            layersresultat={this.props.layersresultat}
            valgteLag={this.props.valgteLag}
            sted={this.props.sted}
            handleInfobox={this.handleInfobox}
            onUpdateLayerProp={this.props.onUpdateLayerProp}
          />
        )}
        <button
          className={
            this.state.markerTool === true
              ? "map_button active currentlyhidden"
              : "map_button currentlyhidden"
          }
          title="Marker tool"
          alt="Marker tool"
          onClick={e => {
            console.log("Already chosen marker tool");
            this.setState({
              markerTool: !this.state.markerTool
            });
          }}
        >
          <WhereToVote />
        </button>

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
            console.log("geolocate button clicked");
          }}
        >
          <LocationSearching />
        </button>
      </>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default Leaflet;
