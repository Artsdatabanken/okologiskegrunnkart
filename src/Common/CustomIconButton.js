import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

const styles = {
  root: {
    "&.MuiIconButton-root": {
      color: "#666",
      border: "1px solid #666",
      backgroundColor: "rgba(200, 200, 200, 0)",
      padding: "10px"
    },
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.6)"
    },
    "&.Mui-disabled": {
      color: "#999",
      border: "1px solid #999"
    }
  }
};

const CustomIconButton = withStyles(styles)(IconButton);

export default CustomIconButton;
