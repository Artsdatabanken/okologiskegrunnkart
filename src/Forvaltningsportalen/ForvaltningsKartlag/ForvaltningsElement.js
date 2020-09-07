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

  const toggleAllSublayers = () => {
    const newStatus = !allcategorieslayer.erSynlig;
    onUpdateLayerProp(kartlagKey, "erSynlig", newStatus);
    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newStatus);

    // If there is a sublayer with all results aggregated,
    // activate aggregated sublayer and dekningskart sublayers.
    // If not, activate all sublayers.
    Object.keys(kartlag.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      const sublayer = kartlag.underlag[underlagKey];

      // All categories visible property always updated the same way
      onUpdateLayerProp(kartlagKey, kode + "visible", newStatus);
      changeVisibleSublayers(
        kartlagKey,
        underlagKey,
        kode + "visible",
        newStatus
      );

      if (allcategorieslayer.wmslayer) {
        if (newStatus) {
          // NewStatus = true. Activate only aggregated sublayer and dekkningskart.
          // The rest are only pseudo-active (green switch but no HTTP request)
          if (
            sublayer.wmslayer.toLowerCase().includes("dekningskart") ||
            allcategorieslayer.wmslayer === sublayer.wmslayer
          ) {
            // Only aggregated and dekkningskart sublayers activated
            onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
            changeVisibleSublayers(
              kartlagKey,
              underlagKey,
              kode + "erSynlig",
              newStatus
            );
          } else {
            // Pseudo active, but not really visible
            onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
            changeVisibleSublayers(
              kartlagKey,
              underlagKey,
              kode + "erSynlig",
              false
            );
          }
        } else {
          // NewStatus = false. All sublayers inactive
          onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
          changeVisibleSublayers(
            kartlagKey,
            underlagKey,
            kode + "erSynlig",
            newStatus
          );
        }
      } else {
        let kode = "underlag." + underlagKey + ".";
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
        changeVisibleSublayers(
          kartlagKey,
          underlagKey,
          kode + "erSynlig",
          newStatus
        );
      }
    });
  };

  const toggleAllCategoriesOn = () => {
    onUpdateLayerProp(kartlagKey, "erSynlig", true);
    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", true);

    Object.keys(kartlag.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      const sublayer = kartlag.underlag[underlagKey];

      // All categories visible property always updated the same way
      onUpdateLayerProp(kartlagKey, kode + "visible", true);
      changeVisibleSublayers(kartlagKey, underlagKey, kode + "visible", true);

      if (
        sublayer.wmslayer.toLowerCase().includes("dekningskart") ||
        allcategorieslayer.wmslayer === sublayer.wmslayer
      ) {
        // Only aggregated and dekkningskart sublayers activated
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", true);
        changeVisibleSublayers(
          kartlagKey,
          underlagKey,
          kode + "erSynlig",
          true
        );
      } else {
        // Pseudo active, but not really visible
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        changeVisibleSublayers(
          kartlagKey,
          underlagKey,
          kode + "erSynlig",
          false
        );
      }
    });
  };

  const switchFromAllCategories = (kartlagKey, underlagKey, kode) => {
    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", false);

    Object.keys(kartlag.underlag).forEach(sublagkey => {
      let kode = "underlag." + sublagkey + ".";
      const sublayer = kartlag.underlag[sublagkey];
      if (
        allcategorieslayer.wmslayer === sublayer.wmslayer ||
        sublagkey === underlagKey
      ) {
        // If aggregated sublayer or selected sublayer, make inactive
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        changeVisibleSublayers(kartlagKey, sublagkey, kode + "erSynlig", false);
        onUpdateLayerProp(kartlagKey, kode + "visible", false);
        changeVisibleSublayers(kartlagKey, sublagkey, kode + "visible", false);
      } else if (!sublayer.wmslayer.toLowerCase().includes("dekningskart")) {
        // The rest of sublayers (if not dekkningskart), activate
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", true);
        changeVisibleSublayers(kartlagKey, sublagkey, kode + "erSynlig", true);
        onUpdateLayerProp(kartlagKey, kode + "visible", true);
        changeVisibleSublayers(kartlagKey, sublagkey, kode + "visible", true);
      }
    });
  };

  const toggleSublayer = (
    kartlagKey,
    underlagKey,
    kode,
    newStatus,
    newVisible
  ) => {
    let numberInvisible = 0;
    Object.keys(kartlag.underlag).forEach(key => {
      const sub = kartlag.underlag[key];
      if (
        kartlag.allcategorieslayer.wmslayer !== sub.wmslayer &&
        !sub.wmslayer.toLowerCase().includes("dekningskart")
      ) {
        if (!sub.visible) numberInvisible += 1;
      }
    });

    if (newVisible && numberInvisible === 1) {
      onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newVisible);
    } else if (!newVisible && numberInvisible === 0) {
      onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newVisible);
    }

    const allcategories = allcategorieslayer.wmslayer;
    if (newVisible && numberInvisible === 1 && allcategories) {
      toggleAllCategoriesOn();
    } else if (!newVisible && numberInvisible === 0 && allcategories) {
      switchFromAllCategories(kartlagKey, underlagKey, kode);
    } else {
      onUpdateLayerProp(kartlagKey, kode + "erSynlig", newVisible);
      onUpdateLayerProp(kartlagKey, kode + "visible", newVisible);
      changeVisibleSublayers(
        kartlagKey,
        underlagKey,
        kode + "erSynlig",
        newVisible
      );
      changeVisibleSublayers(
        kartlagKey,
        underlagKey,
        kode + "visible",
        newVisible
      );
    }
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
                <ListItemText primary={allcategorieslayer.tittel} />
                <ListItemIcon id="bookmark-icon">
                  <CustomIcon
                    id="bookmark"
                    icon="check-decagram"
                    size={20}
                    padding={0}
                    color={allcategorieslayer.erSynlig ? "#666" : "#888"}
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
                      toggleSublayer={toggleSublayer}
                      showSublayerDetails={showSublayerDetails}
                    />
                  </div>
                );
              })}
              {/* {Object.keys(kartlag.underlag).map(sublag => {
                let lag = kartlag.underlag[sublag];
                if (kartlag.allcategorieslayer.wmslayer !== lag.wmslayer) {
                  return (
                    <div className="underlag" key={sublag}>
                      <ForvaltningsUnderElement
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
              })} */}
            </>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsElement;
