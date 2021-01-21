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
import { makeStyles } from "@material-ui/core/styles";
import PolygonElement from "./PolygonElement";
import PolygonDetailed from "./PolygonDetailed";
import {
  getPolygonDepth,
  calculatePerimeter,
  calculateArea
} from "../../Funksjoner/polygonTools";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%"
  }
}));

const availableLayers = [
  {
    name: "Fylker",
    selected: false,
    disabled: false,
    slow: false,
    code: "FYL",
    icon: "terrain",
    owner: "Kartverket"
  },
  {
    name: "Kommuner",
    selected: false,
    disabled: false,
    slow: false,
    code: "KOM",
    icon: "flag",
    owner: "Kartverket"
  },
  {
    name: "Eiendommer",
    selected: false,
    disabled: false,
    code: "MAT",
    icon: "home",
    owner: "Kartverket"
  },
  {
    name: "Arter Nasjonal Forvaltningsinteresse",
    selected: false,
    disabled: false,
    slow: false,
    code: "ANF",
    icon: "Arter",
    owner: "Miljødirektoratet"
  },
  {
    name: "Breer i Norge",
    selected: false,
    disabled: false,
    slow: false,
    code: "BRE",
    icon: "Geologi",
    owner: "Norges vassdrags- og energidirektorat"
  },
  // {
  //   name: "Elvenett Elvis",
  //   selected: false,
  //   disabled: false,
  //   slow: false,
  //   code: "ELV",
  //   icon: "Ferskvann",
  //   owner: "Norges vassdrags- og energidirektorat"
  // },
  {
    name: "Naturtyper - DN Håndbook 13",
    selected: false,
    disabled: false,
    slow: false,
    code: "N13",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  {
    name: "Naturtyper - DN Håndbook 19",
    selected: false,
    disabled: false,
    slow: false,
    code: "NMA",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  {
    name: "Naturtyper - NiN Mdir",
    selected: false,
    disabled: false,
    slow: false,
    code: "NIN",
    icon: "Naturtyper",
    owner: "Miljødirektoratet"
  },
  {
    name: "Naturvernområder",
    selected: false,
    disabled: false,
    slow: false,
    code: "VRN",
    icon: "Administrative støttekart",
    owner: "Miljødirektoratet"
  },
  {
    name: "Innsjødatabase",
    selected: false,
    disabled: false,
    slow: false,
    code: "ISJ",
    icon: "Ferskvann",
    owner: "Norges vassdrags- og energidirektorat"
  },
  {
    name: "Vannkraft - Magasin",
    selected: false,
    disabled: false,
    slow: false,
    code: "MAG",
    icon: "Ferskvann",
    owner: "Miljødirektoratet"
  },
  // {
  //   name: "Flomsoner",
  //   selected: false,
  //   disabled: false
  //   slow: false,
  //   code: "FLO",
  //   icon: "Ferskvann",
  //   owner: "Norges vassdrags- og energidirektorat"
  // }
  {
    name: "Verneplan for Vassdrag",
    selected: false,
    disabled: false,
    slow: false,
    code: "VVS",
    icon: "Ferskvann",
    owner: "Norges vassdrags- og energidirektorat"
  }
];

const resultsOrder = availableLayers.map(item => item.code);

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
  grensePolygonData,
  uploadPolygonFile,
  handlePolygonSaveModal,
  getSavedPolygons,
  polygonDetailsVisible,
  setPolygonDetailsVisible
}) => {
  const classes = useStyles();
  const [perimeter, setPerimeter] = useState(null);
  const [perimeterUnit, setPerimeterUnit] = useState("m");
  const [area, setArea] = useState(null);
  const [areaUnit, setAreaUnit] = useState("m");
  const [totalArea, setTotalArea] = useState(null);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
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

    let dist = 0;
    let points;
    // If polygon, add the first point as the last one
    if (polygon && polygon.length > 0) {
      const depth = getPolygonDepth(polygon);
      if (depth === 2) {
        // Only one polygon
        points = [...polygon];
        points.push(polygon[0]);
        dist += calculatePerimeter(points);
      } else if (depth === 3) {
        // Only one polygon with holes
        points = [...polygon[0]];
        points.push(polygon[0][0]);
        dist += calculatePerimeter(points);
      } else if (depth === 4) {
        // Multipolygon
        for (const poly of polygon) {
          points = [...poly[0]];
          points.push(poly[0][0]);
          dist += calculatePerimeter(points);
        }
      } else {
        // Something is wrong
        setPerimeter(null);
        return;
      }
    } else if (polyline) {
      points = [...polyline];
      dist += calculatePerimeter(points);
    }

    if (points.length < 2) {
      setPerimeter(null);
      return;
    }

    let unit = "m";
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
      setTotalArea(null);
      return;
    }

    // Calculate main area
    let points;
    let area = 0;
    const depth = getPolygonDepth(polygon);
    if (depth === 2) {
      // Only one polygon
      points = polygon;
      area += calculateArea(points);
    } else if (depth === 3) {
      // Polygon with holes. Substract areas if there are holes
      points = polygon[0];
      area += calculateArea(points);
      if (polygon.length > 1) {
        for (let i = 1; i < polygon.length; i++) {
          const hole = polygon[i];
          if (hole.length < 3) continue;
          area -= calculateArea(hole);
        }
      }
    } else if (depth === 4) {
      // Multipolygon. Substract areas if there are holes
      for (const poly of polygon) {
        points = poly[0];
        area += calculateArea(points);
        if (poly.length > 1) {
          for (let i = 1; i < poly.length; i++) {
            const hole = poly[i];
            if (hole.length < 3) continue;
            area -= calculateArea(hole);
          }
        }
      }
    } else {
      // Something is wrong
      setArea(null);
      setTotalArea(null);
      return;
    }

    setTotalArea(area / 1000000);
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

  const handleLoadingFeatures = loading => {
    setLoadingFeatures(loading);
  };

  const showDetailedPolygonResults = (layer, result) => {
    setPolygonDetailsVisible(true);
    setDetailLayer(layer);
    setDetailResult(result);
  };

  const hideDetailedResults = () => {
    setPolygonDetailsVisible(false);
    setDetailLayer(null);
    setDetailResult(null);
  };

  const grensePolygonGeomJSON = JSON.stringify(grensePolygonGeom);

  useEffect(() => {
    setPolygonDetailsVisible(false);
  }, [grensePolygonGeom, grensePolygonGeomJSON, setPolygonDetailsVisible]);

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
      {polygonDetailsVisible ? (
        <PolygonDetailed
          resultLayer={detailLayer}
          detailResult={detailResult}
          hideDetailedResults={hideDetailedResults}
          totalArea={totalArea}
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
            uploadPolygonFile={uploadPolygonFile}
            handlePolygonSaveModal={handlePolygonSaveModal}
            getSavedPolygons={getSavedPolygons}
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
            grensePolygon={grensePolygon}
            availableLayers={availableLayers}
            polygon={polygon}
            handlePolygonResults={handlePolygonResults}
            handleLoadingFeatures={handleLoadingFeatures}
          />
          {polygon && (loadingFeatures || polygonResults) && (
            <div className="detailed-info-container-polygon">
              <div className="layer-results-side">
                <ListItem id="polygon-results-header">
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
                      <LinearProgress
                        id="polygon-area-report-progress"
                        color="primary"
                      />
                    </div>
                  )}
                  <List id="layers-results-list">
                    {polygonResults &&
                      resultsOrder.map(key => {
                        // If layer has not been selected in infobox, we get undefined
                        if (polygonResults[key] === undefined) return null;
                        // If layer has been selected but there is no data, we get null
                        // and it is shown as a list item with no results
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
