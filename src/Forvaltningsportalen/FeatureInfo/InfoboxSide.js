import React, { useState, useEffect } from "react";
import {
  Close,
  MyLocation,
  Place,
  Home,
  Flag,
  Terrain
} from "@material-ui/icons";
import CustomTooltip from "../../Common/CustomTooltip";
import CustomSwitch from "../../Common/CustomSwitch";
import "../../style/infobox.css";
import DetailedInfo from "./DetailedInfo";
import CustomIcon from "../../Common/CustomIcon";

const InfoBox = ({
  coordinates_area,
  layerevent,
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
  resultat,
  kartlag,
  showExtensiveInfo,
  handleExtensiveInfo,
  loadingFeatures,
  isMobile
}) => {
  const [Y, setY] = useState(0);
  const [DY, setDY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [inTransition, setInTransition] = useState(null);

  const latitude = coordinates_area ? coordinates_area.lat : 0;
  const longitude = coordinates_area ? coordinates_area.lng : 0;
  const coords = `${Math.round(latitude * 10000) / 10000}° N  ${Math.round(
    longitude * 10000
  ) / 10000}° Ø`;

  // Kommune kommer når ting er slått sammen, bruker ikke tid på det før da.
  const hentAdresse = adresse => {
    if (adresse && adresse.adressetekst) {
      return adresse.adressetekst;
    }
    return "-";
  };

  const hentGardsnummer = adresse => {
    if (adresse && adresse.gardsnummer) {
      return adresse.gardsnummer;
    }
    return "-";
  };

  const hentBruksnummer = adresse => {
    if (adresse && adresse.bruksnummer) {
      return adresse.bruksnummer;
    }
    return "-";
  };

  const toggleAllLayers = () => {
    getBackendData(coordinates_area.lng, coordinates_area.lat, layerevent);
  };

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
        </div>
        <button
          tabIndex="0"
          className="close-infobox-button-wrapper"
          onClick={() => {
            handleInfobox(false);
            handleFullscreenInfobox(false);
            // handleExtensiveInfo(false);
          }}
        >
          <div className="close-infobox-button">
            <Close />
          </div>
        </button>
      </div>
      <div className="infobox-side">
        {sted && (
          <div className="infobox-content">
            <div className="infobox-text-wrapper">
              <CustomTooltip placement="right" title="Fylke / Fylkesnr.">
                <Terrain />
              </CustomTooltip>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">{sted.fylkesnavn[0]}</div>
                <div className="infobox-text-secondary">
                  {sted.fylkesnummer[0]}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <CustomTooltip placement="right" title="Kommune / Kommunenr.">
                <Flag />
              </CustomTooltip>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">
                  {sted.kommunenavn[0]}
                </div>
                <div className="infobox-text-secondary">
                  {sted.kommunenummer[0]}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <CustomTooltip
                placement="right"
                title="Adresse / Gårdsnr. / Bruksnr."
              >
                <Home />
              </CustomTooltip>
              <div className="infobox-text-multiple">
                <div className="infobox-text-primary">
                  {hentAdresse(adresse)}
                </div>
                <div className="infobox-text-secondary">
                  {`${hentGardsnummer(adresse)}/${hentBruksnummer(adresse)}`}
                </div>
              </div>
            </div>
            <div className="infobox-text-wrapper">
              <CustomTooltip placement="right" title="Koordinater">
                <Place />
              </CustomTooltip>
              <div className="infobox-text-primary">
                {coordinates_area ? coords : "--° N --° Ø"}
              </div>
            </div>
          </div>
        )}
        <div className="search-layers-button-wrapper">
          <span className="infobox-switch-text">Valgte kartlag</span>
          <CustomSwitch
            tabIndex="0"
            id="search-layers-toggle"
            checked={showExtensiveInfo}
            onChange={toggleAllLayers}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                toggleAllLayers();
              }
            }}
          />
          <span className="infobox-switch-text">Alle kartlag</span>
        </div>
        <DetailedInfo
          showExtensiveInfo={showExtensiveInfo}
          kartlag={showExtensiveInfo ? kartlag : valgteLag}
          coordinates_area={coordinates_area}
          layersResult={showExtensiveInfo ? allLayersResult : layersResult}
          resultat={resultat}
          loadingFeatures={loadingFeatures}
        />
      </div>
    </div>
  );
};

export default InfoBox;
