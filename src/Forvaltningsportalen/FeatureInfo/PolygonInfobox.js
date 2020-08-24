import React from "react";
import { Place, Home, Flag, Terrain } from "@material-ui/icons";
import CustomTooltip from "../../Common/CustomTooltip";
import "../../style/infobox.css";
import PolygonElement from "./PolygonElement";

const ClickInfobox = ({
  coordinates_area,
  sted,
  adresse,
  polygon,
  polyline,
  showPolygon,
  hideAndShowPolygon,
  handleEditable,
  addPolygon,
  addPolyline
}) => {
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

  return (
    <div className="infobox-side">
      <h3 className="container_header">Polygon</h3>
      <PolygonElement
        polygon={polygon}
        polyline={polyline}
        showPolygon={showPolygon}
        hideAndShowPolygon={hideAndShowPolygon}
        handleEditable={handleEditable}
        addPolygon={addPolygon}
        addPolyline={addPolyline}
      />
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
              <div className="infobox-text-primary">{sted.kommunenavn[0]}</div>
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
              <div className="infobox-text-primary">{hentAdresse(adresse)}</div>
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
    </div>
  );
};

export default ClickInfobox;
