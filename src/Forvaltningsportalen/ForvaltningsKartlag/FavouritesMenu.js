import React from "react";
import { Paper, ListItemIcon } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import BottomTooltip from "../../Common/BottomTooltip";
import { AllLayersIcon, FavouriteLayesIcon } from "../../Common/SvgIcons";
import CustomIconButton from "../../Common/CustomIconButton";

export default function FavouritesMenu({
  showFavoriteLayers,
  toggleShowFavoriteLayers
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="layers-icon-button-wrapper">
        <BottomTooltip
          id="tooltip-sort-filter-button"
          placement="bottom"
          title="Favoritter"
        >
          <CustomIconButton
            aria-controls="favourites-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            {showFavoriteLayers ? <FavouriteLayesIcon /> : <AllLayersIcon />}
          </CustomIconButton>
        </BottomTooltip>
      </div>
      <Paper elevation={3}>
        <Menu
          id="favourites-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          variant="menu"
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
          <MenuItem
            id="favourites-layers-menu-item"
            onClick={() => {
              toggleShowFavoriteLayers(true);
              handleClose();
            }}
            selected={showFavoriteLayers}
            tabIndex={0}
          >
            <ListItemIcon id="favourites-item-icon">
              <FavouriteLayesIcon />
            </ListItemIcon>
            <ListItemText primary="Vis favoritt kartlag" />
          </MenuItem>

          <MenuItem
            id="favourites-layers-menu-item"
            onClick={() => {
              toggleShowFavoriteLayers(false);
              handleClose();
            }}
            selected={!showFavoriteLayers}
            tabIndex={0}
          >
            <ListItemIcon id="favourites-item-icon">
              <AllLayersIcon />
            </ListItemIcon>
            <ListItemText primary="Vis fullstendig kartlag" />
          </MenuItem>
        </Menu>
      </Paper>
    </>
  );
}
