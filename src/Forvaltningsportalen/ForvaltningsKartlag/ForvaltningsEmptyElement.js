import React from "react";
import {
  ListItemIcon,
  ListItem,
  ListItemText,
  Button
} from "@material-ui/core";
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
      {/* <ListItemText primary="Ingen favoritt kartlag" />
      <Button
        id="edit-favourites-button"
        size="small"
        color="primary"
        onClick={() => {
          console.log("Edit kartlag");
        }}
      >
        Editere favoritter
      </Button> */}
    </ListItem>
  );
};

export default ForvaltningsEmptyElement;
