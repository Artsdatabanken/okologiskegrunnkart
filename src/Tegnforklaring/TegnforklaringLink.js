import React from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import CustomIcon from "../Common/CustomIcon";
import { withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles(() => ({
  badge: {
    top: 5
  }
}))(Badge);

const TegnforklaringLink = ({ layers, setLegendVisible }) => {
  const getActiveLayersCount = () => {
    let number = 0;
    Object.keys(layers).forEach(id => {
      const layer = layers[id];
      Object.values(layer.underlag || {}).forEach(sublayer => {
        if (
          (sublayer.erSynlig || sublayer.visible) &&
          layer.allcategorieslayer.wmslayer !== sublayer.wmslayer
        ) {
          number += 1;
        }
      });
    });
    return number;
  };

  return (
    <ListItem
      button
      onClick={() => {
        setLegendVisible(true);
      }}
    >
      <ListItemIcon>
        <StyledBadge
          className={"badge-enabled"}
          badgeContent={getActiveLayersCount() || 0}
          color="primary"
        >
          <CustomIcon
            id="legend-icon"
            icon="map-legend"
            size={26}
            padding={2}
            color="#555"
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
