import React from "react";
import FilterIcon from "./FilterIcon";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";

export default function Filtrering({ taglist, tagFilter, onFilterTag }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="filter-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ float: "right" }}
      >
        <FilterIcon color="#888" />
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        keepMounted
        variant="menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {taglist.map(tag => (
          <MenuItem
            key={tag}
            onClick={() => {
              onFilterTag(tag, true);
              handleClose();
            }}
            selected={tagFilter[tag]}
          >
            <ListItemIcon>
              {tagFilter[tag] && <DoneIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={tag} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
