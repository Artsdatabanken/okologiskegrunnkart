import React from "react";
import Leaflet from "./Leaflet";
import AuthenticationContext from "./AuthenticationContext";

const DrmInfestedLeaflet = ({
  layer,
  latitude,
  longitude,
  onClick,
  selectedLayer
}) => {
  return (
    <AuthenticationContext.Consumer>
      {token => {
        if (!token)
          return "Waiting for valid token for DRM infected base maps...";
        return (
          <Leaflet
            layer={layer}
            selectedLayer={selectedLayer}
            zoom={4}
            latitude={latitude}
            longitude={longitude}
            token={token}
            onClick={onClick}
          />
        );
      }}
    </AuthenticationContext.Consumer>
  );
};

export default DrmInfestedLeaflet;
