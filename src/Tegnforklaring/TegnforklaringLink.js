import React, { useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import CustomIcon from "../Common/CustomIcon";
import { withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles(() => ({
  badge: {
    top: 5
  }
}))(Badge);

const TegnforklaringLink = ({ layers, setLegendVisible }) => {
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
            color={disabled ? "#888" : "#555"}
          />
        </StyledBadge>
      </ListItemIcon>
      <ListItemText>
        <span className="legend-text">Tegnforklaring</span>
      </ListItemText>
    </ListItem>
  );
};

export default TegnforklaringLink;
