import React from "react";
import {
  IconButton,
  Grid,
  Paper,
  Typography,
  ListSubheader
} from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Tegnforklaring = ({ layers }) => {
  const history = useHistory();
  const query = useQuery();
  if (query.get("tegnforklaring") == null) return null;

  return (
    <Paper
      elevation={3}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 408,
        overflowX: "hidden",
        overflowY: "auto",
        padding: 24
      }}
    >
      <IconButton
        onClick={() => {
          const loc = history.location;
          console.log(loc);
          const search = new URLSearchParams(loc.search);
          search.delete("tegnforklaring");
          loc.search = search.toString();
          history.push(loc);
        }}
        style={{ zIndex: 100, position: "fixed", left: 352, top: 8 }}
      >
        <CloseIcon></CloseIcon>
      </IconButton>
      <Typography variant="h5">Tegnforklaring</Typography>
      {Object.values(layers).map(layer => {
        const items = Object.values(layer.underlag || {})
          .filter(ul => ul.erSynlig)
          .map(ul => <LegendItem key={ul.id} layer={layer} sublayer={ul} />);
        if (items.length > 0)
          return (
            <div
              style={{ marginBottom: 16, cursor: "pointer" }}
              onClick={() => {
                history.push();
              }}
            >
              <ListSubheader disableGutters>{layer.tittel}</ListSubheader>
              <Grid container direction="row" spacing={4}>
                {items}
              </Grid>
            </div>
          );
      })}
    </Paper>
  );
};

const LegendItem = ({ sublayer }) => {
  if (!sublayer.legendeurl) return null;
  return (
    <Grid item style={{ _paddingBottom: 16 }}>
      <figcaption>
        <Typography variant="caption">{sublayer.tittel}</Typography>
      </figcaption>
      <img key={sublayer.id} alt="tegnforklaring" src={sublayer.legendeurl} />
    </Grid>
  );
};

export default Tegnforklaring;
