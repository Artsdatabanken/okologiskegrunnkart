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
    // "&.Mui-focusVisible": { backgroundColor: "rgba(145, 163, 176, 0.6)" }
  }
}));

const PolygonElement = ({
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline
}) => {
  const classes = useStyles();

  return (
    <>
      <div className="polygon-tool-wrapper">
        {/* <IconButton
          className={classes.customIconButtom}
          onClick={e => {
            hideAndShowPolygon(!showPolygon);
          }}
        >
          {showPolygon ? (
            <VisibilityOutlined style={{ color: "#666" }} />
          ) : (
            <VisibilityOffOutlined style={{ color: "#aaa" }} />
          )}
        </IconButton> */}
        <div className="polygon-tool-label">
          <Typography variant="body1">Geometri</Typography>
        </div>
        <div className="polygon-buttons-wrapper">
          {polygon ? (
            <BottomTooltip placement="bottom" title="Rediger">
              <IconButton
                className={classes.customIconButtom}
                onClick={e => {
                  addPolygon(null);
                  addPolyline(polygon);
                  handleEditable(true);
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
                  onClick={e => {
                    addPolygon(polyline);
                    addPolyline([]);
                  }}
                >
                  <Undo />
                </IconButton>
              </BottomTooltip>
              <BottomTooltip placement="bottom" title="Ferdig">
                <IconButton
                  className={classes.customIconButtom}
                  onClick={e => {
                    addPolygon(polyline);
                    addPolyline([]);
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
              onClick={e => {
                hideAndShowPolygon(!showPolygon);
              }}
            >
              {showPolygon ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
            </IconButton>
          </BottomTooltip>

          <BottomTooltip placement="bottom" title="Fjern">
            <IconButton
              className={classes.customIconButtom}
              onClick={e => {
                addPolygon(null);
                addPolyline([]);
                hideAndShowPolygon(true);
                handleEditable(true);
              }}
            >
              <Delete />
            </IconButton>
          </BottomTooltip>
        </div>
        {/* <div className="polygon-buttons-wrapper">
          {polygon ? (
            <button
              className="polygonbutton edit"
              onClick={e => {
                addPolygon(null);
                addPolyline(polygon);
                handleEditable(true);
              }}
            >
              <Create /> Rediger
            </button>
          ) : (
            <>
              <button
                className="polygonbutton done"
                onClick={e => {
                  addPolygon(polyline);
                  addPolyline([]);
                }}
              >
                <Done /> Ferdig
              </button>
              <button
                className="polygonbutton done"
                onClick={e => {
                  addPolygon(polyline);
                  addPolyline([]);
                }}
              >
                <Undo /> Angre
              </button>
            </>
          )}

          <button
            className="polygonbutton remove"
            onClick={e => {
              addPolygon(null);
              addPolyline([]);
              hideAndShowPolygon(true);
              handleEditable(true);
            }}
          >
            <Delete /> Fjern
          </button>
        </div> */}
      </div>
    </>
  );
};

export default PolygonElement;
