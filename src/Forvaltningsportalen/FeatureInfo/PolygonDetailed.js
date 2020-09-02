import React, { useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";

const PolygonDetailed = ({
  resultLayer,
  detailResult,
  hideDetailedResults
}) => {
  const [numberResults, setNumberResults] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const detailResultJSON = JSON.stringify(detailResult);

  useEffect(() => {
    const number = detailResult ? detailResult.length : 0;
    let area = 0;
    for (let i = 0; i < detailResult.length; i++) {
      area += detailResult[i].km2;
    }
    setNumberResults(number);
    setTotalArea(area);
  }, [detailResult, detailResultJSON]);

  const iconSize = icon => {
    if (icon && ["terrain", "flag"].includes(icon))
      return { size: 28, padding: 1 };
    return { size: 30, padding: 0 };
  };

  return (
    <>
      <ListItem
        // Kartlag
        id="infobox-details-title-wrapper"
        button
        onClick={() => {
          hideDetailedResults();
        }}
      >
        <ListItemIcon>
          <KeyboardBackspace />
        </ListItemIcon>
        <ListItemText>
          <span className="infobox-details-title-text">
            Detaljerte resultater
          </span>
        </ListItemText>
      </ListItem>
      <div className="infobox-details-container">
        <ListItem id="infobox-details-layer" divider>
          <ListItemIcon className="infobox-list-icon-wrapper">
            <Badge
              className={"badge-enabled"}
              badgeContent={numberResults || 0}
              color="primary"
            >
              <CustomIcon
                id="infobox-list-icon"
                icon={resultLayer.icon}
                size={iconSize(resultLayer.icon).size || 30}
                padding={iconSize(resultLayer.icon).padding || 0}
                color={"#777"}
              />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary={resultLayer.name}
            secondary={resultLayer.owner}
          />
        </ListItem>
        <div className="infobox-details-wrapper">
          {detailResult &&
            detailResult.map((item, index) => {
              return (
                <div key={index} className="infobox-details-content-wrapper">
                  <div className="polygon-details-text-wrapper">
                    <div className="polygon-details-title">{item.navn}</div>
                    <div className="polygon-details-primary-text">
                      {item.kode}
                    </div>
                  </div>
                  <div className="polygon-details-text-wrapper space-between">
                    <div className="polygon-details-secondary-text">
                      {`${Math.round(item.km2 * 10) / 10} km²`}
                    </div>
                    <div className="polygon-details-secondary-text end-line">
                      {`(${Math.round((item.km2 / totalArea) * 1000) / 10}%)`}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default PolygonDetailed;
