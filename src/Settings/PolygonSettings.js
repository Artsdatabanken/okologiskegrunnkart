import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal,
  TextField
} from "@material-ui/core";
import { Edit, Delete, Close, Save, Cancel } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import "../style/settings.css";

const desktopColumns = [
  {
    id: "name",
    label: "Navn",
    minWidth: 150
  },
  {
    id: "date",
    label: "Dato",
    minWidth: 90,
    align: "center"
  },
  {
    id: "change",
    label: "Endre",
    minWidth: 90,
    align: "center"
  }
];
const mobileColumns = [
  {
    id: "name",
    label: "Navn",
    minWidth: 120
  },
  {
    id: "date",
    label: "Dato",
    minWidth: 70,
    align: "center"
  },
  {
    id: "change",
    label: "Endre",
    minWidth: 80,
    align: "center"
  }
];

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

const PolygonSettings = ({
  savedPolygons,
  toggleEditPolygons,
  deleteSavedPolygon,
  updateSavedPolygon,
  polygonActionResult,
  isMobile
}) => {
  const classes = useStyles(isMobile)();
  const [polygons, setPolygons] = useState([]);
  const [columns, setColums] = useState(desktopColumns);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [polygonToDelete, setPolygonToDelete] = useState(null);
  const [editPolygon, setEditPolygon] = useState(null);
  const [nameWidth, setNameWidth] = useState(0);

  const savedPolygonNames = savedPolygons.map(item => {
    return { name: item.name };
  });
  const savedPolygonsJSON = JSON.stringify(savedPolygonNames);

  const enableEditPolygon = (id, value) => {
    let modifiedPolygons = [...savedPolygons];
    for (const polygon of modifiedPolygons) {
      if (polygon.id === id) {
        polygon.edit = value;
        if (value) {
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

  const updatePolygonName = event => {
    const name = event.target.value;
    let modifiedPolygon = { ...editPolygon };
    modifiedPolygon.editname = name;
    setEditPolygon(modifiedPolygon);
  };

  useEffect(() => {
    if (isMobile) setColums(mobileColumns);
    else setColums(desktopColumns);
  }, [isMobile]);

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
    let width = 0;
    for (const polygon of polygons) {
      const tempWidth = polygon.name.length * 5.65 + 40;
      if (tempWidth > width) width = tempWidth;
    }
    setNameWidth(width);
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
      <div className="settings-layers-wrapper">
        <div className="setting-layers-title">
          <span>Editere lagrede polygoner</span>
        </div>
        <div className="settings-polygons-wrapper">
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    id={`header-${column.id}`}
                    key={column.id}
                    align={column.align}
                    style={
                      !isMobile &&
                      column.id === "name" &&
                      nameWidth > column.minWidth
                        ? { minWidth: nameWidth }
                        : { minWidth: column.minWidth }
                    }
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {polygons.map((polygon, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell key={columns[0].id} align={columns[0].align}>
                      <>
                        {!polygon.edit ? (
                          <>{polygon.name}</>
                        ) : (
                          <form
                            id="polygon-edit-input-form"
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="polygon-edit-name-input"
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
                        )}
                      </>
                    </TableCell>
                    <TableCell key={columns[1].id} align={columns[1].align}>
                      {polygon.date.toLocaleDateString("nb")}
                    </TableCell>
                    <TableCell key={columns[2].id} align={columns[2].align}>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="settings-polygons-buttons-wrapper">
          <Button
            id="settings-polygons-cancel-button"
            variant="contained"
            size="small"
            onClick={() => {
              toggleEditPolygons();
            }}
          >
            Tilbake
          </Button>
        </div>
      </div>
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

export default PolygonSettings;
