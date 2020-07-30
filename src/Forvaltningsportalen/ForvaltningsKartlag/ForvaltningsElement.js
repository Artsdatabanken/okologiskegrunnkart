import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsUnderElement";
import CustomIcon from "../../Common/CustomIcon";
import Badge from "@material-ui/core/Badge";
import { setValue } from "../../Funksjoner/setValue";
import { OpenInNew, Link, Layers } from "@material-ui/icons";

const ForvaltningsElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlagKey,
  valgt,
  zoom,
  showSublayerDetails
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  const expanded = kartlag.expanded;
  let startstate = valgt || expanded;
  const [open, setOpen] = useState(startstate);
  if (!tittel) return null;

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, ikon og droppned-knapp
        id="layer-list-item"
        button
        divider
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
            setValue(kartlag, "expanded", !open);
          }
        }}
      >
        <ListItemIcon>
          <div className="layer-list-element-icon">
            <Badge
              className={"badge-enabled"}
              badgeContent={kartlag.numberVisible || 0}
              color="primary"
            >
              <CustomIcon
                id="kartlag"
                icon={kartlag.tema}
                size={isLargeIcon(kartlag.tema) ? 30 : 26}
                padding={isLargeIcon(kartlag.tema) ? 0 : 2}
                color={erSynlig ? "#666" : "#999"}
              />
            </Badge>
          </div>
        </ListItemIcon>
        <ListItemText primary={tittel} secondary={kartlag.dataeier} />
        {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
          {kartlag.underlag && (
            <>
              {Object.keys(kartlag.underlag).map(sublag => {
                let lag = kartlag.underlag[sublag];

                return (
                  <div className="underlag" key={sublag}>
                    <ForvaltningsUnderElement
                      underlag={lag}
                      kartlagKey={kartlagKey}
                      underlagKey={sublag}
                      onUpdateLayerProp={onUpdateLayerProp}
                      zoom={zoom}
                      showSublayerDetails={showSublayerDetails}
                    />
                  </div>
                );
              })}
            </>
          )}

          {/* <ForvaltningsGeneralInfo kartlag={kartlag} /> */}

          {/* {kartlag.dataeier && (
            <ListItem id="data-owner-element">
              <ListItemIcon>
                {kartlag.logourl ? (
                  <img
                    src={kartlag.logourl}
                    style={{ maxWidth: "24px" }}
                    alt=""
                  />
                ) : (
                  <>{kartlag.kildeurl ? <Link /> : <Layers />}</>
                )}
              </ListItemIcon>
              <ListItemText
                primary={kartlag.dataeier}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          )} */}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
