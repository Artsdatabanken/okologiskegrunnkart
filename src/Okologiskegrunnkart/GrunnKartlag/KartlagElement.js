import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import KartlagUnderElement from "./KartlagUnderElement";
import CustomIcon from "../../Common/CustomIcon";
import Badge from "@material-ui/core/Badge";
import { setValue } from "../../Funksjoner/setValue";
import CustomSwitchAll from "../../Common/CustomSwitchAll";

const KartlagElement = ({
  kartlag,
  kartlagKey,
  valgt,
  toggleSublayer,
  toggleAllSublayers,
  showSublayerDetails
}) => {
  const tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  const expanded = kartlag.expanded;
  const allcategorieslayer = kartlag.allcategorieslayer;
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
          {Object.keys(kartlag.underlag).length > 1 && allcategorieslayer && (
            <div className="underlag-all">
              <ListItem
                id="list-element-sublayer-all"
                button
                onClick={() => {
                  showSublayerDetails(kartlag, kartlag.id, null);
                }}
              >
                <ListItemIcon onClick={e => e.stopPropagation()}>
                  <CustomSwitchAll
                    tabIndex="0"
                    id="visiblility-sublayer-toggle"
                    checked={allcategorieslayer.erSynlig}
                    onChange={e => {
                      toggleAllSublayers(kartlag.id);
                      e.stopPropagation();
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        toggleAllSublayers(kartlag.id);
                        e.stopPropagation();
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={allcategorieslayer.tittel} />
                <ListItemIcon id="open-details-icon">
                  <CustomIcon
                    id="open-details"
                    icon="chevron-right"
                    size={20}
                    padding={0}
                    color="#666"
                  />
                </ListItemIcon>
              </ListItem>
            </div>
          )}

          {kartlag.underlag && (
            <>
              {Object.keys(kartlag.underlag).map(sublag => {
                let lag = kartlag.underlag[sublag];
                if (kartlag.allcategorieslayer.wmslayer !== lag.wmslayer) {
                  return (
                    <div className="underlag" key={sublag}>
                      <KartlagUnderElement
                        underlag={lag}
                        kartlagKey={kartlagKey}
                        underlagKey={sublag}
                        toggleSublayer={toggleSublayer}
                        showSublayerDetails={showSublayerDetails}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default KartlagElement;
