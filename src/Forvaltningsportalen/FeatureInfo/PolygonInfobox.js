import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";
import "../../style/infobox.css";
import PolygonDrawTool from "./PolygonDrawTool";

const PolygonInfobox = ({
  sted,
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline
}) => {
  const calculateDistance = (lat1, lat2, lng1, lng2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const dist = R * c; // in metres

    return dist;
  };

  const calculatePerimeter = () => {
    if (!polygon && !polyline) return null;

    let points = polygon;
    if (!polygon) points = polyline;

    if (points.length < 2) return null;

    let dist = 0;
    let unit = "m";

    for (let i = 1; i < points.length; i++) {
      const lat1 = points[i - 1][0];
      const lat2 = points[i][0];
      const lng1 = points[i - 1][1];
      const lng2 = points[i][1];
      dist += calculateDistance(lat1, lat2, lng1, lng2);
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

    return { dist, unit };
  };

  const calculateArea = () => {
    if (!polygon || polygon.length < 3) return null;

    const pointsCount = polygon.length;
    let area = 0.0;
    const d2r = Math.PI / 180;
    let unit = "m";

    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        const lat1 = polygon[i][0];
        const lat2 = polygon[(i + 1) % pointsCount][0];
        const lng1 = polygon[i][1];
        const lng2 = polygon[(i + 1) % pointsCount][1];
        area +=
          (lng2 - lng1) *
          d2r *
          (2 + Math.sin(lat1 * d2r) + Math.sin(lat2 * d2r));
      }
      area = (area * 6378137.0 * 6378137.0) / 2.0;
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

    return { area, unit };
  };

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
            <div className="infobox-text-primary">Perimeter / Lengde</div>
            <div className="infobox-text-secondary">
              {calculatePerimeter()
                ? calculatePerimeter().dist + " " + calculatePerimeter().unit
                : "---"}
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
              {/* {sted ? sted.kommunenummer[0] + " km" : "---"} */}
              {calculateArea()
                ? calculateArea().area + " " + calculateArea().unit
                : "---"}
              {calculateArea() && <sup>2</sup>}
            </div>
          </div>
        </div>
      </div>

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
