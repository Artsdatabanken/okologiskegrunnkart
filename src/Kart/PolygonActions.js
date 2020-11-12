import React, { useState, useEffect } from "react";
import { Close, Save } from "@material-ui/icons";
import "../style/leaflet.css";
import { Snackbar, Modal, TextField, Button } from "@material-ui/core";
import "leaflet/dist/leaflet.css";

const PolygonActions = ({
  markerType,
  showForbidden,
  showPolygonSaveModal,
  handlePolygonSaveModal,
  polygonActionResult,
  closePolygonActionResult,
  savePolygon
}) => {
  const [polygonName, setPolygonName] = useState("");

  const updatePolygonName = event => {
    const name = event.target.value;
    setPolygonName(name);
  };

  useEffect(() => {
    if (!showPolygonSaveModal) {
      setPolygonName("");
    }
  }, [showPolygonSaveModal]);

  return (
    <>
      {markerType === "polygon" && (
        <div
          className={`polygon-warning-wrapper${
            showForbidden ? "" : " hidden-warning"
          }`}
        >
          Polygon kanter kan ikke krysse
        </div>
      )}
      <input
        style={{ display: "none" }}
        type="file"
        id="file-input"
        name="file"
        accept=".geojson, .json"
      />
      <Modal
        open={showPolygonSaveModal}
        onClose={() => handlePolygonSaveModal(false)}
        className="polygon-modal-body"
      >
        <div className="polygon-modal-wrapper">
          <div className="polygon-modal-title">
            <div>Lagre polygon</div>
            <button
              tabIndex="0"
              className="polygon-modal-button-wrapper"
              onClick={() => handlePolygonSaveModal(false)}
            >
              <div className="polygon-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="polygon-modal-content">
            <form id="polygon-input-form" noValidate autoComplete="off">
              <TextField
                id="polygon-name-input"
                label="Navn"
                value={polygonName}
                onChange={e => updatePolygonName(e)}
                error={
                  polygonActionResult && polygonActionResult[0] === "save_error"
                }
                helperText={
                  polygonActionResult && polygonActionResult[0] === "save_error"
                    ? polygonActionResult[2]
                    : null
                }
              />
              <div className="polygon-save-button-wrapper">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={() => savePolygon(polygonName)}
                >
                  Lagre
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={polygonActionResult && polygonActionResult[0].includes("error")}
        autoHideDuration={2500}
        onClose={closePolygonActionResult}
      >
        <div className="polygon-action-error">
          {polygonActionResult ? polygonActionResult[1] : ""}
        </div>
      </Snackbar>
      <Snackbar
        open={polygonActionResult && polygonActionResult[0].includes("success")}
        autoHideDuration={2500}
        onClose={closePolygonActionResult}
      >
        <div className="polygon-action-success">
          {polygonActionResult ? polygonActionResult[1] : ""}
        </div>
      </Snackbar>
    </>
  );
};

export default PolygonActions;
