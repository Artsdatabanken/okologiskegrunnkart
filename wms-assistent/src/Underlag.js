import React from "react";
import { ListSubheader } from "@material-ui/core";

import TextField2 from "./TextField2";
import CreateIcon from "@material-ui/icons/Create";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const Underlag = ({ underlag, selectedLayer, onChangeSelectedLayer }) => {
  const layer = underlag[selectedLayer];
  return (
    <>
      <ListSubheader disableSticky>Kartlag</ListSubheader>
      <div style={{ marginLeft: 24, marginRight: 24 }}>
        {underlag.map((ul, index) => {
          const isSelected = index === selectedLayer;
          return (
            <span
              style={{
                cursor: "pointer",
                margin: 4,
                fontWeight: isSelected && "bold"
              }}
              onClick={() => onChangeSelectedLayer(index)}
            >
              {isSelected ? "[" + ul.tittel + "]" : ul.tittel}
            </span>
          );
        })}
      </div>
      <ListSubheader disableSticky>{layer.tittel}</ListSubheader>
    </>
  );
};

const Underlag2 = ({ underlag, tittel }) => {
  const history = useHistory();
  const onUpdate = (key, value) => {
    console.log({ key, value });
  };
  return (
    <>
      <ListSubheader disableSticky>{tittel}</ListSubheader>
      <TextField2
        title="Formatstreng linje 1"
        dockey="klikktekst"
        doc={underlag}
        onUpdate={onUpdate}
        onIconClick={() => {
          history.push(`?id=${underlag._id}&sub=klikktekst`);
        }}
        icon={<CreateIcon />}
      />
      {underlag.linje1 &&
        underlag.linje1.warn &&
        underlag.linje1.warn.map(warning => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}
      <TextField2
        title="Formatstreng linje 2"
        dockey="klikktekst2"
        doc={underlag}
        onUpdate={onUpdate}
        onIconClick={() => {
          history.push(`?id=${underlag._id}&sub=klikktekst2`);
        }}
        icon={<CreateIcon />}
      />
      {underlag.linje2 &&
        underlag.linje2.warn &&
        underlag.linje2.warn.map(warning => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}
    </>
  );
};

export default Underlag;
