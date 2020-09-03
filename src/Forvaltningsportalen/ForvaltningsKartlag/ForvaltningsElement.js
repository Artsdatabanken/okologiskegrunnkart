import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
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
import CustomSwitchAll from "../../Common/CustomSwitchAll";

const ForvaltningsElement = ({
  kartlag,
  onUpdateLayerProp,
  changeVisibleSublayers,
  changeExpandedLayers,
  kartlagKey,
  valgt,
  showSublayerDetails
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  const expanded = kartlag.expanded;
  let startstate = valgt || expanded;
  const [open, setOpen] = useState(startstate);
  const [allSublayersVisible, setAllSublayersVisible] = useState(false);

  const kartlagJSON = JSON.stringify(kartlag);

  useEffect(() => {
    let allVisible = true;
    Object.keys(kartlag.underlag).forEach(underlagKey => {
      let sublayer = kartlag.underlag[underlagKey];
      if (!sublayer.erSynlig) {
        allVisible = false;
      }
    });
    setAllSublayersVisible(allVisible);
  }, [kartlag, kartlagJSON]);

  if (!tittel) return null;

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  const toggleAllSublayers = () => {
    const newStatus = !allSublayersVisible;
    onUpdateLayerProp(kartlagKey, "erSynlig", newStatus);

    Object.keys(kartlag.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
      changeVisibleSublayers(
        kartlagKey,
        underlagKey,
        kode + "erSynlig",
        newStatus
      );
    });
    setAllSublayersVisible(newStatus);
  };

  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, ikon og droppned-knapp
        id="layer-list-item"
        button
        // divider
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
            setValue(kartlag, "expanded", !open);
            changeExpandedLayers(kartlag.id, !open);
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
          {Object.keys(kartlag.underlag).length > 1 && (
            <div className="underlag">
              <ListItem id="list-element-sublayer-all">
                <ListItemIcon onClick={e => e.stopPropagation()}>
                  <CustomSwitchAll
                    tabIndex="0"
                    id="visiblility-sublayer-toggle"
                    checked={allSublayersVisible}
                    onChange={e => {
                      toggleAllSublayers();
                      e.stopPropagation();
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        toggleAllSublayers();
                        e.stopPropagation();
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Alle kategorier"} />
                <ListItemIcon id="bookmark-icon">
                  <CustomIcon
                    id="bookmark"
                    icon="check-decagram"
                    size={20}
                    padding={0}
                    color={erSynlig ? "#666" : "#888"}
                  />
                </ListItemIcon>
              </ListItem>
            </div>
          )}

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
                      changeVisibleSublayers={changeVisibleSublayers}
                      showSublayerDetails={showSublayerDetails}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
