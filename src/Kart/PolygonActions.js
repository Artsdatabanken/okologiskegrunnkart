import React, { useState, useEffect } from "react";
import { Close, Save } from "@material-ui/icons";
import "../style/leaflet.css";
import {
  Snackbar,
  Modal,
  TextField,
  Button,
  ListItem,
  ListItemText
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";

const PolygonActions = ({
  markerType,
  showForbidden,
  showPolygonSaveModal,
  handlePolygonSaveModal,
  polygonActionResult,
  closePolygonActionResult,
  savePolygon,
  showSavedPolygons,
  savedPolygons,
  handleShowSavedPolygons,
  openSavedPolygon
}) => {
  const [polygonName, setPolygonName] = useState("");

  const updatePolygonName = event => {
    const name = event.target.value;
    setPolygonName(name);
  };

  useEffect(() => {
    if (!showPolygonSaveModal) {
      setPolygonName("");
    } else {
      setTimeout(() => {
        const input = document.getElementById("polygon-name-input");
        if (input) {
          input.focus();
        }
      }, 50);
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
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    savePolygon(polygonName);
                  }
                }}
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
      <Modal
        open={showSavedPolygons}
        onClose={() => handleShowSavedPolygons(false)}
        className="saved-polygon-modal-body"
      >
        <div className="saved-polygon-modal-wrapper">
          <div className="polygon-modal-title">
            <div>Åpne lagret polygon</div>
            <button
              tabIndex="0"
              className="polygon-modal-button-wrapper"
              onClick={() => handleShowSavedPolygons(false)}
            >
              <div className="polygon-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="saved-polygons-content">
            {savedPolygons.length > 0 &&
              savedPolygons.map((polygon, index) => {
                return (
                  <ListItem
                    key={index}
                    id="saved-polygons-row"
                    button
                    onClick={() => openSavedPolygon(polygon)}
                  >
                    <ListItemText
                      id="saved-polygons-name"
                      primary={polygon.name}
                    />
                    <ListItemText
                      id="saved-polygons-date"
                      primary={polygon.date.toLocaleDateString("nb")}
                    />
                  </ListItem>
                );
              })}
            {savedPolygons.length === 0 && (
              <ListItem id="saved-polygons-row">
                <ListItemText
                  id="saved-polygons-name"
                  primary="Ingen polygon lagret"
                />
              </ListItem>
            )}
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
