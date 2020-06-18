import React from "react";
import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SaveIcon from "@material-ui/icons/Save";
import TextField2 from "./TextField2";
import KlikkIKart from "./KlikkkIKart";
import Warnings from "./Warnings";

const Tjeneste = ({ doc, onUpdate, onSave, feature, setFeature }) => {
  if (doc.error)
    return (
      <Alert style={{ marginTop: 64 }} severity="error">
        {doc.error}
      </Alert>
    );

  return (
    <form noValidate autoComplete="off" style={{ _overflow: "hidden" }}>
      <div style={{ backgroundColor: "#eee", padding: 8 }}>
        <TextField2
          title="WMS URL"
          dockey="wmsurl"
          doc={doc}
          onUpdate={onUpdate}
        />
        <Warnings doc={doc} />
        <TextField2
          title="WMS version"
          dockey="wmsversion"
          doc={doc}
          onUpdate={onUpdate}
        />
        <TextField2
          title="Projeksjon"
          dockey="crs"
          doc={doc}
          onUpdate={onUpdate}
        />
        <TextField2
          title="API URL (hvis tom brukes WMS url)"
          dockey="klikkurl"
          doc={doc}
          onUpdate={onUpdate}
        />
        <TextField2
          title="Featureinfo format"
          dockey="wmsinfoformat"
          doc={doc}
          onUpdate={onUpdate}
        />
        <KlikkIKart
          doc={doc}
          onUpdate={onUpdate}
          feature={feature}
          setFeature={setFeature}
        />
        <Button
          style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
          onClick={onSave}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
        >
          Oppdater feltene under i Django
        </Button>
      </div>
    </form>
  );
};

export default Tjeneste;
