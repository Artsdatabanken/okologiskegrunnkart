import React from "react";
import { CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { selectCrs } from "./wms";

const Warnings = ({ doc }) => {
  const caps = doc.wms_capabilities;
  if (!caps || !caps.status)
    return (
      <Alert severity="warning">
        Laster ned WMS capabilities XML... <CircularProgress size={24} />
      </Alert>
    );
  const { Service } = caps;
  return (
    <>
      {caps.status !== 200 && (
        <Alert severity="error">
          {caps.status}: {caps.statusText}
        </Alert>
      )}
      {Service && Service.Title ? (
        <>
          {!selectCrs(caps.Capability) && (
            <Alert severity="error">Mangler brukbar projeksjon</Alert>
          )}
        </>
      ) : (
        <Alert severity="error">No service in capabilities</Alert>
      )}
    </>
  );
};

export default Warnings;
