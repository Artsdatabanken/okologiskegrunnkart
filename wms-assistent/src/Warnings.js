import React from "react";
import { Chip, ListSubheader, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DoneIcon from "@material-ui/icons/Done";
import CheckIcon from "@material-ui/icons/Check";
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
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Gyldig "Capabilities" document
        </Alert>
      ) : (
        <Alert severity="error">No service in capabilities</Alert>
      )}
      {!selectCrs(caps.Capability) && (
        <Alert severity="error">Mangler brukbar projeksjon</Alert>
      )}
    </>
  );
};

const Tags = ({ tags }) => {
  return (
    <>
      <ListSubheader>Tags</ListSubheader>
      {(tags || []).map((tag) => (
        <Chip
          label={tag}
          key={tag}
          style={{ margin: 4 }}
          clickable
          color="primary"
          onDelete={() => {}}
          deleteIcon={<DoneIcon />}
          onClick={() => {}}
        />
      ))}
    </>
  );
};

export default Warnings;
