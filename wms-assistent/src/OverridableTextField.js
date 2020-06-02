import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import OpenInNew from "@material-ui/icons/OpenInNew";
import Edit from "@material-ui/icons/Edit";

const OverridableTextField = ({ title, dockey, doc, onUpdate }) => {
  const hasOverride = !!doc[dockey];
  if (!hasOverride) {
    return (
      <>
        {doc[dockey + "_src"]}
        <IconButton>
          <Edit></Edit>
        </IconButton>
      </>
    );
  }
  const inputProps =
    (doc[dockey] || "").indexOf("http") === 0
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <a href={doc[dockey]} target="_blank" rel="noopener noreferrer">
                <OpenInNew />
              </a>
            </InputAdornment>
          ),
        }
      : {};
  return (
    <TextField
      label={title}
      variant="filled"
      value={doc[dockey]}
      style={{ marginTop: 8, width: "100%" }}
      onChange={(e) => onUpdate(dockey, e.target.value)}
      InputProps={inputProps}
    />
  );
};

export default OverridableTextField;
