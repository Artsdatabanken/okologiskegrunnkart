import React from "react";
import { withRouter } from "react-router-dom";
import GeneriskElement from "./GeneriskElement";
import "../../style/infobox.css";

const DetailedInfo = ({
  showExtensiveInfo,
  kartlag,
  coordinates_area,
  onUpdateLayerProp,
  layersResult
}) => {
  if (!coordinates_area.lat) return null;
  return Object.keys(layersResult || {}).map(key => {
    return (
      <GeneriskElement
        onUpdateLayerProp={onUpdateLayerProp}
        coordinates_area={coordinates_area}
        key={key}
        kartlag={kartlag}
        resultat={layersResult[key]}
        element={key}
      />
    );
  });
};

export default withRouter(DetailedInfo);
