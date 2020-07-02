import React from "react";
import { Grid, Typography, IconButton, ListSubheader } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import CustomIcon from "../Common/CustomIcon";

const Tegnforklaring = ({ layers }) => {
  const history = useHistory();
  return (
    <div className="legend-wrapper">
      <div className="legend-title-wrapper">
        <div className="legend-title-content">
          <CustomIcon icon="map-legend" size={24} color="#333" padding={2} />
          <span className="legend-title-text">Tegnforklaring</span>
        </div>
        <button
          tabIndex="0"
          className="close-legend-button-wrapper"
          onClick={e => {
            const loc = history.location;
            loc.pathname = "/";
            history.push(loc);
          }}
        >
          <div className="close-legend-button">
            <Close />
          </div>
        </button>
        {/* <IconButton
          tabIndex="0"
          style={{ color: "#333" }}
          onClick={e => {
            const loc = history.location;
            loc.pathname = "/";
            history.push(loc);
          }}
        >
          <Close />
        </IconButton> */}
      </div>
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
            <div
              key={layer.tittel}
              style={{ marginBottom: 16, cursor: "pointer" }}
              onClick={() => {
                const loc = history.location;
                loc.pathname = "/kartlag/" + layer.tittel;
                history.push(loc);
              }}
            >
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
