import { withStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";

const styles = {
  tooltip: {
    backgroundColor: "#000000",
    fontSize: "12px",
    position: "relative",
    left: "-5px"
  }
};

const CustomTooltip = withStyles(styles)(Tooltip);

export default CustomTooltip;
