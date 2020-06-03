import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

export default function TjenesteType({ title, dockey, doc, onUpdate }) {
  return (
    <FormControl style={{ marginTop: 8, width: "100%" }}>
      <InputLabel style={{ paddingLeft: 16 }} id="type-select-label">
        Datakilde type
      </InputLabel>
      <Select
        style={{ paddingLeft: 8 }}
        labelId="type-select-label"
        label={title}
        id="type-select"
        value={doc[dockey]}
        onChange={(e) => {
          onUpdate(dockey, e.target.value);
        }}
      >
        <MenuItem value="wms">WMS Kartlag</MenuItem>
        <MenuItem value="api">API</MenuItem>
      </Select>
    </FormControl>
  );
}
