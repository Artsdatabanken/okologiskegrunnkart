import React from "react";
import { FilterIcon } from "../../Common/SvgIcons";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import BottomTooltip from "../../Common/BottomTooltip";

export default function Filtrering({ taglist, tagFilter, onFilterTag }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <BottomTooltip
        id="tooltip-sort-filter-button"
        placement="bottom"
        title="Filtrer"
      >
        <IconButton
          aria-controls="filter-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          <FilterIcon />
        </IconButton>
      </BottomTooltip>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        keepMounted
        variant="menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        getContentAnchorEl={null}
      >
        {taglist.map(tag => (
          <MenuItem
            id="filter-layers-menu-item"
            key={tag}
            onClick={() => {
              onFilterTag(tag, !tagFilter[tag]);
              handleClose();
            }}
            selected={tagFilter[tag]}
          >
            <ListItemIcon id="filter-layers-menu-icon">
              {tagFilter[tag] ? <DoneIcon fontSize="small" /> : <div />}
            </ListItemIcon>
            <ListItemText primary={tag} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
