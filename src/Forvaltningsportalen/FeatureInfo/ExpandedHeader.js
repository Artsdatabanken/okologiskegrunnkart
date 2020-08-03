import { OpenInNew } from "@material-ui/icons";
import "@material-ui/core";
import React from "react";

const ExpandedHeader = props => {
  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };
  return (
    <div className="expand_header">
      {props.url && (
        <button onClick={() => openInNewTabWithoutOpener(props.url)}>
          Åpne faktaark i nytt vindu <OpenInNew />
        </button>
      )}
    </div>
  );
};

export default ExpandedHeader;
