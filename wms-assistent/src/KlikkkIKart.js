import React from "react";
import { Paper, ListItem, ListItemText } from "@material-ui/core";

import TextField2 from "./TextField2";
import klikktekst from "./FeatureInfo/Klikktekst";
import CreateIcon from "@material-ui/icons/Create";
import { useHistory } from "react-router-dom";
import Underlag from "./Underlag";

const KlikkIKart = ({ doc, onUpdate, feature, selectedLayerIndex }) => {
  const history = useHistory();

  const linje1 = klikktekst(feature, doc.klikktekst);
  const linje2 = klikktekst(feature, doc.klikktekst2 || doc.tittel);
  return (
    <div>
      <TextField2
        title="Testkoordinater for klikk i kart (˚Ø,˚N)"
        dockey="testkoordinater"
        doc={doc}
        onUpdate={onUpdate}
      />
      <TextField2
        title="Faktaark URL"
        dockey="faktaark"
        doc={doc}
        onUpdate={onUpdate}
        onIconClick={() => {
          history.push(`?id=${doc._id}&sub=faktaark`);
        }}
        icon={<CreateIcon />}
      />
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
