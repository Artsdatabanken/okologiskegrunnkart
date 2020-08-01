import { OpenInNew } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import React from "react";

const ExpandedHeader = props => {
  return (
    <div className="expand_header">
      {props.url && (
        <Button size="small" onClick={() => window.open(props.url)}>
          <OpenInNew style={{ color: "rgba(0,0,0,0.48)" }} />
        </Button>
      )}
    </div>
  );
};

export default ExpandedHeader;
