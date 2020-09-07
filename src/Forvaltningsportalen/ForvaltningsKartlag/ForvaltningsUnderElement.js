import React from "react";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";
import CustomSwitch from "../../Common/CustomSwitch";
import CustomIcon from "../../Common/CustomIcon";

const ForvaltningsUnderElement = ({
  underlag,
  kartlagKey,
  underlagKey,
  toggleSublayer,
  showSublayerDetails
}) => {
  let tittel = underlag.tittel;
  const erSynlig = underlag.erSynlig;
  const visible = underlag.visible;
  let kode = "underlag." + underlagKey + ".";

  if (!tittel) return null;
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
            checked={visible}
            onChange={e => {
              toggleSublayer(
                kartlagKey,
                underlagKey,
                kode,
                !erSynlig,
                !visible
              );
              e.stopPropagation();
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                toggleSublayer(
                  kartlagKey,
                  underlagKey,
                  kode,
                  !erSynlig,
                  !visible
                );
                e.stopPropagation();
              }
            }}
          />
        </ListItemIcon>
        <ListItemText primary={tittel} />
        {underlag.suggested && (
          <ListItemIcon id="bookmark-icon">
            <CustomIcon
              id="bookmark"
              icon="check-decagram"
              size={20}
              padding={0}
              color={visible ? "#666" : "#999"}
            />
          </ListItemIcon>
        )}
      </ListItem>
    </>
  );
};

export default ForvaltningsUnderElement;
