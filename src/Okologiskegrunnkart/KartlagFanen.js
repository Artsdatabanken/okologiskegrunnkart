import GrunnKartlag from "./GrunnKartlag/GrunnKartlag";
import React, { useState, useEffect } from "react";
import "../style/kartlagfane.css";
import KartlagElement from "./GrunnKartlag/KartlagElement";
import Tegnforklaring from "../Tegnforklaring/Tegnforklaring";
import { KeyboardBackspace } from "@material-ui/icons";
import CustomIcon from "../Common/CustomIcon";
import { Button } from "@material-ui/core";
import KartlagDetailedInfo from "./GrunnKartlag/KartlagDetailedInfo";
import useWindowDimensions from "../Funksjoner/useWindowDimensions";

const KartlagFanen = ({
  searchResultPage,
  removeValgtLag,
  valgtLag,
  onUpdateLayerProp,
  changeVisibleSublayers,
  kartlag,
  showSideBar,
  handleSideBar,
  sublayerDetailsVisible,
  setSublayerDetailsVisible,
  legendVisible,
  setLegendVisible,
  legendPosition,
  handleLegendPosition,
  updateIsMobile,
  updateWindowHeight,
  handleSelectSearchResult,
  handleSortKey,
  handleTagFilter,
  handleMatchAllFilters,
  showFavoriteLayers,
  toggleShowFavoriteLayers
}) => {
  // Detail panel data
  const [underlagDetails, setUnderlagDetails] = useState(null);
  const [kartlagKeyDetails, setKartlagKeyDetails] = useState(null);
  const [underlagKeyDetails, setUnderlagKeyDetails] = useState(null);
  const [allCategoriesDetails, setAllCategoriesDetails] = useState(false);
  // Swipe kartlag panel data
  const [fullscreen, setFullscreen] = useState(null);
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [inTransition, setInTransition] = useState(null);

  const showSublayerDetails = (underlag, kartlagKey, underlagKey) => {
    if (underlag && kartlagKey && underlagKey) {
      setUnderlagDetails(underlag);
      setKartlagKeyDetails(kartlagKey);
      setUnderlagKeyDetails(underlagKey);
      setAllCategoriesDetails(false);
      setSublayerDetailsVisible(true);
      return;
    }
    // In this case, this is "All categories" sublayer.
    // Underlag is actually the layer (kartlag).
    const layer = underlag;
    if (layer && layer.aggregatedwmslayer) {
      Object.keys(layer.underlag).forEach(underlagKey => {
        const sublayer = layer.underlag[underlagKey];
        if (sublayer.wmslayer === layer.aggregatedwmslayer) {
          setUnderlagDetails(sublayer);
          setKartlagKeyDetails(kartlagKey);
          setUnderlagKeyDetails(underlagKey);
          setAllCategoriesDetails(true);
          setSublayerDetailsVisible(true);
        }
      });
    } else {
      setUnderlagDetails(null);
      setKartlagKeyDetails(kartlagKey);
      setUnderlagKeyDetails(null);
      setAllCategoriesDetails(true);
      setSublayerDetailsVisible(true);
    }
  };

  const hideSublayerDetails = () => {
    setSublayerDetailsVisible(false);
    setUnderlagDetails(null);
    setKartlagKeyDetails(null);
    setUnderlagKeyDetails(null);
    setAllCategoriesDetails(false);
  };

  const showSublayerDetailsFromSearch = (underlag, kartlagKey, underlagKey) => {
    setUnderlagDetails(underlag);
    setKartlagKeyDetails(kartlagKey);
    setUnderlagKeyDetails(underlagKey);
    removeValgtLag();
    setSublayerDetailsVisible(true);
  };

  const { isMobile, height } = useWindowDimensions();

  const toggleSideBarVisible = async () => {
    if (window.innerWidth > 768) {
      const kartlag = document.querySelector(".kartlag_fanen");
      kartlag.classList.toggle("kartlag-hidden", false);
      setInTransition("moving");
    }
  };

  const toggleSideBar = () => {
    if (fullscreen) {
      handleSideBar(true);
    } else if (showSideBar) {
      handleSideBar(false);
    } else {
      handleSideBar(true);
    }
    setFullscreen(false);
  };

  const toggleAllSublayers = kartlagKey => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const newStatus = !allcategorieslayer.erSynlig;
    const visibleSublayersArray = [];

    onUpdateLayerProp(kartlagKey, "erSynlig", newStatus);
    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newStatus);
    const propKeys = [{ key: "allcategorieslayer.erSynlig", value: newStatus }];
    visibleSublayersArray.push({
      layerKey: kartlagKey,
      sublayerKey: "allcategorieslayer",
      propKeys,
      key: layer.allcategorieslayer.key || null,
      add: newStatus
    });

    // If there is a sublayer with all results aggregated,
    // activate aggregated sublayer and dekningskart sublayers.
    // If not, activate all sublayers.
    Object.keys(layer.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      const sublayer = layer.underlag[underlagKey];
      const key = sublayer.key;

      // All categories visible property always updated the same way
      onUpdateLayerProp(kartlagKey, kode + "visible", newStatus);

      if (allcategorieslayer.wmslayer) {
        if (newStatus) {
          // NewStatus = true. Activate only aggregated sublayer and dekkningskart.
          // The rest are only pseudo-active (green switch but no HTTP request)
          if (
            sublayer.wmslayer.toLowerCase().includes("dekningskart") ||
            allcategorieslayer.wmslayer === sublayer.wmslayer
          ) {
            // Only aggregated and dekkningskart sublayers activated
            onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
            const propKeys = [
              { key: kode + "visible", value: newStatus },
              { key: kode + "erSynlig", value: newStatus }
            ];
            visibleSublayersArray.push({
              layerKey: kartlagKey,
              sublayerKey: underlagKey,
              propKeys,
              key,
              add: newStatus
            });
          } else {
            // Pseudo active, but not really visible
            onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
            const propKeys = [
              { key: kode + "visible", value: newStatus },
              { key: kode + "erSynlig", value: false }
            ];
            visibleSublayersArray.push({
              layerKey: kartlagKey,
              sublayerKey: underlagKey,
              propKeys,
              key,
              add: true
            });
          }
        } else {
          // NewStatus = false. All sublayers inactive
          onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
          const propKeys = [
            { key: kode + "visible", value: newStatus },
            { key: kode + "erSynlig", value: newStatus }
          ];
          visibleSublayersArray.push({
            layerKey: kartlagKey,
            sublayerKey: underlagKey,
            propKeys,
            key,
            add: newStatus
          });
        }
      } else {
        let kode = "underlag." + underlagKey + ".";
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", newStatus);
        const propKeys = [
          { key: kode + "visible", value: newStatus },
          { key: kode + "erSynlig", value: newStatus }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: underlagKey,
          propKeys,
          key,
          add: newStatus
        });
      }
    });
    onUpdateLayerProp(kartlagKey, null, newStatus, true);
    changeVisibleSublayers(visibleSublayersArray);
  };

  const toggleAllCategoriesOn = (kartlagKey, underlagKey) => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const visibleSublayersArray = [];
    let aggregatedkey = null;

    const propKeys = [{ key: "allcategorieslayer.erSynlig", value: true }];
    visibleSublayersArray.push({
      layerKey: kartlagKey,
      sublayerKey: "allcategorieslayer",
      propKeys,
      key: layer.allcategorieslayer.key || null,
      add: true
    });

    onUpdateLayerProp(kartlagKey, "erSynlig", true);

    Object.keys(layer.underlag).forEach(sublagkey => {
      let kode = "underlag." + sublagkey + ".";
      const sublayer = layer.underlag[sublagkey];
      const key = sublayer.key;
      if (allcategorieslayer.wmslayer === sublayer.wmslayer) {
        // Only aggregated sublayers activated
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", true);
        onUpdateLayerProp(kartlagKey, kode + "visible", true);
        const propKeys = [
          { key: kode + "visible", value: true },
          { key: kode + "erSynlig", value: true }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: sublagkey,
          propKeys,
          key,
          add: true
        });
        aggregatedkey = sublagkey;
      } else if (!sublayer.wmslayer.toLowerCase().includes("dekningskart")) {
        // Pseudo active, but not really visible.
        // Only if not dekningskart sublayer
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        onUpdateLayerProp(kartlagKey, kode + "visible", true);
        const propKeys = [
          { key: kode + "visible", value: true },
          { key: kode + "erSynlig", value: false }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: sublagkey,
          propKeys,
          key,
          add: true
        });
      }
    });
    onUpdateLayerProp(kartlagKey, aggregatedkey, true, true);
    changeVisibleSublayers(visibleSublayersArray);
  };

  const toggleAllCategoriesOff = (kartlagKey, underlagKey) => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const visibleSublayersArray = [];
    let aggregatedkey = null;

    visibleSublayersArray.push({
      layerKey: kartlagKey,
      sublayerKey: "allcategorieslayer",
      propKeys: null,
      key: layer.allcategorieslayer.key || null,
      add: false
    });

    Object.keys(layer.underlag).forEach(sublagkey => {
      let kode = "underlag." + sublagkey + ".";
      const sublayer = layer.underlag[sublagkey];
      const key = sublayer.key;
      if (
        allcategorieslayer.wmslayer === sublayer.wmslayer ||
        sublagkey === underlagKey
      ) {
        // If aggregated sublayer or selected sublayer, make inactive
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        onUpdateLayerProp(kartlagKey, kode + "visible", false);
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: sublagkey,
          propKeys: null,
          key,
          add: false
        });
        if (allcategorieslayer.wmslayer === sublayer.wmslayer) {
          aggregatedkey = sublagkey;
        }
      } else if (!sublayer.wmslayer.toLowerCase().includes("dekningskart")) {
        // The rest of sublayers (if not dekkningskart), activate
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", true);
        onUpdateLayerProp(kartlagKey, kode + "visible", true);
        const propKeys = [
          { key: kode + "visible", value: true },
          { key: kode + "erSynlig", value: true }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: sublagkey,
          propKeys,
          key,
          add: true
        });
      }
    });
    onUpdateLayerProp(kartlagKey, aggregatedkey, false, true);
    changeVisibleSublayers(visibleSublayersArray);
  };

  const toggleSublayer = (
    kartlagKey,
    underlagKey,
    kode,
    newStatus,
    newVisible
  ) => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const visibleSublayersArray = [];
    let numberInvisible = 0;
    let totalInvisible = 0;

    // Check if all sublayers are visible or not
    Object.keys(layer.underlag).forEach(key => {
      const sub = layer.underlag[key];
      if (
        layer.allcategorieslayer.wmslayer !== sub.wmslayer &&
        !sub.wmslayer.toLowerCase().includes("dekningskart")
      ) {
        if (!sub.visible) numberInvisible += 1;
      }
      if (layer.allcategorieslayer.wmslayer !== sub.wmslayer) {
        if (!sub.visible) totalInvisible += 1;
      }
    });

    if (
      (newVisible && totalInvisible === 1) ||
      (!newVisible && totalInvisible === 0)
    ) {
      onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newVisible);
      const propKeys = [
        { key: "allcategorieslayer.erSynlig", value: newVisible }
      ];
      visibleSublayersArray.push({
        layerKey: kartlagKey,
        sublayerKey: "allcategorieslayer",
        propKeys,
        key: layer.allcategorieslayer.key || null,
        add: newVisible
      });
    }

    // Modify sublayer properties
    const allcategories = allcategorieslayer.wmslayer;
    const sublayer = layer.underlag[underlagKey];
    const key = sublayer.key;
    if (
      newVisible &&
      numberInvisible === 1 &&
      allcategories &&
      !sublayer.wmslayer.toLowerCase().includes("dekningskart")
    ) {
      toggleAllCategoriesOn(kartlagKey, underlagKey);
    } else if (
      !newVisible &&
      numberInvisible === 0 &&
      allcategories &&
      !sublayer.wmslayer.toLowerCase().includes("dekningskart")
    ) {
      toggleAllCategoriesOff(kartlagKey, underlagKey);
    } else {
      onUpdateLayerProp(kartlagKey, kode + "erSynlig", newVisible);
      onUpdateLayerProp(kartlagKey, kode + "visible", newVisible);
      const propKeys = [
        { key: kode + "visible", value: newVisible },
        { key: kode + "erSynlig", value: newVisible }
      ];
      visibleSublayersArray.push({
        layerKey: kartlagKey,
        sublayerKey: underlagKey,
        propKeys,
        key,
        add: newVisible
      });
      onUpdateLayerProp(kartlagKey, null, newVisible, true);
      changeVisibleSublayers(visibleSublayersArray);
    }
  };

  useEffect(() => {
    if (DY < 0 && Y !== 0) {
      if (Math.abs(DY) > screenHeight * 0.4) {
        handleSideBar(false);
        setFullscreen(true);
      } else if (!showSideBar && !fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(true);
      }
      setY(0);
    } else if (DY > 0 && Y !== 0) {
      if (Math.abs(DY) > screenHeight * 0.6 - 50) {
        handleSideBar(false);
        setFullscreen(false);
      } else if (fullscreen) {
        handleSideBar(true);
        setFullscreen(false);
      } else if (showSideBar) {
        handleSideBar(false);
        setFullscreen(false);
      }
      setY(0);
    }
  }, [Y, DY, screenHeight, showSideBar, fullscreen, handleSideBar]);

  useEffect(() => {
    const kartlag = document.querySelector(".kartlag_fanen");
    if (inTransition === "finished" && !showSideBar) {
      kartlag.classList.toggle("kartlag-hidden", true);
      setInTransition(null);
    }
  }, [inTransition, showSideBar]);

  useEffect(() => {
    updateIsMobile(isMobile);
  }, [isMobile, updateIsMobile]);

  useEffect(() => {
    updateWindowHeight(height);
  }, [height, updateWindowHeight]);

  useEffect(() => {
    if (!isMobile) return;

    let y0 = 0;
    let disp = 0;
    let locked = false;

    const kartlagSlider = document.querySelector(".toggle-kartlag-wrapper");
    const kartlag = document.querySelector(".kartlag_fanen");

    if (!kartlagSlider || !kartlag) return;

    function lock(e) {
      if (
        e.changedTouches &&
        e.changedTouches.length > 0 &&
        e.changedTouches[0].clientY
      ) {
        locked = true;
        setScreenHeight(window.innerHeight);
        y0 = e.changedTouches[0].clientY;
        kartlagSlider.classList.toggle("swiper-animation", !locked);
        kartlag.classList.toggle("kartlag-animation", !locked);
      }
    }

    function drag(e) {
      e.preventDefault();
      if (locked) {
        disp = -Math.round(e.changedTouches[0].clientY - y0);
        kartlagSlider.style.setProperty("--h", disp + "px");
        kartlag.style.setProperty("--h", disp + "px");
      }
    }

    function move(e) {
      if (locked) {
        locked = false;
        const dy = e.changedTouches[0].clientY - y0;
        setDY(dy);
        setY(y0);
        disp = 0;
        kartlagSlider.classList.toggle("swiper-animation", !locked);
        kartlagSlider.style.setProperty("--h", 0 + "px");
        kartlag.classList.toggle("kartlag-animation", !locked);
        kartlag.style.setProperty("--h", 0 + "px");
      }
    }

    kartlagSlider.addEventListener("touchstart", lock, false);
    kartlagSlider.addEventListener("touchend", move, false);
    kartlagSlider.addEventListener("touchmove", drag, false);

    return () => {
      kartlagSlider.removeEventListener("touchstart", lock, false);
      kartlagSlider.removeEventListener("touchend", move, false);
      kartlagSlider.addEventListener("touchmove", drag, false);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const toggleButton = document.querySelector(".toggle-side-bar-wrapper");
    if (!toggleButton) return;

    function hide(e) {
      if (
        e.srcElement.className &&
        e.srcElement.className.includes("toggle-side-bar-wrapper") &&
        e.propertyName === "right"
      ) {
        setInTransition("finished");
      }
    }

    toggleButton.addEventListener("transitionend", hide, false);

    return () => {
      toggleButton.removeEventListener("transitionend", hide, false);
    };
  }, [isMobile]);

  return (
    <>
      {!isMobile && (
        <div
          className={`toggle-side-bar-wrapper right-animation${
            showSideBar ? " side-bar-open" : ""
          }`}
        >
          <Button
            id="toggle-side-bar-button"
            variant="contained"
            size="small"
            onClick={() => {
              toggleSideBarVisible();
              setTimeout(function() {
                toggleSideBar();
                handleSelectSearchResult(false);
              }, 25);
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon={showSideBar ? "chevron-doble-right" : "chevron-doble-left"}
              size={24}
              color="#555"
            />
          </Button>
        </div>
      )}
      {isMobile && (
        <div
          className={`toggle-kartlag-wrapper swiper-animation${
            fullscreen
              ? " side-bar-fullscreen"
              : showSideBar
              ? " side-bar-open"
              : ""
          }${
            (legendVisible && legendPosition === "right") ||
            sublayerDetailsVisible ||
            valgtLag
              ? " popup-visible"
              : ""
          }`}
        >
          <button
            id="toggle-kartlag-button"
            variant="contained"
            size="small"
            tabIndex="-1"
            onClick={() => {
              toggleSideBar();
            }}
          >
            <CustomIcon
              id="show-layers-icon"
              icon="drag-horizontal"
              color="#666"
              size={30}
            />
          </button>
        </div>
      )}
      <div
        className={`kartlag_fanen kartlag-animation${
          fullscreen
            ? " side-bar-fullscreen"
            : showSideBar
            ? " side-bar-open"
            : ""
        }`}
      >
        {legendVisible && legendPosition === "right" && (
          <Tegnforklaring
            layers={kartlag}
            setLegendVisible={setLegendVisible}
            legendPosition={legendPosition}
          />
        )}
        {searchResultPage ? (
          <></>
        ) : valgtLag ? (
          <div className="valgtLag">
            <button
              className="listheadingbutton"
              onClick={e => {
                removeValgtLag();
              }}
            >
              <span className="listheadingbutton-icon">
                <KeyboardBackspace />
              </span>
              <span className="listheadingbutton-text">Valgt lag</span>
            </button>
            <div
              className={`scroll_area${
                fullscreen ? " side-bar-fullscreen" : ""
              }`}
            >
              <KartlagElement
                valgt={true}
                kartlagKey={valgtLag.id}
                kartlag={valgtLag}
                key={valgtLag.id}
                toggleSublayer={toggleSublayer}
                toggleAllSublayers={toggleAllSublayers}
                showSublayerDetails={showSublayerDetailsFromSearch}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                sublayerDetailsVisible ||
                (legendVisible && legendPosition === "right")
                  ? "hidden-app-content"
                  : ""
              }
            >
              <div
                className={`scroll_area${
                  fullscreen ? " side-bar-fullscreen" : ""
                }`}
              >
                <GrunnKartlag
                  kartlag={kartlag}
                  toggleSublayer={toggleSublayer}
                  toggleAllSublayers={toggleAllSublayers}
                  showSublayerDetails={showSublayerDetails}
                  legendVisible={legendVisible}
                  setLegendVisible={setLegendVisible}
                  legendPosition={legendPosition}
                  handleLegendPosition={handleLegendPosition}
                  handleSortKey={handleSortKey}
                  handleTagFilter={handleTagFilter}
                  handleMatchAllFilters={handleMatchAllFilters}
                  isMobile={isMobile}
                  showFavoriteLayers={showFavoriteLayers}
                  toggleShowFavoriteLayers={toggleShowFavoriteLayers}
                />
              </div>
            </div>
            {sublayerDetailsVisible && (
              <div>
                <div className="layer-details-div">
                  <KartlagDetailedInfo
                    allCategories={allCategoriesDetails}
                    kartlag={kartlag[kartlagKeyDetails]}
                    underlag={underlagDetails}
                    kartlagKey={kartlagKeyDetails}
                    underlagKey={underlagKeyDetails}
                    toggleSublayer={toggleSublayer}
                    toggleAllSublayers={toggleAllSublayers}
                    onUpdateLayerProp={onUpdateLayerProp}
                    hideSublayerDetails={hideSublayerDetails}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default KartlagFanen;
