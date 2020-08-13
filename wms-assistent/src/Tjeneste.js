import React from "react";
import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SaveIcon from "@material-ui/icons/Save";
import KlikkIKart from "./KlikkkIKart";

const Tjeneste = ({
  doc,
  onUpdateLayerField,
  onSave,
  feature,
  setFeature,
  selectedLayerIndex
}) => {
  if (doc.error)
    return (
      <Alert style={{ marginTop: 64 }} severity="error">
        {doc.error}
      </Alert>
    );

  return (
    <form noValidate autoComplete="off" style={{ _overflow: "hidden" }}>
      <KlikkIKart
        doc={doc}
        onUpdate={onUpdateLayerField}
        feature={feature}
        setFeature={setFeature}
        selectedLayerIndex={selectedLayerIndex}
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
    </form>
  );
};

export default Tjeneste;
