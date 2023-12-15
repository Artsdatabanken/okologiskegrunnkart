import React from "react";
import { Paper, ListItem, ListItemText } from "@mui/material";
import klikktekst from "./FeatureInfo/Klikktekst";
import Underlag from "./Underlag";

const KlikkIKart = ({ doc, onUpdate, feature, selectedLayerIndex }) => {
  const linje1 = klikktekst(feature, doc.klikktekst);
  const linje2 = klikktekst(feature, doc.klikktekst2 || doc.tittel);
  return (
    <div>
      {doc && doc.underlag && (
        <Underlag
          underlag={doc.underlag}
          selectedLayerIndex={selectedLayerIndex}
          onUpdate={onUpdate}
          feature={feature}
        />
      )}
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
    </div>
  );
};

export default KlikkIKart;
