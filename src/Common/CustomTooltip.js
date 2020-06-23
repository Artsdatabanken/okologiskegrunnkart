import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";

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
