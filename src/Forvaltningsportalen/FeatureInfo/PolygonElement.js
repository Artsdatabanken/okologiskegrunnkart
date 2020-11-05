import { ListItem, ListItemIcon } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Badge } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";

const PolygonElement = ({
  polygonLayer,
  result,
  showDetailedPolygonResults,
  grensePolygon
}) => {
  const [numberResults, setNumberResults] = useState(0);
  const [detailedResult, setDetailedResult] = useState(0);

  const resultJSON = JSON.stringify(result);

  const iconSize = icon => {
    if (icon && ["terrain", "flag"].includes(icon))
      return { size: 28, padding: 1 };
    return { size: 30, padding: 0 };
  };

  useEffect(() => {
    let filtered = result;
    if (polygonLayer.code === "FYL" || polygonLayer.code === "KOM") {
      if (grensePolygon === "fylke" || grensePolygon === "kommune") {
        filtered = result.filter(item => item.km2 >= 0.1);
      }
    }
    const number = filtered ? filtered.length : 0;
    setNumberResults(number);
    setDetailedResult(filtered);
  }, [result, resultJSON, grensePolygon, polygonLayer]);

  if (!polygonLayer) return null;

  return (
    <div className="generic_element">
      <ListItem
        id="polygon-element-list"
        button={result.error ? false : true}
        divider
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!result.error) {
            showDetailedPolygonResults(polygonLayer, detailedResult);
          }
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
