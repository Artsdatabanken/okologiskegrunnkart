import React, { useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import "../../style/infobox.css";
import CustomIcon from "../../Common/CustomIcon";
import { getTextAreaReport } from "../../Funksjoner/translateAreaReport";
import PolygonDetailedDescription from "./PolygonDetailedDescription";

const PolygonDetailed = ({
  resultLayer,
  detailResult,
  hideDetailedResults,
  totalArea
}) => {
  const [numberResults, setNumberResults] = useState(0);
  const [sortedResult, setSortedResult] = useState(0);
  const detailResultJSON = JSON.stringify(detailResult);

  const areaToPresent = item => {
    let area = parseFloat(item.km2);
    if (area >= 10) return area.toFixed(1);
    if (area >= 0.1) return area.toFixed(2);
    if (area >= 0.01) return area.toFixed(3);
    else return area.toFixed(4);
  };

  const percentageToPresent = item => {
    if (!totalArea) return "0.00";
    let area = parseFloat(item.km2);
    const percentage = (area / totalArea) * 100;
    if (percentage >= 1) return percentage.toFixed(1);
    if (percentage >= 0.1) return percentage.toFixed(2);
    else return percentage.toFixed(3);
  };

  useEffect(() => {
    let sorted = detailResult.sort((a, b) => {
      return b.km2 - a.km2;
    });
    if (resultLayer.code === "N13") {
      sorted = sorted.map(item => {
        // NOTE: A08 has been moved to A11, but data still returns A08
        return {
          ...item,
          navn: getTextAreaReport(
            "N13",
            item.kode === "A08" ? "A11" : item.kode,
            "name"
          ),
          beskrivelse: getTextAreaReport(
            "N13",
            item.kode === "A08" ? "A11" : item.kode,
            "description"
          )
        };
      });
    }
    if (resultLayer.code === "ANF") {
      sorted = sorted.map(item => {
        return {
          ...item,
          navn: item.kode,
          kode: ""
          // beskrivelse: getTextAreaReport("ANF", item.kode, "description")
        };
      });
    }
    const number = sorted ? sorted.length : 0;
    setSortedResult(sorted);
    setNumberResults(number);
  }, [detailResult, detailResultJSON, resultLayer]);

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
          {sortedResult &&
            sortedResult.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    item.beskrivelse
                      ? "polygon-details-content-wrapper-description"
                      : "polygon-details-content-wrapper"
                  }
                >
                  <div className="polygon-details-text-wrapper">
                    <div className="polygon-details-title">{item.navn}</div>
                    <div className="polygon-details-primary-text">
                      {item.kode}
                    </div>
                  </div>
                  <div className="polygon-details-text-wrapper space-between">
                    <div className="polygon-details-secondary-text">
                      {`${areaToPresent(item)} km²`}
                    </div>
                    <div className="polygon-details-secondary-text end-line">
                      {`(${percentageToPresent(item)}%)`}
                    </div>
                  </div>
                  {item.beskrivelse && (
                    <PolygonDetailedDescription item={item} />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default PolygonDetailed;
