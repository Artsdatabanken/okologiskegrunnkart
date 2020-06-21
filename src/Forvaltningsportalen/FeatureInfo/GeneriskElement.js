import React from "react";
import { Visibility, VisibilityOff, ErrorOutline } from "@material-ui/icons";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip
} from "@material-ui/core";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const GeneriskElement = props => {
  const history = useHistory();
  const resultat = props.resultat;

  let kartlag = props.kartlag[props.element];
  if (!kartlag) return null;
  return (
    <ListItem
      divider
      button
      onClick={() => history.push("/kartlag/" + kartlag.id)}
    >
      {false && (
        <ListItemIcon
          _className="visibility_button"
          onClick={e => {
            props.onUpdateLayerProp(kartlag.id, "erSynlig", !kartlag.erSynlig);
          }}
        >
          {resultat.loading ? (
            <CircularProgress />
          ) : (
            <>
              {resultat.error ? (
                <ErrorOutline />
              ) : (
                <>{kartlag.erSynlig ? <Visibility /> : <VisibilityOff />}</>
              )}
            </>
          )}
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          resultat.loading ? (
            <LoadingPlaceholder />
          ) : (
            resultat.primary || "Ingen treff"
          )
        }
        secondary={resultat.secondary}
      />
      {resultat.error && (
        <ListItemSecondaryAction>
          <Tooltip title={JSON.stringify(resultat.error)}>
            <ErrorOutline style={{ color: "#eb4938" }} />
          </Tooltip>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default GeneriskElement;
