import React from "react";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import OpenInNew from "@material-ui/icons/OpenInNew";

const TextField2 = ({ title, dockey, doc, onUpdate, icon, onIconClick }) => {
  const value = doc[dockey];
  const showIcon = (value || "").indexOf("http") === 0 || icon;
  const inputProps = showIcon
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onIconClick}>
              {icon ? (
                icon
              ) : (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  <OpenInNew />
                </a>
              )}
            </IconButton>
          </InputAdornment>
        ),
      }
    : {};
  return (
    <div style={{ paddingTop: 8 }}>
      <TextField3
        title={title}
        value={value}
        onUpdate={onUpdate}
        dockey={dockey}
        inputProps={inputProps}
      />
    </div>
  );
};

const TextField3 = ({ title, value, onUpdate, dockey, inputProps }) => (
  <TextField
    label={title}
    variant="outlined"
    multiline
    value={value || ""}
    style={{ marginTop: 8, width: "100%" }}
    onChange={(e) => onUpdate(dockey, e.target.value)}
    InputProps={inputProps}
  />
);

export default TextField2;
