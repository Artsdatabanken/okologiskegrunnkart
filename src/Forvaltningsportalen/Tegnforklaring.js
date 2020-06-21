import React from "react";
import { Grid, Typography, ListSubheader } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Tegnforklaring = ({ layers }) => {
  const history = useHistory();
  return (
    <div style={{ margin: 24 }}>
      <Typography variant="h5">Tegnforklaring</Typography>
      {Object.keys(layers).map(id => {
        const layer = layers[id];
        const items = Object.values(layer.underlag || {})
          .filter(ul => ul.erSynlig)
          .map(ul => (
            <LegendItem
              key={layer.tittel + "_" + ul.tittel}
              layer={layer}
              sublayer={ul}
            />
          ));
        if (items.length <= 0) return null;
        console.log(layer);
        return (
          <div
            key={layer.tittel}
            style={{ marginBottom: 16, cursor: "pointer" }}
            onClick={() => {
              const loc = history.location;
              loc.pathname = "/kartlag/" + id;
              history.push(loc);
            }}
          >
            <ListSubheader disableGutters>{layer.tittel}</ListSubheader>
            <Grid container direction="row" spacing={4}>
              {items}
            </Grid>
          </div>
        );
      })}
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
