import React from "react";
import "../style/appname.css";
import { Snackbar } from "@material-ui/core";

const AppName = ({ showAppName, closeAppName }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      open={showAppName}
      onClose={e => closeAppName()}
      severity
    >
      <div className="app-name-wrapper">Økologiske grunnkart</div>
    </Snackbar>
  );
};

export default AppName;
