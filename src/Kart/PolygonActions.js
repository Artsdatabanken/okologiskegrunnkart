import React, { useState, useEffect } from "react";
import { Close, Save, Edit, Delete, Cancel } from "@material-ui/icons";
import "../style/leaflet.css";
import {
  Snackbar,
  Modal,
  TextField,
  Button,
  ListItem,
  ListItemText,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "leaflet/dist/leaflet.css";

const useStyles = isMobile =>
  makeStyles(() => ({
    customIconButtom: {
      "&.MuiIconButton-root": {
        color: "#666",
        border: "1px solid #666",
        backgroundColor: "rgba(145, 163, 176, 0.3)",
        padding: isMobile ? "4px" : "5px",
        margin: isMobile ? "0 3px" : "0 5px"
      },
      "&:hover": {
        backgroundColor: "rgba(145, 163, 176, 0.6)"
      },
      "&.Mui-disabled": {
        color: "#999",
        border: "1px solid #999"
      }
    }
  }));

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
  openSavedPolygon,
  deleteSavedPolygon,
  updateSavedPolygon,
  isMobile
}) => {
  const classes = useStyles(isMobile)();

  const [polygons, setPolygons] = useState([]);
  const [polygonName, setPolygonName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [polygonToDelete, setPolygonToDelete] = useState(null);
  const [editPolygon, setEditPolygon] = useState(null);
  const [nameWidth, setNameWidth] = useState(0);
  const [nameLength, setNameLength] = useState(0);

  const savedPolygonNames = savedPolygons.map(item => {
    return { name: item.name };
  });
  const savedPolygonsJSON = JSON.stringify(savedPolygonNames);

  const createPolygonName = event => {
    const name = event.target.value;
    setPolygonName(name);
  };

  const updatePolygonName = event => {
    const name = event.target.value;
    let modifiedPolygon = { ...editPolygon };
    modifiedPolygon.editname = name;
    setEditPolygon(modifiedPolygon);
  };

  const enableEditPolygon = (id, value) => {
    let modifiedPolygons = [...savedPolygons];
    for (const polygon of modifiedPolygons) {
      if (polygon.id === id) {
        polygon.edit = value;
        if (value) {
          const column = document.getElementById("saved-polygons-row");
          if (column && column.offsetWidth) {
            setNameWidth(column.offsetWidth - 30);
          }
          setEditPolygon(polygon);
          setTimeout(() => {
            const input = document.getElementById("polygon-edit-name-input");
            if (input) {
              input.focus();
            }
          }, 50);
        } else {
          setEditPolygon(null);
        }
      } else {
        polygon.edit = false;
      }
    }
    setPolygons(modifiedPolygons);
  };

  const saveEditedPolygon = newPolygon => {
    // Update polygon in indexed DB
    if (newPolygon && newPolygon.name !== newPolygon.editname) {
      updateSavedPolygon(newPolygon);
    } else {
      // Update polygon name automatically
      let modifiedPolygons = [...savedPolygons];
      for (const polygon of modifiedPolygons) {
        if (polygon.id === newPolygon.id) {
          polygon.name = newPolygon.editname;
          polygon.edit = false;
          setPolygons(modifiedPolygons);
          break;
        }
      }
    }
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

  useEffect(() => {
    let modifiedPolygons = [...savedPolygons];
    for (const polygon of modifiedPolygons) {
      if (!polygon.edit) polygon.edit = false;
      if (!polygon.editname) polygon.editname = polygon.name;
    }
    setPolygons(modifiedPolygons);
  }, [savedPolygons]);

  useEffect(() => {
    let polygons = JSON.parse(savedPolygonsJSON);
    let length = 0;
    for (const polygon of polygons) {
      if (length > polygon.name.length) {
        length = polygon.name.length;
      }
    }
    setNameLength(length);
  }, [savedPolygonsJSON]);

  useEffect(() => {
    if (!polygonActionResult || polygonActionResult.length === 0) {
      return;
    }
    if (polygonActionResult[0] === "edit_success") {
      setEditPolygon(null);
    }
  }, [polygonActionResult]);

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
      {/* ------------- SAVE POLYGON MODAL ----------- */}
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
                color="secondary"
                value={polygonName}
                onChange={e => createPolygonName(e)}
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
                  id="confirm-save-polygon"
                  variant="contained"
                  color="secondary"
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
      {/* --------- OPEN, EDIT, DELETE SAVED POLYGONS MODAL ----------- */}
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
            {polygons.length > 0 &&
              polygons.map((polygon, index) => {
                return (
                  <div
                    key={index}
                    className={`saved-polygons-listitem-wrapper${
                      polygon.edit ? " editing" : ""
                    }`}
                  >
                    {!polygon.edit ? (
                      <ListItem
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
                    ) : (
                      <ListItem id="saved-polygons-row">
                        <form
                          id="polygon-edit-input-form"
                          noValidate
                          autoComplete="off"
                          style={
                            !isMobile &&
                            editPolygon &&
                            editPolygon.name.length >= nameLength
                              ? { minWidth: nameWidth }
                              : null
                          }
                        >
                          <TextField
                            id="polygon-edit-name-input"
                            label="Navn"
                            color="secondary"
                            value={editPolygon ? editPolygon.editname : ""}
                            onChange={e => {
                              if (editPolygon) {
                                updatePolygonName(e);
                              }
                            }}
                            error={
                              polygonActionResult &&
                              polygonActionResult[0] === "edit_error"
                            }
                            helperText={
                              polygonActionResult &&
                              polygonActionResult[0] === "edit_error"
                                ? polygonActionResult[2]
                                : null
                            }
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                saveEditedPolygon(editPolygon);
                              }
                            }}
                          />
                        </form>
                      </ListItem>
                    )}
                    <div className="edit-buttons-wrapper">
                      {!polygon.edit ? (
                        <IconButton
                          className={classes.customIconButtom}
                          onClick={() =>
                            enableEditPolygon(polygon.id, !polygon.edit)
                          }
                        >
                          <Edit />
                        </IconButton>
                      ) : (
                        <IconButton
                          className={classes.customIconButtom}
                          onClick={() => {
                            saveEditedPolygon(editPolygon);
                          }}
                        >
                          <Save />
                        </IconButton>
                      )}
                      <IconButton
                        className={classes.customIconButtom}
                        onClick={() => {
                          setPolygonToDelete(polygon);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
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
      {/* --------------- SNACKBARS ----------------- */}
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
      {/* --------------- DELETE MODAL --------------- */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        className="polygon-delete-modal-body"
      >
        <div className="polygon-delete-modal-wrapper">
          <div className="polygon-delete-modal-title">
            <div>Slette polygon</div>
            <button
              tabIndex="0"
              className="polygon-modal-button-wrapper"
              onClick={() => setShowDeleteModal(false)}
            >
              <div className="polygon-delete-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="polygon-delete-modal-content">
            <div>
              {polygonToDelete
                ? `Vil du slette "${polygonToDelete.name}"?`
                : ""}
            </div>
            <div className="polygon-delete-button-wrapper">
              <Button
                id="cancel-delete-polygon"
                variant="contained"
                color="primary"
                startIcon={<Cancel />}
                onClick={() => setShowDeleteModal(false)}
              >
                Avbryt
              </Button>
              <Button
                id="confirm-delete-polygon"
                variant="contained"
                color="secondary"
                startIcon={<Delete />}
                onClick={() => {
                  if (polygonToDelete) {
                    deleteSavedPolygon(polygonToDelete.id);
                    setPolygonToDelete(null);
                  }
                  setShowDeleteModal(false);
                }}
              >
                Slett
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PolygonActions;
