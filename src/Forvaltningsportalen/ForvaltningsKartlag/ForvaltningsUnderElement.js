import React from "react";
import { VisibilityOff, Visibility } from "@material-ui/icons";
import {
  Slider,
  IconButton,
  ListItemIcon,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ForvaltningsUnderElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  kartlag_owner_key
}) => {
  const setOpacity = v => {
    onUpdateLayerProp(kartlag_owner_key, kode + "opacity", v / 100.0);
    onUpdateLayerProp(kartlag_owner_key, kode + "erSynlig", v > 0);
  };
  let tittel = kartlag.tittel;
  let kode = "underlag." + kartlag_key + ".";
  if (!tittel) return null;
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <IconButton onClick={() => setOpacity(kartlag.opacity > 0 ? 0 : 90)}>
            {kartlag.opacity > 0 ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={tittel.nb || tittel}
          secondary={
            <Slider
              value={100 * kartlag.opacity}
              step={1}
              aria-labelledby="opacity"
              getAriaValueText={opacity => opacity + " %"}
              onChange={(e, v) => setOpacity(v)}
            />
          }
        />
      </ListItem>
    </>
  );
};

export default ForvaltningsUnderElement;
