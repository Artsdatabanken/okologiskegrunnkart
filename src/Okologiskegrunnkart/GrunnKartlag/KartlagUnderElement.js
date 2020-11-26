import React, { useState, useEffect } from "react";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";
import CustomSwitch from "../../Common/CustomSwitch";
import CustomIcon from "../../Common/CustomIcon";
import BottomTooltip from "../../Common/BottomTooltip";

const KartlagUnderElement = ({
  underlag,
  kartlagKey,
  underlagKey,
  toggleSublayer,
  showSublayerDetails
}) => {
  const [sublayer, setSublayer] = useState(underlag);
  const [code] = useState("underlag." + underlagKey + ".");

  const sublayerJSON = JSON.stringify(underlag);

  useEffect(() => {
    setSublayer(underlag);
  }, [underlag, sublayerJSON]);

  if (!underlag.tittel) return null;
  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, switch og droppned-knapp
        id="list-element-sublayer"
        button
        onClick={() => {
          showSublayerDetails(underlag, kartlagKey, underlagKey);
        }}
      >
        <ListItemIcon onClick={e => e.stopPropagation()}>
          <CustomSwitch
            tabIndex="0"
            id="visiblility-sublayer-toggle"
            checked={sublayer.visible}
            onChange={e => {
              toggleSublayer(
                kartlagKey,
                underlagKey,
                code,
                !sublayer.erSynlig,
                !sublayer.visible
              );
              e.stopPropagation();
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                toggleSublayer(
                  kartlagKey,
                  underlagKey,
                  code,
                  !sublayer.erSynlig,
                  !sublayer.visible
                );
                e.stopPropagation();
              }
            }}
          />
        </ListItemIcon>
        <ListItemText primary={sublayer.tittel} />
        {/* {underlag.suggested && (
          <ListItemIcon id="bookmark-icon">
            <CustomIcon
              id="bookmark"
              icon="check-decagram"
              size={20}
              padding={0}
              color={visible ? "#666" : "#999"}
            />
          </ListItemIcon>
        )} */}
        <ListItemIcon id="open-details-icon">
          <CustomIcon
            id="open-details"
            icon="chevron-right"
            size={20}
            padding={0}
            color="#666"
          />
        </ListItemIcon>
        {sublayer.visible && sublayer.tileerror && (
          <BottomTooltip placement="bottom" title="Får ikke svar">
            <ListItemIcon id="tile-error-icon">
              <CustomIcon
                id="tile-error"
                icon="alert-circle"
                size={20}
                padding={0}
                color="#cc0000"
              />
            </ListItemIcon>
          </BottomTooltip>
        )}
      </ListItem>
    </>
  );
};

export default KartlagUnderElement;
