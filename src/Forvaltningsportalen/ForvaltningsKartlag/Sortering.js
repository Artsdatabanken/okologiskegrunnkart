import React from "react";
import { Sort as SortIcon } from "@material-ui/icons";
import { IconButton, Paper } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function Sortering({ sort, onChangeSort }) {
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
      <IconButton
        aria-controls="sort-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ float: "right" }}
      >
        <SortIcon></SortIcon>
      </IconButton>
      <Paper elevation={3}>
        <Menu
          id="sort-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          variant="menu"
        >
          {Object.keys(sorteringsmåter).map(måte => (
            <MenuItem
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
