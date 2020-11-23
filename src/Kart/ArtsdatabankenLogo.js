import React, { useEffect } from "react";
import "../style/kartknapper.css";

const ArtsdatabankenLogo = ({ showSideBar, showInfobox, isMobile }) => {
  useEffect(() => {
    // If side panel or infobox are open, the logo needs to be repositioned
    const logo = document.querySelector(".artsdatabanken-logo-wrapper");
    if (!isMobile) {
      if (
        logo &&
        showSideBar &&
        logo.className.indexOf("side-bar-open") === -1
      ) {
        logo.classList.add("side-bar-open");
      } else if (
        logo &&
        !showSideBar &&
        logo.className.indexOf("side-bar-open") >= 0
      ) {
        logo.classList.remove("side-bar-open");
      }
      if (
        logo &&
        showInfobox &&
        logo.className.indexOf("infobox-open") === -1
      ) {
        logo.classList.add("infobox-open");
      } else if (
        logo &&
        !showInfobox &&
        logo.className.indexOf("infobox-open") >= 0
      ) {
        logo.classList.remove("infobox-open");
      }
    }
  }, [showSideBar, showInfobox, isMobile]);

  return (
    <div className="artsdatabanken-logo-wrapper">
      {!isMobile && (
        <img
          src="/logoer/adb_liggende.png"
          className="artsdatabanken-logo-image"
          alt="artsdatabanken-logo"
        />
      )}
      {isMobile && (
        <img
          src="/logoer/adb32.png"
          className="artsdatabanken-logo-image"
          alt="artsdatabanken-logo"
        />
      )}
    </div>
  );
};

export default ArtsdatabankenLogo;
