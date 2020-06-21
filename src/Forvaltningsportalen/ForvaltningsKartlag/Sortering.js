import React, { useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Sort as SortIcon, Check } from "@material-ui/icons";
import {
  ListSubheader,
  Chip,
  IconButton,
  List,
  Paper
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import WavesIcon from "@material-ui/icons/Waves";
import useOnClickOutside from "../useOnClickOutside";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

export default function Sortering({ sort, onChangeSort }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuRef = useRef(null);
  useOnClickOutside(menuRef, () => handleClose());

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
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ float: "right" }}
      >
        <SortIcon></SortIcon>
      </IconButton>
      <Paper elevation={3}>
        <StyledMenu
          forwardRef="menu"
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {Object.keys(sorteringsmåter).map(måte => (
            <StyledMenuItem key={måte} onClick={() => handleSelect(måte)}>
              <ListItemIcon>
                {måte === sort && <Check fontSize="small" />}
              </ListItemIcon>
              <ListItemText primary={sorteringsmåter[måte]} />
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </Paper>
    </>
  );
}