import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from "@material-ui/core";
import { Home, Flag, Terrain } from "@material-ui/icons";
import CustomIcon from "../../Common/CustomIcon";
import "../../style/infobox.css";
import PolygonDrawTool from "./PolygonDrawTool";
import PolygonLayers from "./PolygonLayers";
import proj4 from "proj4";
import { makeStyles } from "@material-ui/core/styles";
import PolygonElement from "./PolygonElement";
import PolygonDetailed from "./PolygonDetailed";
import { getPolygonDepth } from "../../Funksjoner/polygonTools";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%"
  }
}));

const availableLayers = [
  {
    name: "Fylker",
    selected: false,
    code: "FYL",
    icon: "terrain",
    owner: "Kartverket"
  },
  {
    name: "Kommuner",
    selected: false,
    code: "KOM",
    icon: "flag",
    owner: "Kartverket"
  }
];

const PolygonInfobox = ({
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline,
  polygonResults,
  handlePolygonResults,
  grensePolygon,
  handleGrensePolygon,
  removeGrensePolygon,
  showPolygonOptions,
  setShowPolygonOptions,
  showFylkePolygon,
  showKommunePolygon,
  showEiendomPolygon,
  grensePolygonGeom,
  grensePolygonData
}) => {
  const classes = useStyles();
  const [perimeter, setPerimeter] = useState(null);
  const [perimeterUnit, setPerimeterUnit] = useState("m");
  const [area, setArea] = useState(null);
  const [areaUnit, setAreaUnit] = useState("m");
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detailLayer, setDetailLayer] = useState(null);
  const [detailResult, setDetailResult] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);

  const polylineJSON = JSON.stringify(polyline);
  const polygonJSON = JSON.stringify(polygon);

  useEffect(() => {
    if (!polygon && !polyline) {
      setPerimeter(null);
      return;
    }

    let points = [...polyline];
    // If polygon, add the first point as the last one
    if (polygon && polygon.length > 0) {
      const depht = getPolygonDepth(polygon);
      if (depht === 2) {
        // Only one polygon
        points = [...polygon];
        points.push(polygon[0]);
      } else if (depht === 3) {
        // Only one polygon with holes
        points = [...polygon[0]];
        points.push(polygon[0][0]);
      } else {
        // Something is wrong
        setPerimeter(null);
        return;
      }
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
    if (!polygon || polygon.length === 0) {
      setArea(null);
      return;
    }

    // Calculate main area
    let points;
    let area = 0;
    const depht = getPolygonDepth(polygon);
    if (depht === 2) {
      // Only one polygon
      points = polygon;
    } else if (depht === 3) {
      // Only one polygon with holes
      points = polygon[0];
    } else {
      // Something is wrong
      setArea(null);
      return;
    }
    area = calculateArea(points);

    // Substract areas if there are holes
    if (depht === 3 && polygon.length > 1) {
      for (let i = 1; i < polygon.length; i++) {
        const hole = polygon[i];
        if (hole.length < 3) continue;
        area -= calculateArea(hole);
      }
    }

    let unit = "m";
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

  const calculateArea = points => {
    const pointsCount = points.length;
    let area = 0;
    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        const lat1 = points[i][0];
        const lng1 = points[i][1];
        const lat2 = points[(i + 1) % pointsCount][0];
        const lng2 = points[(i + 1) % pointsCount][1];

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
    return area;
  };

  const handleLoadingFeatures = loading => {
    setLoadingFeatures(loading);
  };

  const showDetailedPolygonResults = (layer, result) => {
    setShowResults(true);
    setDetailLayer(layer);
    setDetailResult(result);
  };

  const hideDetailedResults = () => {
    setShowResults(false);
    setDetailLayer(null);
    setDetailResult(null);
  };

  const grensePolygonGeomJSON = JSON.stringify(grensePolygonGeom);

  useEffect(() => {
    setShowResults(false);
  }, [grensePolygonGeom, grensePolygonGeomJSON]);

  useEffect(() => {
    if (
      grensePolygon === "fylke" &&
      grensePolygonGeom &&
      grensePolygonData &&
      grensePolygonData.fylke
    ) {
      const data = grensePolygonData.fylke;
      if (data.fylkesnavn && data.fylkesnummer) {
        const info = `${data.fylkesnavn[0]} (${data.fylkesnummer[0]})`;
        setExtraInfo(info);
      }
    } else if (
      grensePolygon === "kommune" &&
      grensePolygonGeom &&
      grensePolygonData &&
      grensePolygonData.kommune
    ) {
      const data = grensePolygonData.kommune;
      if (data.kommunenavn && data.kommunenummer) {
        const info = `${data.kommunenavn[0]} (${data.kommunenummer[0]})`;
        setExtraInfo(info);
      }
    } else if (
      grensePolygon === "eiendom" &&
      grensePolygonGeom &&
      grensePolygonData &&
      grensePolygonData.eiendom
    ) {
      setExtraInfo(grensePolygonData.eiendom);
    } else {
      setExtraInfo(null);
    }
  }, [
    grensePolygon,
    grensePolygonGeom,
    grensePolygonGeomJSON,
    grensePolygonData
  ]);

  return (
    <div className="infobox-side">
      {showResults ? (
        <PolygonDetailed
          resultLayer={detailLayer}
          detailResult={detailResult}
          hideDetailedResults={hideDetailedResults}
        />
      ) : (
        <>
          <PolygonDrawTool
            polygon={polygon}
            polyline={polyline}
            showPolygon={showPolygon}
            hideAndShowPolygon={hideAndShowPolygon}
            handleEditable={handleEditable}
            addPolygon={addPolygon}
            addPolyline={addPolyline}
            handlePolygonResults={handlePolygonResults}
            grensePolygon={grensePolygon}
            handleGrensePolygon={handleGrensePolygon}
            removeGrensePolygon={removeGrensePolygon}
            showPolygonOptions={showPolygonOptions}
            setShowPolygonOptions={setShowPolygonOptions}
            showFylkePolygon={showFylkePolygon}
            showKommunePolygon={showKommunePolygon}
            showEiendomPolygon={showEiendomPolygon}
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
                  {area ? area + " " + areaUnit + "²" : "---"}
                </div>
              </div>
            </div>
            {extraInfo && grensePolygon === "fylke" && (
              <div className="infobox-text-wrapper-polygon">
                <Terrain />
                <div className="infobox-text-multiple">
                  <div className="infobox-text-primary">Fylke</div>
                  <div className="infobox-text-secondary">
                    {extraInfo ? extraInfo : "-"}
                  </div>
                </div>
              </div>
            )}
            {extraInfo && grensePolygon === "kommune" && (
              <div className="infobox-text-wrapper-polygon">
                <Flag />
                <div className="infobox-text-multiple">
                  <div className="infobox-text-primary">Kommune</div>
                  <div className="infobox-text-secondary">
                    {extraInfo ? extraInfo : "-"}
                  </div>
                </div>
              </div>
            )}
            {extraInfo && grensePolygon === "eiendom" && (
              <div className="infobox-text-wrapper-polygon">
                <Home />
                <div className="infobox-text-multiple">
                  <div className="infobox-text-primary">Matrikkel</div>
                  <div className="infobox-text-secondary">
                    {extraInfo ? extraInfo : "-"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <PolygonLayers
            availableLayers={availableLayers}
            polygon={polygon}
            handlePolygonResults={handlePolygonResults}
            handleLoadingFeatures={handleLoadingFeatures}
          />
          {polygon && (loadingFeatures || polygonResults) && (
            <div className="detailed-info-container-polygon">
              <div className="layer-results-side">
                <ListItem id="layer-results-header">
                  <ListItemIcon>
                    <CustomIcon
                      icon="layers"
                      size={32}
                      color="#777"
                      padding={0}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Valgte arealrapporter" />
                </ListItem>
                <div className="layer-results-scrollable-side">
                  {loadingFeatures && (
                    <div className={classes.root}>
                      <LinearProgress color="primary" />
                    </div>
                  )}
                  <List id="layers-results-list">
                    {polygonResults &&
                      Object.keys(polygonResults).map(key => {
                        return (
                          <PolygonElement
                            polygonLayer={availableLayers.find(
                              item => item.code === key
                            )}
                            key={key}
                            result={polygonResults[key]}
                            showDetailedPolygonResults={
                              showDetailedPolygonResults
                            }
                            grensePolygon={grensePolygon}
                          />
                        );
                      })}
                  </List>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PolygonInfobox;
