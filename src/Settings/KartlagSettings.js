import React from "react";
import { Button } from "@material-ui/core";
import "../style/settings.css";

const KartlagSettings = ({ kartlag, toggleEditLayers }) => {
  return (
    <div className="settings-layers-wrapper">
      You are here
      <Button
        id="settings-layers-save-button"
        variant="contained"
        size="small"
        onClick={() => {
          toggleEditLayers();
        }}
      >
        Lagre
      </Button>
    </div>
  );
};

export default KartlagSettings;
