import React from "react";
import { FilterIcon } from "../../Common/SvgIcons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DoneIcon from "@mui/icons-material/Done";
import BottomTooltip from "../../Common/BottomTooltip";
import CustomIconButton from "../../Common/CustomIconButton";

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
      <div className="layers-icon-button-wrapper-last">
        <BottomTooltip
          id="tooltip-sort-filter-button"
          placement="bottom"
          title="Filtrer"
        >
          <CustomIconButton
            aria-controls="filter-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            <FilterIcon />
          </CustomIconButton>
        </BottomTooltip>
      </div>
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
