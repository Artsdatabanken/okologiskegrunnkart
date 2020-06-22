import { OpenInNew } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import React from "react";

const ExpandedHeader = props => {
  return (
    <div className="expand_header">
      {props.url && (
        <Button
          size="small"
          variant="outline"
          onClick={() => window.open(props.url)}
        >
          <OpenInNew />
        </Button>
      )}
    </div>
  );
};

export default ExpandedHeader;
