import React from "react";
import { Button } from "@mui/material";
import Alert from "@mui/lab/Alert";
import SaveIcon from "@mui/icons-material/Save";
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
        style={{ width: 476, margin: 16 }}
        onClick={onSave}
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SaveIcon />}
      >
        Oppdater feltene over i Django
      </Button>
    </form>
  );
};

export default Tjeneste;
