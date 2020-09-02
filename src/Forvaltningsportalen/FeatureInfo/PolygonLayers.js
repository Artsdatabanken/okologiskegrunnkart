import React, { useState } from "react";
import {
  Button,
  Checkbox,
  ListItem,
  ListItemText,
  Collapse
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import "../../style/infobox.css";
import backend from "../../Funksjoner/backend";

const PolygonLayers = ({
  availableLayers,
  polygon,
  handlePolygonResults,
  handleLoadingFeatures
}) => {
  const [searchLayers, setSearchLayers] = useState(availableLayers);
  const [menuOpen, setMenuOpen] = useState(false);

  const calculateAreaReport = () => {
    if (!polygon || polygon.length < 2) return;
    handlePolygonResults(null);
    const layerCodes = [];
    for (const layer of searchLayers) {
      if (!layer.selected || !layer.code) continue;
      layerCodes.push(layer.code);
    }
    if (layerCodes.length > 0) {
      handleLoadingFeatures(true);
      backend.makeAreaReport(layerCodes, polygon).then(result => {
        handlePolygonResults(result);
        handleLoadingFeatures(false);
      });
    }
  };

  const handleChange = (e, selectedLayerName) => {
    let layers = [...searchLayers];
    for (let layer of layers) {
      if (layer.name === selectedLayerName) {
        layer.selected = e.target.checked;
      }
    }
    setSearchLayers(layers);
  };

  return (
    <div className="polygon-layers-wrapper">
      <ListItem
        id="polygon-layer-expander"
        button
        divider
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <ListItemText primary="Arealrapport" />
        {menuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={menuOpen} timeout="auto" unmountOnExit>
        <div className="polygon-layers-content">
          <div className="polygon-checkbox-content">
            {searchLayers.map((layer, index) => {
              return (
                <div key={index} className="polygon-layers-item">
                  <div className={polygon ? "" : "polygon-layers-disabled"}>
                    {layer.name}
                  </div>
                  <Checkbox
                    id="select-layers-checkbox"
                    checked={layer.selected}
                    onChange={e => handleChange(e, layer.name)}
                    color="default"
                    disabled={polygon ? false : true}
                  />
                </div>
              );
            })}
          </div>
          <div className="polygon-button-wrapper">
            <Button
              id="polygon-run-button"
              variant="contained"
              size="small"
              onClick={() => {
                calculateAreaReport();
              }}
              disabled={polygon ? false : true}
            >
              Lag arealrapport
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default PolygonLayers;
