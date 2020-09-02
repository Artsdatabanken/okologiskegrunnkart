import { ListItem, ListItemIcon } from "@material-ui/core";
import React from "react";
import { Badge } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";

const PolygonElement = ({ polygonLayer, result, showDetailedResults }) => {
  const numberResults = result ? result.length : 0;

  const iconSize = icon => {
    if (icon && ["terrain", "flag"].includes(icon))
      return { size: 28, padding: 1 };
    return { size: 30, padding: 0 };
  };

  return (
    <div className="generic_element">
      <ListItem
        id="polygon-element-list"
        button
        divider
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          showDetailedResults(polygonLayer, result);
        }}
      >
        <ListItemIcon className="infobox-list-icon-wrapper">
          <Badge
            badgeContent={result.error ? "!" : numberResults}
            color={result.error ? "error" : "primary"}
          >
            <CustomIcon
              id="infobox-list-icon"
              icon={polygonLayer.icon}
              size={iconSize(polygonLayer.icon).size || 30}
              padding={iconSize(polygonLayer.icon).padding || 0}
              color={"#777"}
            />
          </Badge>
        </ListItemIcon>
        <div
          style={{
            flex: 1
          }}
        >
          <div className="generic-element-primary-text">
            {polygonLayer.name}
          </div>
          <div className="generic-element-data-owner">{polygonLayer.owner}</div>
        </div>
      </ListItem>
    </div>
  );
};

export default PolygonElement;
