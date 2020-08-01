import React, { useState } from "react";
import {
  VisibilityOff,
  VisibilityOutlined,
  VisibilityOffOutlined,
  Visibility
} from "@material-ui/icons";
import {
  Slider,
  IconButton,
  ListItemIcon,
  Grid,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ForvaltningsUnderElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  kartlag_owner_key,
  valgt
}) => {
  const setOpacity = v => {
    onUpdateLayerProp(kartlag_owner_key, kode + "opacity", v / 100.0);
    onUpdateLayerProp(kartlag_owner_key, kode + "erSynlig", v > 0);
  };
  let tittel = kartlag.tittel;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  let kode = "underlag." + kartlag_key + ".";
  if (!tittel) return null;
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
        style={{
          _backgroundColor:
            !kartlag.erSynlig || kartlag.opacity === 0 ? "#ccc" : "#fff"
        }}
      >
        <ListItemText
          primary={tittel.nb || tittel}
          secondary={
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <IconButton
                  onClick={() => setOpacity(kartlag.opacity > 0 ? 0 : 90)}
                >
                  {kartlag.opacity > 0 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider
                  value={100 * kartlag.opacity}
                  step={1}
                  aria-labelledby="opacity"
                  getAriaValueText={opacity => opacity + " %"}
                  onChange={(e, v) => setOpacity(v)}
                />
              </Grid>
            </Grid>
          }
        />
      </ListItem>
    </>
  );
};

export default ForvaltningsUnderElement;
