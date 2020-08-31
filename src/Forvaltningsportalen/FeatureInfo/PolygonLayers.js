import React, { useState } from "react";
import { Button, Checkbox } from "@material-ui/core";
import "../../style/infobox.css";

const PolygonLayers = ({ polygon }) => {
  const availableLayers = [{ name: "Kommuner og Fylker", selected: false }];
  const [searchLayers, setSearchLayers] = useState(availableLayers);

  const calculateLayers = () => {
    console.log(searchLayers);
    console.log(polygon);
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
      <div className="polygon-layers-content">
        {searchLayers.map((layer, index) => {
          return (
            <div key={index} className="polygon-layers-item">
              <div className="polygon-layers-name">{layer.name}</div>
              <Checkbox
                checked={layer.selected}
                onChange={e => handleChange(e, layer.name)}
                color="default"
              />
            </div>
          );
        })}
      </div>
      <div>
        <Button
          id="polygon-run-button"
          variant="contained"
          size="small"
          onClick={() => {
            calculateLayers();
          }}
        >
          Hent resultater
        </Button>
      </div>
    </div>
  );
};

export default PolygonLayers;
