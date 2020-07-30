import React from "react";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";
import CustomSwitch from "../../Common/CustomSwitch";
import CustomIcon from "../../Common/CustomIcon";

const ForvaltningsUnderElement = ({
  underlag,
  kartlagKey,
  underlagKey,
  valgt,
  onUpdateLayerProp,
  showSublayerDetails
}) => {
  let tittel = underlag.tittel;
  const erSynlig = underlag.erSynlig;
  let kode = "underlag." + underlagKey + ".";

  if (!tittel) return null;
  return (
    <>
      <ListItem
        // Elementet som inneholder tittel, switch og droppned-knapp
        id="list-element-sublayer"
        button
        onClick={() => {
          if (!valgt) {
            showSublayerDetails(underlag, kartlagKey, underlagKey);
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
                kartlagKey,
                kode + "erSynlig",
                !underlag.erSynlig
              );
              e.stopPropagation();
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                onUpdateLayerProp(
                  kartlagKey,
                  kode + "erSynlig",
                  !underlag.erSynlig
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
              color={erSynlig ? "#666" : "#999"}
            />
          </ListItemIcon>
        )}
      </ListItem>
    </>
  );
};

export default ForvaltningsUnderElement;
