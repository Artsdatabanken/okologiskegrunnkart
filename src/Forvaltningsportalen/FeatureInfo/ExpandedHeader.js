import { OpenInNew } from "@material-ui/icons";
import "@material-ui/core";
import React from "react";

const ExpandedHeader = props => {
  return (
    <div className="expand_header">
      {props.url && (
        <button onClick={() => window.open(props.url)}>
          Åpne faktaark i nytt vindu <OpenInNew />
        </button>
      )}
    </div>
  );
};

export default ExpandedHeader;
