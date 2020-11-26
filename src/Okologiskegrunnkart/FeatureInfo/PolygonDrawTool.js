import React, { useState, useEffect } from "react";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  Delete,
  Create,
  Done,
  Undo,
  ExpandLess,
  ExpandMore,
  Forward,
  Folder,
  Save
} from "@material-ui/icons";
import {
  IconButton,
  Typography,
  Collapse,
  RadioGroup,
  FormControlLabel,
  ListItem,
  ListItemText,
  Snackbar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BottomTooltip from "../../Common/BottomTooltip";
import CustomRadio from "../../Common/CustomRadio";
import { getPolygonDepth } from "../../Funksjoner/polygonTools";
import { checkPolylineIsValid } from "../../Funksjoner/polylineTools";

const useStyles = makeStyles(() => ({
  customIconButtom: {
    "&.MuiIconButton-root": {
      color: "#666",
      border: "1px solid #666",
      backgroundColor: "rgba(145, 163, 176, 0)",
      padding: "10px"
    },
    "&:hover": {
      backgroundColor: "rgba(145, 163, 176, 0.5)"
    },
    "&.Mui-disabled": {
      color: "#999",
      border: "1px solid #999"
    }
  }
}));

const PolygonDrawTool = ({
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline,
  handlePolygonResults,
  grensePolygon,
  handleGrensePolygon,
  removeGrensePolygon,
  showPolygonOptions,
  setShowPolygonOptions,
  showFylkePolygon,
  showKommunePolygon,
  showEiendomPolygon,
  uploadPolygonFile,
  handlePolygonSaveModal,
  getSavedPolygons
}) => {
  const classes = useStyles();

  const [polygonVisible, setPolygonVisible] = useState(true);
  const [polygonEditable, setPolygonEditable] = useState(true);
  const [showError, setShowError] = useState(false);

  const handleRadioChange = event => {
    handleGrensePolygon(event.target.value);
  };

  const deletePolygon = () => {
    if (grensePolygon === "none") {
      addPolygon(null);
      addPolyline([]);
      handleEditable(true);
    } else {
      removeGrensePolygon();
    }
    hideAndShowPolygon(true);
    handlePolygonResults(null);
  };

  const hideShowPolygon = () => {
    if (grensePolygon === "none") {
      hideAndShowPolygon(!showPolygon);
    } else if (grensePolygon === "fylke") {
      hideAndShowPolygon(!showFylkePolygon);
    } else if (grensePolygon === "kommune") {
      hideAndShowPolygon(!showKommunePolygon);
    } else if (grensePolygon === "eiendom") {
      hideAndShowPolygon(!showEiendomPolygon);
    }
  };

  const finishPolygon = polyline => {
    const isValid = checkPolylineIsValid(
      polyline[0][0],
      polyline[0][1],
      polyline
    );
    if (!isValid) {
      setShowError(true);
    } else {
      addPolygon(polyline);
      addPolyline([]);
    }
  };

  const closeError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
  };

  useEffect(() => {
    if (grensePolygon === "none") {
      setPolygonVisible(showPolygon);
    } else if (grensePolygon === "fylke") {
      setPolygonVisible(showFylkePolygon);
    } else if (grensePolygon === "kommune") {
      setPolygonVisible(showKommunePolygon);
    } else if (grensePolygon === "eiendom") {
      setPolygonVisible(showEiendomPolygon);
    }
  }, [
    grensePolygon,
    showPolygon,
    showFylkePolygon,
    showKommunePolygon,
    showEiendomPolygon
  ]);

  const polygonJSON = JSON.stringify(polygon);

  useEffect(() => {
    const depth = getPolygonDepth(polygon);
    if (depth === 2) setPolygonEditable(true);
    else setPolygonEditable(false);
  }, [polygon, polygonJSON]);

  return (
    <>
      <div className="polygon-options-listitem-wrapper">
        <ListItem
          id="polygon-options-listitem"
          button
          onClick={e => {
            setShowPolygonOptions(!showPolygonOptions);
          }}
        >
          <ListItemText primary="Velg polygon" />
          {showPolygonOptions ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </div>
      <Collapse
        id="select-polygon-collapse"
        in={showPolygonOptions}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="polygon-options-container">
          <div className="infobox-radio-buttons-title">
            Definer polygon fra grenser
          </div>
          <div className="infobox-radio-buttons-container">
            <RadioGroup
              aria-label="export"
              name="export1"
              value={grensePolygon}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                id="infobox-radio-label"
                value="none"
                control={<CustomRadio />}
                label="Ingen (selvtegnet)"
              />
              <FormControlLabel
                id="infobox-radio-label"
                value="fylke"
                control={<CustomRadio />}
                label="Fylke"
              />
              <FormControlLabel
                id="infobox-radio-label"
                value="kommune"
                control={<CustomRadio />}
                label="Kommune"
              />
              <FormControlLabel
                id="infobox-radio-label"
                value="eiendom"
                control={<CustomRadio />}
                label="Eiendom"
              />
            </RadioGroup>
          </div>
        </div>
      </Collapse>

      <div
        className={
          grensePolygon === "none"
            ? "polygon-tool-wrapper vertical"
            : "polygon-tool-wrapper"
        }
      >
        <div
          className={
            grensePolygon === "none"
              ? "polygon-tool-label vertical"
              : "polygon-tool-label"
          }
        >
          <Typography variant="body1">Geometri</Typography>
        </div>
        <div className="polygon-buttons-wrapper">
          {/* !polygon && polyline.length === 0 && grensePolygon === "none" && */}
          {grensePolygon === "none" && (
            <>
              <BottomTooltip placement="bottom" title="Laste opp polygon">
                <span className="geometry-tool-button first-tool">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => uploadPolygonFile()}
                  >
                    <Forward style={{ transform: "rotate(-90deg)" }} />
                  </IconButton>
                </span>
              </BottomTooltip>
              <BottomTooltip placement="bottom" title="Åpne lagret polygon">
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => getSavedPolygons()}
                  >
                    <Folder />
                  </IconButton>
                </span>
              </BottomTooltip>
            </>
          )}

          {polygon && grensePolygon === "none" && (
            <>
              <BottomTooltip placement="bottom" title="Lagre polygon">
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => handlePolygonSaveModal(true)}
                  >
                    <Save />
                  </IconButton>
                </span>
              </BottomTooltip>
              <BottomTooltip placement="bottom" title="Rediger">
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => {
                      addPolygon(null);
                      addPolyline(polygon);
                      handleEditable(true);
                      handlePolygonResults(null);
                    }}
                    disabled={!polygonEditable}
                  >
                    <Create />
                  </IconButton>
                </span>
              </BottomTooltip>
            </>
          )}

          {!polygon && grensePolygon === "none" && (
            <>
              <BottomTooltip placement="bottom" title="Angre sist">
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => {
                      if (polyline.length > 0) {
                        polyline.pop();
                        addPolyline(polyline);
                      }
                    }}
                  >
                    <Undo />
                  </IconButton>
                </span>
              </BottomTooltip>
              <BottomTooltip placement="bottom" title="Ferdig">
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => {
                      if (polyline.length > 1) {
                        // addPolygon(polyline);
                        // addPolyline([]);
                        finishPolygon(polyline);
                      }
                    }}
                  >
                    <Done />
                  </IconButton>
                </span>
              </BottomTooltip>
            </>
          )}

          <BottomTooltip placement="bottom" title="Vis/Gjem">
            <span className="geometry-tool-button">
              <IconButton
                className={classes.customIconButtom}
                onClick={() => hideShowPolygon()}
              >
                {polygonVisible ? (
                  <VisibilityOutlined />
                ) : (
                  <VisibilityOffOutlined />
                )}
              </IconButton>
            </span>
          </BottomTooltip>

          <BottomTooltip placement="bottom" title="Fjern">
            <span className="geometry-tool-button">
              <IconButton
                className={classes.customIconButtom}
                onClick={() => deletePolygon()}
              >
                <Delete />
              </IconButton>
            </span>
          </BottomTooltip>
        </div>
      </div>
      <Snackbar open={showError} autoHideDuration={2500} onClose={closeError}>
        <div className="polygon-action-error">
          Polygon kanter kan ikke krysse
        </div>
      </Snackbar>
    </>
  );
};

export default PolygonDrawTool;
