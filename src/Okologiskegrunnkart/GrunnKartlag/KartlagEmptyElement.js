import React from "react";
import { ListItemIcon, ListItem, ListItemText } from "@mui/material";
import CustomIcon from "../../Common/CustomIcon";

const KartlagEmptyElement = ({ kartlag }) => {
  return (
    <ListItem id="layer-list-item">
      <ListItemIcon>
        <div className="layer-list-element-icon">
          <CustomIcon
            id="kartlag"
            icon="playlist-remove"
            size={30}
            padding={0}
            color="#005a71"
          />
        </div>
      </ListItemIcon>
      <ListItemText
        primary="Ingen favorittkartlag"
        secondary="Editer favoritter i hovedmenyen ved søkefeltet"
      />
    </ListItem>
  );
};

export default KartlagEmptyElement;
