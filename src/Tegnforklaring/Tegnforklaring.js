import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  ListItem
} from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";

const Tegnforklaring = ({ layers, setLegendVisible, legendPosition }) => {
  const [legendItems, setLegendItems] = useState({});

  const layersJSON = JSON.stringify(layers);

  useEffect(() => {
    let activeLayers = {};
    Object.keys(layers).forEach(layerkey => {
      const layer = layers[layerkey];
      let sublayers = {};
      Object.keys(layer.underlag || {}).forEach(sublayerKey => {
        const sublayer = layer.underlag[sublayerKey];
        if (sublayer.erSynlig) {
          sublayers = { ...sublayers, [sublayerKey]: sublayer };
        }
      });
      if (
        Object.keys(sublayers).length > 0 &&
        sublayers.constructor === Object
      ) {
        const activeLayer = { ...layer, underlag: sublayers };
        activeLayers = { ...activeLayers, [layerkey]: activeLayer };
      }
    });
    if (
      Object.keys(activeLayers).length > 0 &&
      activeLayers.constructor === Object
    ) {
      setLegendItems(activeLayers);
    } else {
      setLegendItems({});
      setLegendVisible(false);
    }
  }, [layers, layersJSON, setLegendVisible]);

  return (
    <div className={`legend-wrapper-${legendPosition}`}>
      <ListItem
        id="legend-title-wrapper"
        button
        onClick={() => {
          setLegendVisible(false);
        }}
      >
        <ListItemIcon>
          <KeyboardBackspace />
        </ListItemIcon>
        <ListItemText>
          <span className="legend-title-text">Tegnforklaring</span>
        </ListItemText>
      </ListItem>
      <div className="legend-content-wrapper">
        {Object.keys(legendItems).map(id => {
          const layer = legendItems[id];
          const items = Object.values(layer.underlag || {})
            .filter(ul => ul.erSynlig)
            .map(ul => (
              <LegendItem
                key={layer.id + "_" + ul.tittel}
                layer={layer}
                sublayer={ul}
              />
            ));
          if (items.length <= 0) return null;
          return (
            <div className="legend-content-layer" key={layer.tittel}>
              <ListSubheader disableSticky disableGutters>
                {layer.tittel}
              </ListSubheader>
              <Grid container direction="row" spacing={4}>
                {items}
              </Grid>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LegendItem = ({ sublayer }) => {
  if (!sublayer.legendeurl) return null;
  return (
    <Grid key={sublayer.tittel} item style={{ _paddingBottom: 16 }}>
      <figcaption>
        <Typography variant="caption">{sublayer.tittel}</Typography>
      </figcaption>
      <img
        style={{ paddingTop: "3px" }}
        alt="tegnforklaring"
        src={sublayer.legendeurl}
      />
    </Grid>
  );
};

export default Tegnforklaring;
