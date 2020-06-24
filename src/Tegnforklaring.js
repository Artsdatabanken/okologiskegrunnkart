import React from "react";
import { Grid, Typography, IconButton, ListSubheader } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import MapLegend from "./MapLegend";

const Tegnforklaring = ({ layers }) => {
  const history = useHistory();
  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "#fff",
        height: "100%",
        overflowY: "auto"
      }}
    >
      <IconButton
        onClick={() => {
          const loc = history.location;
          loc.pathname = "/";
          history.push(loc);
        }}
        style={{
          zIndex: 100,
          position: "relative",
          float: "right",
          right: -16,
          top: -16
        }}
      >
        <Close></Close>
      </IconButton>
      <div style={{ display: "flex" }}>
        <MapLegend
          style={{
            fill: "rgba(0,0,0,0.54)"
          }}
        />
        <Typography style={{ marginLeft: 8 }} variant="body1">
          Tegnforklaring
        </Typography>
      </div>
      <div style={{ margin: 24 }}>
        {Object.keys(layers).map(id => {
          const layer = layers[id];
          const items = Object.values(layer.underlag || {})
            //    .filter(ul => ul.erSynlig)
            .map(ul => (
              <LegendItem
                key={layer.tittel + "_" + ul.tittel}
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
      <img alt="tegnforklaring" src={sublayer.legendeurl} />
    </Grid>
  );
};

export default Tegnforklaring;
