import Geonorge from "./Geonorge";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  OpenInNew,
  VisibilityOutlined,
  Link,
  Description,
  Layers,
  VisibilityOffOutlined
} from "@material-ui/icons";
import {
  Typography,
  Slider,
  IconButton,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ForvaltningsUnderElement = ({
  kartlag,
  erAktivtLag,
  onUpdateLayerProp,
  handleShowCurrent,
  show_current,
  kartlag_key,
  kartlag_owner_key,
  valgt,
  element
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.turnedon;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  const [hasLegend, setHasLegend] = useState(true);
  if (!tittel) return null;
  let kode = "underlag." + kartlag_key + ".";

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, visningsøye og droppned-knapp
        button
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
          }
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <IconButton
            className="visibility_button"
            onClick={e => {
              onUpdateLayerProp(
                kartlag_owner_key,
                kode + "turnedon",
                !erSynlig
              );
              e.stopPropagation();
            }}
          >
            {erSynlig ? (
              <VisibilityOutlined style={{ color: "#333" }} />
            ) : (
              <VisibilityOffOutlined style={{ color: "#aaa" }} />
            )}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={tittel.nb || tittel} />

        {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
          {kartlag.kart && kartlag.kart.format.wms && (
            <div>
              {hasLegend && (
                <>
                  <Typography id="range-slider" gutterBottom>
                    Tegnforklaring
                  </Typography>
                  <div style={{ paddingLeft: 56 }}>
                    <img
                      alt="legend"
                      onError={() => setHasLegend(false)}
                      src={`${kartlag.kart.format.wms.url}?layer=${kartlag.kart.format.wms.layer}&request=GetLegendGraphic&format=image/png&version=1.3.0`}
                    />
                  </div>
                </>
              )}
              {kartlag.legendeurl && (
                <>
                  <Typography id="range-slider" gutterBottom>
                    Tegnforklaring
                  </Typography>
                  <div style={{ paddingLeft: 56 }}>
                    <img
                      alt="legend"
                      src={kartlag.legendeurl}
                      style={{ maxWidth: "90%" }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsUnderElement;
