import React from "react";
import TextField2 from "./TextField2";
import CreateIcon from "@material-ui/icons/Create";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const Klikktekster = ({ underlag, onUpdate }) => {
  const history = useHistory();
  return (
    <>
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

export default Klikktekster;
