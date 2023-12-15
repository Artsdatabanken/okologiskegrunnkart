/*
Code By MS Made for Artskart jan. 2022
Tweaked by HEM + prettier-atom, jan. 2022
This is a first draft until new guidelines and better rig is in place.
*/

import React, { useState } from "react";
import { Close } from "@mui/icons-material";
const CookieWarning = ({ isSideBarOpen }) => {
  const cookieString = "cookieWarning=closed";
  const getConsentCookie = () => {
    return document.cookie.split(";").find(el => {
      return el.trim() === cookieString;
    });
  };
  const [cookieConsent, setCookieConsent] = useState(getConsentCookie());
  const [readMore, setReadMore] = useState(false);
  const close = () => {
    let expires = new Date();
    expires.setFullYear(new Date().getFullYear() + 1);
    const cookie = `${cookieString}; expires=${expires.toUTCString()}`;
    document.cookie = cookie;
    setCookieConsent(cookieString);
  };
  const expandReadMore = () => {
    setReadMore(!readMore);
  };

  const text =
    "Applikasjonen benytter lokal lagring på din maskin (cookies) for å sikre god dataflyt. Kun du har tilgang på disse opplysningene.";
  return cookieConsent?.trim() !== cookieString ? (
    <div
      className={`cookie-warning${
        readMore ? " cookie-warning-read-more" : ""
      } ${isSideBarOpen ? "cookie-warning-side-bar-open" : ""}`}
    >
      <div className="normal-warning">
        <span>{text}</span>
        <div className="normal-warning-buttons">
          <button className="secondary" onClick={expandReadMore} name="les mer">
            {readMore ? <span>Les mindre</span> : <span>Les mer </span>}
          </button>
          <button className="primary" onClick={close} name="lukk varsel">
            OK
          </button>
        </div>
      </div>
      {readMore && (
        <div className="readmore-box">
          <button
            className="close-button"
            onClick={expandReadMore}
            name="les mer"
          >
            <Close />
          </button>
          <h2>Datalagring</h2>
          <p>
            Lagrede data deles ikke, hverken med Artsdatabanken eller
            tredjepart. All lokal lagring brukes utelukkende for å forbedre
            brukeropplevelsen.
          </p>
          <h3>Oppstart</h3>
          <p>
            Ved oppstart blir kartlagene lastet inn og lagret under "Indexed
            DB", på din maskin. Navnene som benyttes er "GrunnkartDB" og
            "__dbnames".
          </p>
          <p>
            Formålet med lagringen er at brukeren skal ha mulighet til å lagre
            sine favorittkartlag og polygoner, slik at de finnes til senere.
          </p>

          <h3>Brukerlagring av preferanser</h3>
          <p>
            Hvis du redigerer listen over favorittlag vil dette endres som et
            felt i listen "layers" eller "sublayers" under "GrunnkartDB".
            Selvtegnede polygon lagres ikke før du benytter "lagre"-knappen, og
            da lagres det under mappen "polygons" under "GrunnkartDB."
          </p>
          <h3>Informasjonskapsel for å huske samtykke</h3>
          <p>
            For å slippe å se informasjonsboksen om datalagring igjen, kan du
            trykke på OK-knappen. Da settes en Informasjonskapsel kalt
            "cookieWarning" med ett års varighet som husker dette.
          </p>
        </div>
      )}
    </div>
  ) : null;
};

export default CookieWarning;
