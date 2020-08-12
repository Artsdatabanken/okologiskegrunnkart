import React from "react";
import { Paper, ListItem, ListItemText } from "@material-ui/core";
import klikktekst from "./FeatureInfo/Klikktekst";

const KlikkResultatPreview = ({ layer, feature }) => {
  const linje1 = klikktekst(feature, layer.klikktekst);
  const linje2 = klikktekst(feature, layer.klikktekst2);
  return (
    <Paper
      elevation={3}
      style={{
        zIndex: 100,
        position: "fixed",
        bottom: 48,
        right: 48,
        width: 392,
        border: "1px solid #999",
        backgroundColor: "rgb(237, 237, 237)"
      }}
    >
      <ListItem>
        <ListItemText
          primary={<b>{linje1.verdier}</b>}
          secondary={linje2.verdier}
        ></ListItemText>
      </ListItem>
    </Paper>
  );
};

export default KlikkResultatPreview;
