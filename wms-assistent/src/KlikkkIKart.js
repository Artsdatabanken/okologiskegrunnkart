import React from "react";
import { Paper, ListItem, ListItemText } from "@material-ui/core";

import TextField2 from "./TextField2";
import klikktekst from "./FeatureInfo/Klikktekst";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const KlikkIKart = ({ doc, onUpdate, feature }) => {
  const history = useHistory();

  const linje1 = klikktekst(feature, doc.klikktekst);
  const linje2 = klikktekst(feature, doc.klikktekst2 || doc.tittel);
  //    console.log(linje1, linje2)
  return (
    <div>
      <TextField2
        title="Testkoordinater for klikk i kart (˚Ø,˚N)"
        dockey="testkoordinater"
        doc={doc}
        onUpdate={onUpdate}
      />
      <TextField2
        title="Formatstreng linje 1"
        dockey="klikktekst"
        doc={doc}
        onUpdate={onUpdate}
        onIconClick={() => {
          history.push(`?id=${doc._id}&sub=klikktekst`);
        }}
        icon={<AddCircleIcon />}
      />
      {linje1.warn &&
        linje1.warn.map((warning) => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}
      <TextField2
        title="Formatstreng linje 2"
        dockey="klikktekst2"
        doc={doc}
        onUpdate={onUpdate}
        onIconClick={() => {
          history.push(`?id=${doc._id}&sub=klikktekst2`);
        }}
        icon={<AddCircleIcon />}
      />
      {linje2.warn &&
        linje2.warn.map((warning) => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}
      <Paper
        elevation={3}
        style={{
          zIndex: 100,
          position: "fixed",
          bottom: 48,
          right: 48,
          width: 392,
          border: "1px solid #999",
          backgroundColor: "rgb(237, 237, 237)",
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
