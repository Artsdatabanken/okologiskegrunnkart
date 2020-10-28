import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton
} from "@material-ui/core";
import { BorderLeft } from "@material-ui/icons";
import CustomIcon from "../Common/CustomIcon";
import { withStyles } from "@material-ui/core/styles";
import BottomTooltip from "../Common/BottomTooltip";

const StyledBadge = withStyles(() => ({
  badge: {
    top: 5
  }
}))(Badge);

const TegnforklaringLink = ({
  layers,
  setLegendVisible,
  handleLegendPosition,
  isMobile
}) => {
  const [numberActive, setNumberActive] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const layersJSON = JSON.stringify(layers);

  useEffect(() => {
    let number = 0;
    Object.keys(layers).forEach(id => {
      const layer = layers[id];
      Object.values(layer.underlag || {}).forEach(sublayer => {
        if (
          sublayer &&
          (sublayer.erSynlig || sublayer.visible) &&
          layer.allcategorieslayer.wmslayer !== sublayer.wmslayer
        ) {
          number += 1;
        }
      });
    });
    setNumberActive(number);
    if (number > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [layers, layersJSON]);

  return (
    <ListItem
      id="legend-link-list-item"
      button
      onClick={() => {
        setLegendVisible(true);
      }}
      disabled={disabled}
    >
      <ListItemIcon>
        <StyledBadge
          className={"badge-enabled"}
          badgeContent={numberActive || 0}
          color="primary"
        >
          <CustomIcon
            id="legend-icon"
            icon="map-legend"
            size={26}
            padding={2}
            color={disabled ? "#999" : "#555"}
          />
        </StyledBadge>
      </ListItemIcon>
      <ListItemText>
        <span className="legend-text">Tegnforklaring</span>
      </ListItemText>
      {!isMobile && (
        <BottomTooltip placement="bottom" title="Åpne på venstre side">
          <IconButton
            onClick={e => {
              handleLegendPosition();
              e.stopPropagation();
            }}
          >
            <BorderLeft
              id="legend-icon-left-side"
              color={disabled ? "secondary" : "primary"}
            />
          </IconButton>
        </BottomTooltip>
      )}
    </ListItem>
  );
};

export default TegnforklaringLink;
