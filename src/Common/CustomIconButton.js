import { withStyles } from "@mui/styles";
import { IconButton } from "@mui/material";

const styles = {
  root: {
    "&.MuiIconButton-root": {
      color: "#005a71",
      border: "2px solid #005a71",
      backgroundColor: "rgba(200, 200, 200, 0)",
      padding: "10px"
    },
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.6)"
    },
    "&.Mui-disabled": {
      border: "1px solid #999"
    }
  }
};

const CustomIconButton = withStyles(styles)(IconButton);

export default CustomIconButton;
