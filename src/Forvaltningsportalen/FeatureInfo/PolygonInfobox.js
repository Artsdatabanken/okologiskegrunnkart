import React, { useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";
import "../../style/infobox.css";
import PolygonDrawTool from "./PolygonDrawTool";
import PolygonLayers from "./PolygonLayers";
import proj4 from "proj4";

const PolygonInfobox = ({
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline,
  handlePolygonResults
}) => {
  const [perimeter, setPerimeter] = useState(null);
  const [perimeterUnit, setPerimeterUnit] = useState("m");
  const [area, setArea] = useState(null);
  const [areaUnit, setAreaUnit] = useState("m");

  const polylineJSON = JSON.stringify(polyline);
  const polygonJSON = JSON.stringify(polygon);

  useEffect(() => {
    if (!polygon && !polyline) {
      setPerimeter(null);
      return;
    }

    let points = polyline;
    // If polygon, add the first point as the last one
    if (polygon) {
      points = [...polygon];
      points.push(polygon[0]);
    }

    if (points.length < 2) {
      setPerimeter(null);
      return;
    }

    let dist = 0;
    let unit = "m";
    for (let i = 1; i < points.length; i++) {
      const lat1 = points[i - 1][0];
      const lng1 = points[i - 1][1];
      const lat2 = points[i][0];
      const lng2 = points[i][1];

      // Calculate projections of real coordinates
      const geographicProjection = "+proj=longlat +datum=WGS84 +no_defs";
      const utm33Projection =
        "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

      const [x1, y1] = proj4(geographicProjection, utm33Projection, [
        lng1,
        lat1
      ]);
      const [x2, y2] = proj4(geographicProjection, utm33Projection, [
        lng2,
        lat2
      ]);

      dist += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    if (dist >= 100000) {
      dist = Math.round(dist / 100) / 10;
      unit = "km";
    } else if (dist >= 10000) {
      dist = Math.round(dist / 10) / 100;
      unit = "km";
    } else if (dist >= 1000) {
      dist = Math.round(dist) / 1000;
      unit = "km";
    } else {
      dist = Math.round(dist * 10) / 10;
    }
    setPerimeter(dist);
    setPerimeterUnit(unit);
  }, [polygon, polygonJSON, polyline, polylineJSON]);

  useEffect(() => {
    if (!polygon || polygon.length < 3) {
      setArea(null);
      return;
    }

    const pointsCount = polygon.length;
    let area = 0;
    let unit = "m";
    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        const lat1 = polygon[i][0];
        const lng1 = polygon[i][1];
        const lat2 = polygon[(i + 1) % pointsCount][0];
        const lng2 = polygon[(i + 1) % pointsCount][1];

        // Calculate projections of real coordinates
        const geographicProjection = "+proj=longlat +datum=WGS84 +no_defs";
        const utm33Projection =
          "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

        const [x1, y1] = proj4(geographicProjection, utm33Projection, [
          lng1,
          lat1
        ]);
        const [x2, y2] = proj4(geographicProjection, utm33Projection, [
          lng2,
          lat2
        ]);

        // Calculate area
        const addX = x1;
        const addY = y2;
        const subX = x2;
        const subY = y1;
        area += addX * addY * 0.5;
        area -= subX * subY * 0.5;
      }
    }
    area = Math.abs(area);

    if (area >= 1000000000) {
      area = Math.round(area / 100000) / 10;
      unit = "km";
    } else if (area >= 100000000) {
      area = Math.round(area / 10000) / 100;
      unit = "km";
    } else if (area >= 1000000) {
      area = Math.round(area / 1000) / 1000;
      unit = "km";
    } else if (area > 1000) {
      area = Math.round(area);
    } else {
      area = Math.round(area * 10) / 10;
    }
    setArea(area);
    setAreaUnit(unit);
  }, [polygon, polygonJSON]);

  return (
    <div className="infobox-side">
      <PolygonDrawTool
        polygon={polygon}
        polyline={polyline}
        showPolygon={showPolygon}
        hideAndShowPolygon={hideAndShowPolygon}
        handleEditable={handleEditable}
        addPolygon={addPolygon}
        addPolyline={addPolyline}
      />
      <div className="infobox-content">
        <div className="infobox-text-wrapper-polygon">
          <CustomIcon
            id="polygon-icon"
            icon="hexagon-outline"
            color="grey"
            size={24}
          />
          <div className="infobox-text-multiple">
            <div className="infobox-text-primary">Omkrets / perimeter</div>
            <div className="infobox-text-secondary">
              {perimeter ? perimeter + " " + perimeterUnit : "---"}
            </div>
          </div>
        </div>
        <div className="infobox-text-wrapper-polygon">
          <CustomIcon
            id="polygon-icon"
            icon="hexagon-slice-6"
            color="grey"
            size={24}
          />
          <div className="infobox-text-multiple">
            <div className="infobox-text-primary">Areal</div>
            <div className="infobox-text-secondary">
              {area ? area + " " + areaUnit : "---"}
              {area && <sup>2</sup>}
            </div>
          </div>
        </div>
      </div>
      <PolygonLayers
        polygon={polygon}
        handlePolygonResults={handlePolygonResults}
      />
      <div className="detailed-info-container-polygon">
        <div className="layer-results-side">
          <ListItem id="layer-results-header">
            <ListItemIcon>
              <CustomIcon icon="layers" size={32} color="#777" padding={0} />
            </ListItemIcon>
            <ListItemText primary="Ingen resultat" />
          </ListItem>
        </div>
      </div>
    </div>
  );
};

export default PolygonInfobox;
