import { withStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";

const styles = {
  tooltip: {
    backgroundColor: "#000000",
    fontSize: "12px",
    position: "relative",
    bottom: "12px"
  }
};

const BottomTooltip = withStyles(styles)(Tooltip);

export default BottomTooltip;
