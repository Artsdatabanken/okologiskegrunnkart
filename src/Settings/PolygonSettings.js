import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal
} from "@material-ui/core";
import { Edit, Delete, Close } from "@material-ui/icons";
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
  isMobile
}) => {
  const classes = useStyles(isMobile)();
  const [columns, setColums] = useState(desktopColumns);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [polygonToDelete, setPolygonToDelete] = useState(null);

  useEffect(() => {
    if (isMobile) setColums(mobileColumns);
    else setColums(desktopColumns);
  }, [isMobile]);

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
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {savedPolygons.map((polygon, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell key={columns[0].id} align={columns[0].align}>
                      {polygon.name}
                    </TableCell>
                    <TableCell key={columns[1].id} align={columns[1].align}>
                      {polygon.date.toLocaleDateString("nb")}
                    </TableCell>
                    <TableCell key={columns[2].id} align={columns[2].align}>
                      <IconButton
                        className={classes.customIconButtom}
                        onClick={() => console.log("Edit")}
                      >
                        <Edit />
                      </IconButton>
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
                variant="contained"
                color="primary"
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
