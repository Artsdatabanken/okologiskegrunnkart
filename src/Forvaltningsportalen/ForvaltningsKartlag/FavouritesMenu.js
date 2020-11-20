import React from "react";
import { Sort as SortIcon } from "@material-ui/icons";
import { IconButton, Paper } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import BottomTooltip from "../../Common/BottomTooltip";
import { AllLayersIcon, FavouriteLayesIcon } from "../../Common/SvgIcons";

export default function FavouritesMenu({
  showFavoriteLayers,
  toggleShowFavoriteLayers,
  sort,
  onChangeSort
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = sortkey => {
    onChangeSort(sortkey);
    handleClose();
  };

  const sorteringsmåter = {
    alfabetisk: "Alfabetisk",
    dataeier: "Dataeier",
    tema: "Tema"
  };

  return (
    <>
      <BottomTooltip
        id="tooltip-sort-filter-button"
        placement="bottom"
        title="Sortere"
      >
        <IconButton
          aria-controls="favourites-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          {showFavoriteLayers ? <FavouriteLayesIcon /> : <AllLayersIcon />}
        </IconButton>
      </BottomTooltip>
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
          {Object.keys(sorteringsmåter).map(måte => (
            <MenuItem
              id="sort-layers-menu-item"
              key={måte}
              onClick={() => handleSelect(måte)}
              selected={måte === sort}
            >
              <ListItemText primary={sorteringsmåter[måte]} />
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </>
  );
}
