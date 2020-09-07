import ForvaltningsKartlag from "./ForvaltningsKartlag/ForvaltningsKartlag";
import React, { useState, useEffect } from "react";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";
import Tegnforklaring from "../Tegnforklaring/Tegnforklaring";
import { KeyboardBackspace } from "@material-ui/icons";
import CustomIcon from "../Common/CustomIcon";
import { Button } from "@material-ui/core";
import ForvaltningsDetailedInfo from "./ForvaltningsKartlag/ForvaltningsDetailedInfo";
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
  zoom,
  sublayerDetailsVisible,
  setSublayerDetailsVisible,
  legendVisible,
  setLegendVisible,
  updateIsMobile,
  handleSelectSearchResult
}) => {
  // Detail panel data
  const [underlag, setUnderlag] = useState(null);
  const [kartlagKey, setKartlagKey] = useState(null);
  const [underlagKey, setUnderlagKey] = useState(null);
  const [allCategories, setAllCategories] = useState(false);
  // Swipe kartlag panel data
  const [fullscreen, setFullscreen] = useState(null);
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [inTransition, setInTransition] = useState(null);

  const showSublayerDetails = (underlag, kartlagKey, underlagKey) => {
    if (underlag && kartlagKey && underlagKey) {
      setUnderlag(underlag);
      setKartlagKey(kartlagKey);
      setUnderlagKey(underlagKey);
      setAllCategories(false);
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
          setUnderlag(sublayer);
          setKartlagKey(kartlagKey);
          setUnderlagKey(underlagKey);
          setAllCategories(true);
          setSublayerDetailsVisible(true);
        }
      });
    } else {
      setUnderlag(null);
      setKartlagKey(kartlagKey);
      setUnderlagKey(null);
      setAllCategories(true);
      setSublayerDetailsVisible(true);
    }
  };

  const hideSublayerDetails = () => {
    setSublayerDetailsVisible(false);
    setUnderlag(null);
    setKartlagKey(null);
    setUnderlagKey(null);
    setAllCategories(false);
  };

  const showSublayerDetailsFromSearch = (underlag, kartlagKey, underlagKey) => {
    setUnderlag(underlag);
    setKartlagKey(kartlagKey);
    setUnderlagKey(underlagKey);
    removeValgtLag();
    setSublayerDetailsVisible(true);
  };

  const { isMobile } = useWindowDimensions();

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
      add: newStatus
    });

    // If there is a sublayer with all results aggregated,
    // activate aggregated sublayer and dekningskart sublayers.
    // If not, activate all sublayers.
    Object.keys(layer.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      const sublayer = layer.underlag[underlagKey];

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
          add: newStatus
        });
      }
    });
    changeVisibleSublayers(visibleSublayersArray);
  };

  const toggleAllCategoriesOn = kartlagKey => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const visibleSublayersArray = [];

    onUpdateLayerProp(kartlagKey, "erSynlig", true);
    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", true);
    const propKeys = [{ key: "allcategorieslayer.erSynlig", value: true }];
    visibleSublayersArray.push({
      layerKey: kartlagKey,
      sublayerKey: "allcategorieslayer",
      propKeys,
      add: true
    });

    Object.keys(layer.underlag).forEach(underlagKey => {
      let kode = "underlag." + underlagKey + ".";
      const sublayer = layer.underlag[underlagKey];

      // All categories visible property always updated the same way
      onUpdateLayerProp(kartlagKey, kode + "visible", true);

      if (
        sublayer.wmslayer.toLowerCase().includes("dekningskart") ||
        allcategorieslayer.wmslayer === sublayer.wmslayer
      ) {
        // Only aggregated and dekkningskart sublayers activated
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", true);
        const propKeys = [
          { key: kode + "visible", value: true },
          { key: kode + "erSynlig", value: true }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: underlagKey,
          propKeys,
          add: true
        });
      } else {
        // Pseudo active, but not really visible
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        const propKeys = [
          { key: kode + "visible", value: true },
          { key: kode + "erSynlig", value: false }
        ];
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: underlagKey,
          propKeys,
          add: true
        });
      }
    });
    changeVisibleSublayers(visibleSublayersArray);
  };

  const toggleAllCategoriesOff = (kartlagKey, underlagKey) => {
    const layer = kartlag[kartlagKey];
    const allcategorieslayer = layer.allcategorieslayer;
    const visibleSublayersArray = [];

    onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", false);
    visibleSublayersArray.push({
      layerKey: kartlagKey,
      sublayerKey: "allcategorieslayer",
      propKeys: null,
      add: false
    });

    Object.keys(layer.underlag).forEach(sublagkey => {
      let kode = "underlag." + sublagkey + ".";
      const sublayer = layer.underlag[sublagkey];
      if (
        allcategorieslayer.wmslayer === sublayer.wmslayer ||
        sublagkey === underlagKey
      ) {
        // If aggregated sublayer or selected sublayer, make inactive
        onUpdateLayerProp(kartlagKey, kode + "erSynlig", false);
        onUpdateLayerProp(kartlagKey, kode + "visible", false);
        visibleSublayersArray.push({
          layerKey: kartlagKey,
          sublayerKey: underlagKey,
          propKeys: null,
          add: false
        });
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
          sublayerKey: underlagKey,
          propKeys,
          add: true
        });
      }
    });
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
    Object.keys(layer.underlag).forEach(key => {
      const sub = layer.underlag[key];
      if (
        layer.allcategorieslayer.wmslayer !== sub.wmslayer &&
        !sub.wmslayer.toLowerCase().includes("dekningskart")
      ) {
        if (!sub.visible) numberInvisible += 1;
      }
    });

    if (
      (newVisible && numberInvisible === 1) ||
      (!newVisible && numberInvisible === 0)
    ) {
      onUpdateLayerProp(kartlagKey, "allcategorieslayer.erSynlig", newVisible);
      const propKeys = [
        { key: "allcategorieslayer.erSynlig", value: newVisible }
      ];
      visibleSublayersArray.push({
        layerKey: kartlagKey,
        sublayerKey: "allcategorieslayer",
        propKeys,
        add: newVisible
      });
    }

    const allcategories = allcategorieslayer.wmslayer;
    if (newVisible && numberInvisible === 1 && allcategories) {
      toggleAllCategoriesOn(kartlagKey);
    } else if (!newVisible && numberInvisible === 0 && allcategories) {
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
        add: newVisible
      });
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
            legendVisible || sublayerDetailsVisible || valgtLag
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
        {legendVisible && (
          <Tegnforklaring
            layers={kartlag}
            setLegendVisible={setLegendVisible}
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
              <ForvaltningsElement
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
                sublayerDetailsVisible || legendVisible
                  ? "hidden-app-content"
                  : ""
              }
            >
              <div
                className={`scroll_area${
                  fullscreen ? " side-bar-fullscreen" : ""
                }`}
              >
                <ForvaltningsKartlag
                  kartlag={kartlag}
                  toggleSublayer={toggleSublayer}
                  toggleAllSublayers={toggleAllSublayers}
                  zoom={zoom}
                  showSublayerDetails={showSublayerDetails}
                  setLegendVisible={setLegendVisible}
                />
              </div>
            </div>
            {sublayerDetailsVisible && (
              <div>
                <div className="layer-details-div">
                  <ForvaltningsDetailedInfo
                    allCategories={allCategories}
                    kartlag={kartlag[kartlagKey]}
                    underlag={underlag}
                    kartlagKey={kartlagKey}
                    underlagKey={underlagKey}
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
