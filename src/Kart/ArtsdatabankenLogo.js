import React from "react";
import "../style/leaflet.css";
import "leaflet/dist/leaflet.css";

const ArtsdatabankenLogo = ({ showSideBar, showInfobox, isMobile }) => {
  return (
    <div className="artsdatabanken-logo-wrapper">
      <img
        src="/logoer/adb32.png"
        className="artsdatabanken-logo-image"
        alt="artsdatabanken-logo"
      />
      <div className="artsdatabanken-logo-primary-text">ARTSDATA</div>
      <div className="artsdatabanken-logo-secondary-text">BANKEN</div>
    </div>
  );
};

export default ArtsdatabankenLogo;
