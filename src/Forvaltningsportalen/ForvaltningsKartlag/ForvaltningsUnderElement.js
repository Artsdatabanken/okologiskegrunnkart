import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  Typography,
  Slider,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import CustomSwitch from "../../Common/CustomSwitch";

const ForvaltningsUnderElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  kartlag_owner_key,
  valgt
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  let kode = "underlag." + kartlag_key + ".";
  if (!tittel) return null;
  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, visningsøye og droppned-knapp
        id="list-element-sublayer"
        button
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
          }
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <CustomSwitch
            tabIndex="0"
            id="visiblility-sublayer-toggle"
            checked={erSynlig}
            onChange={e => {
              onUpdateLayerProp(
                kartlag_owner_key,
                kode + "erSynlig",
                !kartlag.erSynlig
              );
              e.stopPropagation();
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                onUpdateLayerProp(
                  kartlag_owner_key,
                  kode + "erSynlig",
                  !kartlag.erSynlig
                );
                e.stopPropagation();
              }
            }}
            disabled={false}
          />
        </ListItemIcon>
        <ListItemText primary={tittel.nb || tittel} />

        {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>

      <Collapse
        className="underlag_collapse"
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
          <div>
            <h4>Gjennomsiktighet</h4>
            <Slider
              value={100 * kartlag.opacity || 80}
              step={1}
              min={0}
              max={100}
              onChange={(e, v) => {
                onUpdateLayerProp(
                  kartlag_owner_key,
                  kode + "opacity",
                  v / 100.0
                );
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={opacity => opacity + " %"}
            />

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
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsUnderElement;
