import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  ListItem
} from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const Tegnforklaring = ({ layers, setLegendVisible }) => {
  const history = useHistory();

  useEffect(() => {
    if (history.action === "POP") {
      const loc = history.location;
      if (!loc) return;
      const path = loc.pathname;
      if (path !== "/tegnforklaring") {
        setLegendVisible(false);
      }
    }
  });

  return (
    <div className="legend-wrapper">
      <ListItem
        id="legend-title-wrapper"
        button
        onClick={() => {
          setLegendVisible(false);
          const loc = history.location;
          loc.pathname = "/";
          history.push(loc);
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
        {Object.keys(layers).map(id => {
          const layer = layers[id];
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
            // <div
            //   key={layer.tittel}
            //   style={{ marginBottom: 16, cursor: "pointer" }}
            //   onClick={() => {
            //     const loc = history.location;
            //     loc.pathname = "/kartlag/" + layer.tittel;
            //     history.push(loc);
            //   }}
            // >
            <div key={layer.tittel} style={{ marginBottom: 16 }}>
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
