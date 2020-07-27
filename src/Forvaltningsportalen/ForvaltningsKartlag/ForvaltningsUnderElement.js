import {
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import React, { useState } from "react";
import {
  Slider,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import CustomSwitch from "../../Common/CustomSwitch";
import CustomIcon from "../../Common/CustomIcon";
import { setValue } from "../../Funksjoner/setValue";

const ForvaltningsUnderElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  kartlag_owner_key,
  valgt
}) => {
  let tittel = kartlag.tittel;
  const erSynlig = kartlag.erSynlig;
  const expanded = kartlag.expanded;
  let startstate = valgt || expanded;
  const [open, setOpen] = useState(startstate);
  const [sliderValue, setSliderValue] = useState(kartlag.opacity || 80);
  let kode = "underlag." + kartlag_key + ".";

  const handleSliderChange = value => {
    setSliderValue(value / 100);
  };
  const changeLayerOpacity = value => {
    setSliderValue(value / 100);
    onUpdateLayerProp(kartlag_owner_key, kode + "opacity", value / 100.0);
  };

  const ListRow = React.forwardRef(function ListRow(props, ref) {
    return (
      <ListItem
        // Elementet som inneholder tittel, switch og droppned-knapp
        {...props}
        ref={ref}
        id="list-element-sublayer"
        button
        onClick={() => {
          if (!valgt) {
            setOpen(!open);
            setValue(kartlag, "expanded", !open);
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
          />
        </ListItemIcon>
        <ListItemText primary={tittel} />
        {kartlag.suggested && (
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
        {!valgt && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItem>
    );
  });

  if (!tittel) return null;
  return (
    <>
      <ListRow />
      <Collapse
        className="underlag_collapse"
        in={open}
        timeout="auto"
        unmountOnExit
        // Underelementet
      >
        <div className="collapsed_container">
          <div>
            <div className="opacity-slider-wrapper">
              <VisibilityOff id="opacity-invisible-icon" color="primary" />
              <Slider
                color="primary"
                value={Math.round(100 * sliderValue)}
                step={1}
                min={0}
                max={100}
                onChange={(e, v) => {
                  handleSliderChange(v);
                }}
                onChangeCommitted={(e, v) => {
                  changeLayerOpacity(v);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={opacity => opacity + " %"}
                disabled={!erSynlig}
              />
              <Visibility
                id={
                  erSynlig
                    ? "opacity-visible-icon"
                    : "opacity-visible-icon-disabled"
                }
                color="primary"
                style={{ paddingRight: 0, paddingLeft: 15 }}
              />
            </div>

            {kartlag.legendeurl && (
              <>
                <Typography id="legend-sublayer" variant="body2" gutterBottom>
                  Tegnforklaring
                </Typography>
                <img alt="tegnforklaring" src={kartlag.legendeurl} />
              </>
            )}
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default ForvaltningsUnderElement;
