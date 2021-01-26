import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  ListItem,
  ListItemText,
  Collapse
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import "../../style/infobox.css";
import { getPolygonDepth, calculateArea } from "../../Funksjoner/polygonTools";
import { getTextAreaReport } from "../../Funksjoner/translateAreaReport";
import CustomIcon from "../../Common/CustomIcon";
import CustomTooltip from "../../Common/CustomTooltip";
import { animateScroll } from "react-scroll";

const PolygonLayers = ({
  grensePolygon,
  availableLayers,
  polygon,
  handlePolygonResults,
  handleLoadingAreaReport,
  makeAreaReport,
  controller,
  setController
}) => {
  const [searchLayers, setSearchLayers] = useState(availableLayers);
  const [menuOpen, setMenuOpen] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [disabledButton, setDisabledButton] = useState(false);
  const [complexPolygon, setComplexPolygon] = useState(false);
  const [polygonArea, setPolygonArea] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showMatrikkelWarning, setShowMatrikkelWarning] = useState(false);

  const polygonJSON = JSON.stringify(polygon);

  const calculateAreaReport = async () => {
    if (controller !== null) {
      handlePolygonResults(null);
      await controller.abort();
      setController(null);
    }

    if (!polygon || polygon.length === 0) return;
    handlePolygonResults(null);
    const layerCodes = [];
    let errorResult = {};
    for (const layer of searchLayers) {
      if (!layer.selected || !layer.code) continue;
      if (grensePolygon === "fylke" && ["MAT", "ISJ"].includes(layer.code)) {
        continue;
      }
      layerCodes.push(layer.code);
      errorResult[layer.code] = { error: true };
    }
    if (layerCodes.length > 0) {
      const depth = getPolygonDepth(polygon);
      let wkt;
      if (depth === 2) {
        let points = "";
        for (const coord of polygon) {
          points = points + coord[1] + " " + coord[0] + ",";
        }
        // Last point has to be the same as the initial point
        points = points + polygon[0][1] + " " + polygon[0][0];
        points = "((" + points + "))";
        wkt = `SRID=4326;POLYGON ${points}`;
      } else if (depth === 3) {
        let points = "";
        for (const poly of polygon) {
          points = points + "(";
          for (const coord of poly) {
            points = points + coord[1] + " " + coord[0] + ",";
          }
          // Remove last comma
          points = points.slice(0, -1);
          points = points + "),";
        }
        // Remove last comma
        points = points.slice(0, -1);
        points = "(" + points + ")";
        wkt = `SRID=4326;POLYGON ${points}`;
      } else if (depth === 4) {
        let points = "";
        for (const multi of polygon) {
          points = points + "(";
          for (const poly of multi) {
            points = points + "(";
            for (const coord of poly) {
              points = points + coord[1] + " " + coord[0] + ",";
            }
            // Remove last comma
            points = points.slice(0, -1);
            points = points + "),";
          }
          // Remove last comma
          points = points.slice(0, -1);
          points = points + "),";
        }
        // Remove last comma
        points = points.slice(0, -1);
        points = "(" + points + ")";
        wkt = `SRID=4326;MULTIPOLYGON ${points}`;
      } else {
        handlePolygonResults(errorResult);
        return;
      }
      sendAreaReportRequests(layerCodes, wkt);
    }
  };

  const sendAreaReportRequests = (layerCodes, wkt) => {
    // Get slow, medium and fast layer codes
    const layerCodesSlow = [];
    let errorResultSlow = {};
    const layerCodesMedium = [];
    let errorResultMedium = {};
    const layerCodesFast = [];
    let errorResultFast = {};
    for (const layerCode of layerCodes) {
      if (["MAT", "ISJ"].includes(layerCode)) {
        layerCodesSlow.push(layerCode);
        errorResultSlow[layerCode] = { error: true };
      } else if (
        ["FYL", "KOM", "BRE", "VRN", "ISJ", "MAG", "VVS"].includes(layerCode)
      ) {
        layerCodesFast.push(layerCode);
        errorResultFast[layerCode] = { error: true };
      } else {
        layerCodesMedium.push(layerCode);
        errorResultMedium[layerCode] = { error: true };
      }
    }

    const abortController = new AbortController();
    setController(abortController);

    const requestFast = layerCodesFast.length > 0 ? 1 : 0;
    const requestMedium = layerCodesMedium.length > 0 ? 1 : 0;
    const requestSlow = layerCodesSlow.length > 0 ? 1 : 0;
    const numberRequests = requestFast + requestMedium + requestSlow;

    handlePolygonResults(null);
    handleLoadingAreaReport(true);

    setTimeout(() => {
      animateScroll.scrollToBottom({
        containerId: "infobox-side"
      });
    }, 100);

    let requestCount = 0;
    const t0 = performance.now();
    if (layerCodesFast.length > 0) {
      makeAreaReport(layerCodesFast, wkt, abortController).then(result => {
        if (!result) {
          handlePolygonResults(errorResultFast);
        } else if (result !== "AbortError") {
          sortAndHandlePolygonResults(result);
        }
        const t1 = performance.now();
        if (t1 - t0 < 1500) {
          animateScroll.scrollToBottom({
            containerId: "infobox-side"
          });
        }
        requestCount += 1;
        if (requestCount === numberRequests) {
          handleLoadingAreaReport(false);
          setController(null);
        }
      });
    }
    if (layerCodesMedium.length > 0) {
      makeAreaReport(layerCodesMedium, wkt, abortController).then(result => {
        if (!result) {
          handlePolygonResults(errorResultMedium);
        } else if (result !== "AbortError") {
          sortAndHandlePolygonResults(result);
        }
        requestCount += 1;
        if (requestCount === numberRequests) {
          handleLoadingAreaReport(false);
          setController(null);
        }
      });
    }
    if (layerCodesSlow.length > 0) {
      makeAreaReport(layerCodesSlow, wkt, abortController).then(result => {
        if (!result) {
          handlePolygonResults(errorResultSlow);
        } else if (result !== "AbortError") {
          sortAndHandlePolygonResults(result);
        }
        requestCount += 1;
        if (requestCount === numberRequests) {
          handleLoadingAreaReport(false);
          setController(null);
        }
      });
    }
  };

  const sortAndHandlePolygonResults = result => {
    let extendedResult = {};
    for (const code in result) {
      const detailResult = result[code];
      if (!detailResult || !Array.isArray(detailResult)) {
        extendedResult[code] = detailResult;
        continue;
      }
      let sorted = detailResult.sort((a, b) => {
        return b.km2 - a.km2;
      });
      if (code === "MAT") {
        sorted = sorted.map(item => {
          return {
            ...item,
            navn: item.kode,
            kode: ""
          };
        });
      }
      if (code === "BRE") {
        sorted = sorted.map(item => {
          let name =
            item.navn === "" || item.navn === " " || item.navn === "null"
              ? null
              : item.navn;
          return {
            ...item,
            navn: name,
            kode: item.kode
          };
        });
      }
      if (code === "N13") {
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
            ),
            expandable: true
          };
        });
      }
      if (code === "NMA") {
        sorted = sorted.map(item => {
          const desc =
            getTextAreaReport("NMA", item.kode, "name") +
            ". " +
            getTextAreaReport("NMA", item.kode, "description");
          return {
            ...item,
            navn: item.navn,
            kode: item.kode,
            beskrivelse: desc,
            expandable: true
          };
        });
      }
      if (code === "NIN") {
        sorted = sorted.map(item => {
          let name = item.navn;
          name = name ? name.charAt(0).toUpperCase() + name.slice(1) : "N/A";
          return {
            ...item,
            navn: name,
            kode: null,
            beskrivelse: getTextAreaReport("NIN", item.kode, "code")
          };
        });
      }
      if (code === "ANF") {
        sorted = sorted.map(item => {
          let name = item.navn;
          name = name ? name.charAt(0).toUpperCase() + name.slice(1) : "N/A";
          return {
            ...item,
            navn: name,
            kode: item.kode
            // beskrivelse: getTextAreaReport("ANF", item.kode, "description")
          };
        });
      }
      if (code === "MAG") {
        sorted = sorted.map(item => {
          return {
            ...item,
            navn: item.navn,
            kode: item.kode,
            beskrivelse: getTextAreaReport("MAG", item.kode, "code")
          };
        });
      }
      extendedResult[code] = sorted;
    }
    handlePolygonResults(extendedResult);
  };

  const handleChange = (e, selectedLayerName) => {
    let layers = [...searchLayers];
    for (let layer of layers) {
      if (layer.name === selectedLayerName) {
        layer.selected = e.target.checked;
      }
    }
    setSearchLayers(layers);
  };

  // Disable area report
  useEffect(() => {
    if (!polygon) {
      setDisabled(true);
      return;
    }
    const depth = getPolygonDepth(polygon);
    if (depth === 2 && polygon.length > 2) setDisabled(false);
    else if (depth === 3 && polygon[0].length > 2) setDisabled(false);
    else if (depth === 4 && polygon[0][0].length > 2) setDisabled(false);
    else setDisabled(true);
  }, [polygon, polygonJSON]);

  // Calculate if polygon is complex
  useEffect(() => {
    if (!polygon) {
      setComplexPolygon(false);
      return;
    }

    // Check polygon complexity
    const limit = 5000;
    const depth = getPolygonDepth(polygon);
    if (depth === 2 && polygon.length > 2) {
      if (polygon.length > limit) {
        setComplexPolygon(true);
        return;
      }
    } else if (depth === 3 && polygon[0].length > 2) {
      for (const poly of polygon) {
        if (poly.length > limit) {
          setComplexPolygon(true);
          return;
        }
      }
    } else if (depth === 4 && polygon[0][0].length > 2) {
      for (const multipoly of polygon) {
        for (const poly of multipoly) {
          if (poly.length > limit) {
            setComplexPolygon(true);
            return;
          }
        }
      }
    }
  }, [polygon, polygonJSON]);

  // Calculate polygon area
  useEffect(() => {
    if (!polygon) {
      setPolygonArea(0);
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
    }

    area = area / 1000000;
    setPolygonArea(area);
  }, [polygon, polygonJSON]);

  // Update disabled layers and set icon for slow ones
  useEffect(() => {
    if (!searchLayers) {
      setDisabledButton(true);
      setShowWarning(false);
      setShowMatrikkelWarning(false);
      return;
    }

    // Get current layers, before changes
    const originalLayers = JSON.stringify(searchLayers);

    // Update layers
    let slow = false;
    let manyProperties = false;
    let reportSelected = false;
    let layers = [...searchLayers];
    for (let layer of layers) {
      // Disable layers
      if (grensePolygon === "fylke" && ["MAT", "ISJ"].includes(layer.code)) {
        layer.disabled = true;
      } else {
        layer.disabled = false;
      }

      // Mark many properties (eiendommer)
      if (layer.code === "MAT" && layer.selected) {
        if (grensePolygon === "kommune") manyProperties = true;
        else if (grensePolygon === "none" && polygonArea > 2000)
          manyProperties = true;
      }

      // Mark as slow
      if (
        grensePolygon === "fylke" &&
        ["ANF", "N13", "NMA", "NIN"].includes(layer.code)
      ) {
        layer.slow = true;
        if (!slow && layer.selected) slow = true;
      } else if (
        grensePolygon === "kommune" &&
        ["MAT", "ISJ"].includes(layer.code)
      ) {
        layer.slow = true;
        if (!slow && layer.selected) slow = true;
      } else if (
        grensePolygon === "none" &&
        complexPolygon &&
        polygonArea > 5000 &&
        ["MAT", "ISJ"].includes(layer.code)
      ) {
        layer.slow = true;
        if (!slow && layer.selected) slow = true;
      } else if (
        grensePolygon === "none" &&
        polygonArea > 20000 &&
        ["MAT", "ISJ"].includes(layer.code)
      ) {
        layer.slow = true;
        if (!slow && layer.selected) slow = true;
      } else {
        layer.slow = false;
      }

      // Disable button if not reports are selected
      if (!reportSelected) {
        if (
          grensePolygon === "fylke" &&
          !["MAT", "ISJ"].includes(layer.code) &&
          layer.selected
        )
          reportSelected = true;
        else if (grensePolygon !== "fylke" && layer.selected)
          reportSelected = true;
      }
    }

    setDisabledButton(!reportSelected);
    setShowWarning(slow);
    setShowMatrikkelWarning(manyProperties);

    // Set layers only if somethign has changed
    const updatedLayers = JSON.stringify(layers);
    if (originalLayers !== updatedLayers) {
      setSearchLayers(layers);
    }
  }, [searchLayers, grensePolygon, complexPolygon, polygonArea]);

  return (
    <div
      className={
        menuOpen ? "polygon-layers-wrapper expanded" : "polygon-layers-wrapper"
      }
    >
      <ListItem
        id={disabled ? "polygon-layer-disabled" : "polygon-layer-expander"}
        button
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <ListItemText
          primary={
            disabled ? "Arealrapport (polygon ikke definert)" : "Arealrapport"
          }
        />
        {menuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse
        id="polygon-layers-collapse"
        in={menuOpen}
        timeout="auto"
        unmountOnExit
      >
        <div className="polygon-layers-content">
          <div className="polygon-checkbox-content">
            {searchLayers.map((layer, index) => {
              return (
                <div key={index} className="polygon-layers-item">
                  <div
                    className={
                      disabled || layer.disabled
                        ? "polygon-layers-name-disabled"
                        : "polygon-layers-name"
                    }
                  >
                    <div className="polygon-layers-name-text">{layer.name}</div>
                    {!disabled && layer.slow && (
                      <CustomTooltip
                        placement="right"
                        title="Datalaget kan ta flere minutter å prosessere"
                      >
                        <span>
                          <CustomIcon
                            id="polygon-report-warning-icon"
                            icon="clock-alert-outline"
                            size={16}
                            padding={2}
                            color="#697f8a"
                          />
                        </span>
                      </CustomTooltip>
                    )}
                  </div>
                  <Checkbox
                    id={`select-layers-checkbox-${layer.code.toLowerCase()}`}
                    checked={layer.selected}
                    onChange={e => handleChange(e, layer.name)}
                    color="default"
                    disabled={disabled || layer.disabled}
                  />
                </div>
              );
            })}
          </div>
          <div className="polygon-button-wrapper">
            <Button
              id="polygon-run-button"
              variant="contained"
              size="small"
              onClick={() => {
                calculateAreaReport();
              }}
              disabled={disabled || disabledButton}
            >
              Lag arealrapport
            </Button>
          </div>
          <Collapse
            id="polygon-layers-warning-collapse"
            in={!disabled && showWarning}
            timeout="auto"
            unmountOnExit
          >
            <div className="polygon-report-warning">
              <div className="polygon-report-warning-content">
                <CustomIcon
                  id="polygon-report-warning-icon"
                  icon="clock-alert"
                  size={24}
                  color="#697f8a"
                />
                <span className="polygon-report-warning-text">
                  Arealrapport kan ta flere minutter for store, komplekse
                  polygoner og de valgte rapporter
                </span>
              </div>
            </div>
          </Collapse>
          <Collapse
            id="polygon-layers-warning-collapse"
            in={!disabled && showMatrikkelWarning}
            timeout="auto"
            unmountOnExit
          >
            <div className="polygon-report-warning">
              <div className="polygon-report-warning-content">
                <CustomIcon
                  id="polygon-report-warning-icon"
                  icon="home-group"
                  size={24}
                  color="#697f8a"
                />
                <span className="polygon-report-warning-text">
                  Eiendommer kan gi svært mange treff i store polygoner
                </span>
              </div>
            </div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
};

export default PolygonLayers;
