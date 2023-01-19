import React, { useState, useEffect } from "react";
import { MyLocation } from "@mui/icons-material";
import CustomTooltip from "../../Common/CustomTooltip";
import "../../style/infobox.css";
import ClickInfobox from "./ClickInfobox";
import PolygonInfobox from "./PolygonInfobox";
import CustomIcon from "../../Common/CustomIcon";
import Tegnforklaring from "../../Tegnforklaring/Tegnforklaring";

const InfoBox = ({
  markerType,
  coordinates_area,
  getBackendData,
  showInfobox,
  handleInfobox,
  showFullscreenInfobox,
  handleFullscreenInfobox,
  layersResult,
  allLayersResult,
  valgteLag,
  sted,
  adresse,
  matrikkel,
  elevation,
  resultat,
  kartlag,
  showExtensiveInfo,
  loadingFeatures,
  isMobile,
  infoboxDetailsVisible,
  setInfoboxDetailsVisible,
  polygonDetailsVisible,
  setPolygonDetailsVisible,
  setLayerInfoboxDetails,
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline,
  polygonResults,
  handlePolygonResults,
  sortKey,
  tagFilter,
  matchAllFilters,
  showEiendomGeom,
  handlePropertyGeom,
  showFylkeGeom,
  handleFylkeGeom,
  showKommuneGeom,
  handleKommuneGeom,
  grensePolygon,
  grensePolygonGeom,
  handleGrensePolygon,
  removeGrensePolygon,
  showFylkePolygon,
  showKommunePolygon,
  showEiendomPolygon,
  grensePolygonData,
  legendVisible,
  setLegendVisible,
  legendPosition,
  uploadPolygonFile,
  handlePolygonSaveModal,
  getSavedPolygons
}) => {
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [inTransition, setInTransition] = useState(null);
  const [showMarkerOptions, setShowMarkerOptions] = useState(true);
  const [showPolygonOptions, setShowPolygonOptions] = useState(true);
  const [loadingAreaReport, setLoadingAreaReport] = useState(false);

  useEffect(() => {
    if (DY < 0 && Y !== 0) {
      if (!showFullscreenInfobox && !showInfobox) {
        handleFullscreenInfobox(false);
        handleInfobox(true);
      } else if (showInfobox) {
        handleFullscreenInfobox(true);
        handleInfobox(false);
      }
      setY(0);
    } else if (DY > 0 && Y !== 0) {
      if (showFullscreenInfobox) {
        handleFullscreenInfobox(false);
        handleInfobox(true);
      } else if (showInfobox) {
        handleFullscreenInfobox(false);
        handleInfobox(false);
      }
      setY(0);
    }
  }, [
    Y,
    DY,
    screenHeight,
    showFullscreenInfobox,
    showInfobox,
    handleFullscreenInfobox,
    handleInfobox
  ]);

  useEffect(() => {
    const box = document.querySelector(".infobox-container-side");
    if (inTransition === "finished" && !showFullscreenInfobox) {
      box.classList.toggle("kartlag-hidden", true);
      setInTransition(null);
    }
  }, [inTransition, showFullscreenInfobox]);

  useEffect(() => {
    if (!isMobile) return;

    let y0 = 0;
    let disp = 0;
    let locked = false;

    const header = document.querySelector(".infobox-title-wrapper");
    const box = document.querySelector(".infobox-container-side");

    if (!header || !box) return;

    function lock(e) {
      if (
        e.changedTouches &&
        e.changedTouches.length > 0 &&
        e.changedTouches[0].clientY
      ) {
        locked = true;
        setScreenHeight(window.innerHeight);
        y0 = e.changedTouches[0].clientY;
        header.classList.toggle("swiper-animation", !locked);
        box.classList.toggle("infobox-animation", !locked);
      }
    }

    function drag(e) {
      e.preventDefault();
      if (locked) {
        disp = -Math.round(e.changedTouches[0].clientY - y0);
        box.style.setProperty("--h", disp + "px");
      }
    }

    function move(e) {
      if (locked) {
        locked = false;
        const dy = e.changedTouches[0].clientY - y0;
        setDY(dy);
        setY(y0);
        disp = 0;
        box.classList.toggle("infobox-animation", !locked);
        box.style.setProperty("--h", 0 + "px");
      }
    }

    header.addEventListener("touchstart", lock, false);
    header.addEventListener("touchend", move, false);
    header.addEventListener("touchmove", drag, false);

    return () => {
      header.removeEventListener("touchstart", lock, false);
      header.removeEventListener("touchend", move, false);
      header.addEventListener("touchmove", drag, false);
    };
  }, [isMobile]);

  return (
    <div
      className={`infobox-container-side infobox-animation${
        showInfobox
          ? " infobox-open"
          : showFullscreenInfobox
          ? " infobox-fullscreen"
          : ""
      }`}
    >
      <div className="infobox-title-wrapper">
        {isMobile && (
          <button
            id="infobox-drag-icon"
            variant="contained"
            size="small"
            tabIndex="-1"
            onClick={() => {
              handleFullscreenInfobox(!showFullscreenInfobox);
              handleInfobox(!showInfobox);
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon="drag-horizontal"
              color="#fff"
              size={30}
            />
          </button>
        )}
        <div className="infobox-title-content">
          {markerType === "klikk" && (
            <>
              <CustomTooltip placement="right" title="Sted / Områdetype">
                <MyLocation />
              </CustomTooltip>
              <div className="infobox-title-text">
                <div className="infobox-title-text-primary">
                  {`${sted ? sted.komplettskrivemåte[0] : "-"}`}
                </div>
                <div className="infobox-title-text-secondary">
                  {`${sted ? sted.navneobjekttype : "-"}`}
                </div>
              </div>
            </>
          )}
          {markerType === "polygon" && (
            <>
              <CustomIcon
                id="polygon-icon"
                icon="hexagon-slice-4"
                color="#fff"
                size={24}
              />
              <div className="infobox-title-text">
                <div className="infobox-title-text-primary">Mitt Polygon</div>
              </div>
            </>
          )}
        </div>
        <button
          tabIndex="0"
          className="close-infobox-button-wrapper"
          onClick={() => {
            handleInfobox(false);
            handleFullscreenInfobox(false);
          }}
        >
          <div className="close-infobox-button">
            <CustomIcon
              id="infobox-minimize"
              icon="chevron-doble-left"
              color="#fff"
              size={24}
            />
          </div>
        </button>
      </div>
      {legendVisible && legendPosition === "left" ? (
        <Tegnforklaring
          layers={kartlag}
          setLegendVisible={setLegendVisible}
          legendPosition={legendPosition}
        />
      ) : (
        <>
          {markerType === "klikk" && (
            <ClickInfobox
              coordinates_area={coordinates_area}
              getBackendData={getBackendData}
              layersResult={layersResult}
              allLayersResult={allLayersResult}
              valgteLag={valgteLag}
              sted={sted}
              adresse={adresse}
              matrikkel={matrikkel}
              elevation={elevation}
              resultat={resultat}
              kartlag={kartlag}
              showExtensiveInfo={showExtensiveInfo}
              loadingFeatures={loadingFeatures}
              infoboxDetailsVisible={infoboxDetailsVisible}
              setInfoboxDetailsVisible={setInfoboxDetailsVisible}
              setLayerInfoboxDetails={setLayerInfoboxDetails}
              sortKey={sortKey}
              tagFilter={tagFilter}
              matchAllFilters={matchAllFilters}
              showEiendomGeom={showEiendomGeom}
              handlePropertyGeom={handlePropertyGeom}
              showFylkeGeom={showFylkeGeom}
              handleFylkeGeom={handleFylkeGeom}
              showKommuneGeom={showKommuneGeom}
              handleKommuneGeom={handleKommuneGeom}
              showMarkerOptions={showMarkerOptions}
              setShowMarkerOptions={setShowMarkerOptions}
            />
          )}
          {markerType === "polygon" && (
            <PolygonInfobox
              polygon={grensePolygon === "none" ? polygon : grensePolygonGeom}
              polyline={polyline}
              showPolygon={showPolygon}
              hideAndShowPolygon={hideAndShowPolygon}
              handleEditable={handleEditable}
              addPolygon={addPolygon}
              addPolyline={addPolyline}
              polygonResults={polygonResults}
              handlePolygonResults={handlePolygonResults}
              grensePolygon={grensePolygon}
              handleGrensePolygon={handleGrensePolygon}
              removeGrensePolygon={removeGrensePolygon}
              showPolygonOptions={showPolygonOptions}
              setShowPolygonOptions={setShowPolygonOptions}
              showFylkePolygon={showFylkePolygon}
              showKommunePolygon={showKommunePolygon}
              showEiendomPolygon={showEiendomPolygon}
              grensePolygonGeom={grensePolygonGeom}
              grensePolygonData={grensePolygonData}
              uploadPolygonFile={uploadPolygonFile}
              handlePolygonSaveModal={handlePolygonSaveModal}
              getSavedPolygons={getSavedPolygons}
              polygonDetailsVisible={polygonDetailsVisible}
              setPolygonDetailsVisible={setPolygonDetailsVisible}
              loadingAreaReport={loadingAreaReport}
              setLoadingAreaReport={setLoadingAreaReport}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InfoBox;
