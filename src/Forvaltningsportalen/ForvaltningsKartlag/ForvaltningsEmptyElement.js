import React from "react";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";
import CustomIcon from "../../Common/CustomIcon";

const ForvaltningsEmptyElement = ({ kartlag }) => {
  return (
    <ListItem id="layer-list-item">
      <ListItemIcon>
        <div className="layer-list-element-icon">
          <CustomIcon
            id="kartlag"
            icon="playlist-remove"
            size={24}
            padding={0}
            color="#666"
          />
        </div>
      </ListItemIcon>
      <ListItemText
        primary="Ingen favoritt kartlag"
        secondary="Editer favoritter i hovedmenyen ved søkbar"
      />
    </ListItem>
  );
};

export default ForvaltningsEmptyElement;
