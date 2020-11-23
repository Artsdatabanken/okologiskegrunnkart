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
import BottomTooltip from "../Common/BottomTooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  customIconButtom: {
    "&.MuiIconButton-root": {
      color: "#666",
      border: "1px solid #666",
      backgroundColor: "rgba(145, 163, 176, 0)",
      padding: "9px",
      margin: "4px 4px 4px 0"
    },
    "&:hover": {
      backgroundColor: "rgba(145, 163, 176, 1)"
    },
    "&.Mui-disabled": {
      color: "#999",
      border: "1px solid #999"
    }
  },
  badge: {
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      top: 5
    },
    "& .MuiBadge-colorPrimary": {
      backgroundColor: "#22aa58 !important"
    }
  }
}));

const TegnforklaringLink = ({
  layers,
  setLegendVisible,
  handleLegendPosition,
  isMobile
}) => {
  const classes = useStyles();

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
        <Badge
          className={classes.badge}
          // className={"badge-enabled"}
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
        </Badge>
      </ListItemIcon>
      <ListItemText>
        <span className="legend-text">Tegnforklaring</span>
      </ListItemText>
      {!isMobile && (
        <BottomTooltip placement="bottom" title="Åpne på venstre side">
          <IconButton
            className={classes.customIconButtom}
            onClick={e => {
              handleLegendPosition();
              e.stopPropagation();
            }}
            disabled={disabled}
          >
            <BorderLeft />
            {/* <BorderLeft
              id="legend-icon-left-side"
              color={disabled ? "secondary" : "primary"}
            /> */}
          </IconButton>
        </BottomTooltip>
      )}
    </ListItem>
  );
};

export default TegnforklaringLink;
