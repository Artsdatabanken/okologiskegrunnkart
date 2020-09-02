import React from "react";
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
      marginLeft: "10px",
      backgroundColor: "rgba(145, 163, 176, 0)",
      padding: "10px"
    },
    "&:hover": {
      backgroundColor: "rgba(145, 163, 176, 0.5)"
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
  handlePolygonResults
}) => {
  const classes = useStyles();

  return (
    <>
      <div className="polygon-tool-wrapper">
        <div className="polygon-tool-label">
          <Typography variant="body1">Geometri</Typography>
        </div>
        <div className="polygon-buttons-wrapper">
          {polygon ? (
            <BottomTooltip placement="bottom" title="Rediger">
              <IconButton
                className={classes.customIconButtom}
                onClick={() => {
                  addPolygon(null);
                  addPolyline(polygon);
                  handleEditable(true);
                  handlePolygonResults(null);
                }}
              >
                <Create />
              </IconButton>
            </BottomTooltip>
          ) : (
            <>
              <BottomTooltip placement="bottom" title="Angre sist">
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
              </BottomTooltip>
              <BottomTooltip placement="bottom" title="Ferdig">
                <IconButton
                  className={classes.customIconButtom}
                  onClick={() => {
                    if (polyline.length > 1) {
                      addPolygon(polyline);
                      addPolyline([]);
                    }
                  }}
                >
                  <Done />
                </IconButton>
              </BottomTooltip>
            </>
          )}

          <BottomTooltip placement="bottom" title="Vis/Gjem">
            <IconButton
              className={classes.customIconButtom}
              onClick={() => {
                hideAndShowPolygon(!showPolygon);
              }}
            >
              {showPolygon ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
            </IconButton>
          </BottomTooltip>

          <BottomTooltip placement="bottom" title="Fjern">
            <IconButton
              className={classes.customIconButtom}
              onClick={() => {
                addPolygon(null);
                addPolyline([]);
                hideAndShowPolygon(true);
                handleEditable(true);
                handlePolygonResults(null);
              }}
            >
              <Delete />
            </IconButton>
          </BottomTooltip>
        </div>
      </div>
    </>
  );
};

export default PolygonDrawTool;
