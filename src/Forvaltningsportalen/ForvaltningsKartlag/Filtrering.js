import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  FilterList as SortIcon,
  SortByAlpha,
  Category,
  Business,
  Check
} from "@material-ui/icons";
import { ListSubheader, Chip, IconButton, List } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import WavesIcon from "@material-ui/icons/Waves";

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
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ float: "right" }}
      >
        <SortIcon></SortIcon>
      </IconButton>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {taglist
          .filter(tag => !tagFilter[tag])
          .map(tag => (
            <MenuItem
              key={tag}
              onClick={() => {
                onFilterTag(tag, true);
                handleClose();
              }}
            >
              <ListItemIcon>
                <WavesIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
