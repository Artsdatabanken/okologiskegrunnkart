import React from "react";
import TextField2 from "./TextField2";
import CreateIcon from "@material-ui/icons/Create";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import klikktekst from "./FeatureInfo/Klikktekst";

const Klikktekster = ({ underlag, feature, onUpdate, selectedLayerIndex }) => {
  const history = useHistory();
  const linje1 = klikktekst(feature, underlag.klikktekst);
  const linje2 = klikktekst(feature, underlag.klikktekst2);
  const goToEditmode = key => {
    const url = new URL(window.location);
    url.searchParams.set("ulid", selectedLayerIndex);
    url.searchParams.set("sub", key);
    history.push(url.toString());
  };
  return (
    <>
      <TextField2
        title="Faktaark url"
        dockey="faktaark"
        doc={underlag}
        onUpdate={onUpdate}
      />
      <TextField2
        title="Formatstreng linje 1"
        dockey="klikktekst"
        doc={underlag}
        onUpdate={onUpdate}
        onIconClick={() => goToEditmode("klikktekst")}
        icon={<CreateIcon />}
      />
      {linje1.warn && linje1.warn.length > 0 && (
        <Alert severity="warning">Finner ikke alle felt i kartpunktet</Alert>
      )}
      <TextField2
        title="Formatstreng linje 2"
        dockey="klikktekst2"
        doc={underlag}
        onUpdate={onUpdate}
        onIconClick={() => goToEditmode("klikktekst2")}
        icon={<CreateIcon />}
      />
      {linje2.warn && linje2.warn.length > 0 && (
        <Alert severity="warning">Finner ikke alle felt i kartpunktet</Alert>
      )}
    </>
  );
};

export default Klikktekster;
