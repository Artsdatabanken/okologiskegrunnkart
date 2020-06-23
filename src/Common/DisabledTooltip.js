import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";

const styles = {
  tooltip: {
    backgroundColor: "grey",
    fontSize: "12px",
    position: "relative",
    left: "-5px"
  }
};

const DisabledTooltip = withStyles(styles)(Tooltip);

export default DisabledTooltip;
