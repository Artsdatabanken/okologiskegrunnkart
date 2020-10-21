import React, { useState, useEffect } from "react";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  Delete,
  Create,
  Done,
  Undo
} from "@material-ui/icons";
import { IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BottomTooltip from "../../Common/BottomTooltip";

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
  grensePolygon
}) => {
  const classes = useStyles();

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (grensePolygon !== "none") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [grensePolygon]);

  return (
    <>
      <div className="polygon-tool-wrapper">
        <div className="polygon-tool-label">
          <Typography
            id={disabled ? "geometry-tool-disabled" : ""}
            variant="body1"
          >
            Geometri
          </Typography>
        </div>
        <div className="polygon-buttons-wrapper">
          {polygon ? (
            <BottomTooltip
              placement="bottom"
              title="Rediger"
              disableHoverListener={disabled}
            >
              <span className="geometry-tool-button">
                <IconButton
                  className={classes.customIconButtom}
                  onClick={() => {
                    addPolygon(null);
                    addPolyline(polygon);
                    handleEditable(true);
                    handlePolygonResults(null);
                  }}
                  disabled={disabled}
                >
                  <Create />
                </IconButton>
              </span>
            </BottomTooltip>
          ) : (
            <>
              <BottomTooltip
                placement="bottom"
                title="Angre sist"
                disableHoverListener={disabled}
              >
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => {
                      if (polyline.length > 0) {
                        polyline.pop();
                        addPolyline(polyline);
                      }
                    }}
                    disabled={disabled}
                  >
                    <Undo />
                  </IconButton>
                </span>
              </BottomTooltip>
              <BottomTooltip
                placement="bottom"
                title="Ferdig"
                disableHoverListener={disabled}
              >
                <span className="geometry-tool-button">
                  <IconButton
                    className={classes.customIconButtom}
                    onClick={() => {
                      if (polyline.length > 1) {
                        addPolygon(polyline);
                        addPolyline([]);
                      }
                    }}
                    disabled={disabled}
                  >
                    <Done />
                  </IconButton>
                </span>
              </BottomTooltip>
            </>
          )}

          <BottomTooltip
            placement="bottom"
            title="Vis/Gjem"
            disableHoverListener={disabled}
          >
            <span className="geometry-tool-button">
              <IconButton
                className={classes.customIconButtom}
                onClick={() => {
                  hideAndShowPolygon(!showPolygon);
                }}
                disabled={disabled}
              >
                {showPolygon ? (
                  <VisibilityOutlined />
                ) : (
                  <VisibilityOffOutlined />
                )}
              </IconButton>
            </span>
          </BottomTooltip>

          <BottomTooltip
            placement="bottom"
            title="Fjern"
            disableHoverListener={disabled}
          >
            <span className="geometry-tool-button">
              <IconButton
                className={classes.customIconButtom}
                onClick={() => {
                  addPolygon(null);
                  addPolyline([]);
                  hideAndShowPolygon(true);
                  handleEditable(true);
                  handlePolygonResults(null);
                }}
                disabled={disabled}
              >
                <Delete />
              </IconButton>
            </span>
          </BottomTooltip>
        </div>
      </div>
    </>
  );
};

export default PolygonDrawTool;
