import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";
import "../../style/infobox.css";
import PolygonElement from "./PolygonElement";
import CustomSwitch from "../../Common/CustomSwitch";

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
  addPolyline,
  showExtensiveInfo
}) => {
  return (
    <div className="infobox-side">
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
          <div className="infobox-text-wrapper-polygon">
            <CustomIcon
              id="polygon-icon"
              icon="hexagon-outline"
              color="grey"
              size={24}
            />
            <div className="infobox-text-multiple">
              <div className="infobox-text-primary">Perimeter / Lengde</div>
              <div className="infobox-text-secondary">
                {sted.fylkesnummer[0] + " km"}
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
                {sted.kommunenummer[0] + " km"}
                <sup>2</sup>
              </div>
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
          onChange={() => console.log("Clicked")}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              console.log("Clicked");
            }
          }}
        />
        <span className="infobox-switch-text">Alle kartlag</span>
      </div>

      <div className="detailed-info-container-side">
        <div className="layer-results-side">
          <ListItem id="layer-results-header">
            <ListItemIcon>
              <CustomIcon icon="layers" size={32} color="#777" padding={0} />
            </ListItemIcon>
            <ListItemText primary="Ingen resultat" />
          </ListItem>
        </div>
      </div>
    </div>
  );
};

export default ClickInfobox;
