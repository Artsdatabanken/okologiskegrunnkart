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

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  useEffect(() => {
    if (!result) {
      setNumberResults(0);
      setDetailedResult([]);
      return;
    }
    let filtered = result;
    const code = polygonLayer.code;
    if (result && Array.isArray(result) && (code === "FYL" || code === "KOM")) {
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
        button={numberResults > 0}
        divider
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          if (result && !result.error) {
            showDetailedPolygonResults(polygonLayer, detailedResult);
          }
        }}
      >
        <ListItemIcon className="infobox-list-icon-wrapper">
          <Badge
            badgeContent={result && result.error ? "!" : numberResults}
            color={result && result.error ? "error" : "primary"}
            max={numberResults > 999 ? 999 : 99}
          >
            <CustomIcon
              id="infobox-list-icon"
              icon={polygonLayer.icon}
              size={isLargeIcon(polygonLayer.icon) ? 30 : 26}
              padding={isLargeIcon(polygonLayer.icon) ? 0 : 2}
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
        <ListItemIcon id="open-details-icon">
          {numberResults > 0 && (
            <CustomIcon
              id="open-details"
              icon="chevron-right"
              size={20}
              padding={0}
              color="#666"
            />
          )}
        </ListItemIcon>
      </ListItem>
    </div>
  );
};

export default PolygonElement;
