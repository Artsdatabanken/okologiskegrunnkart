import React from "react";
import { ErrorOutline } from "@material-ui/icons";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip
} from "@material-ui/core";
import LoadingPlaceholder from "./LoadingPlaceholder";
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
      onClick={() => history.push("/kartlag/" + kartlag.tittel)}
    >
      <ListItemText
        primary={
          resultat.loading ? (
            <LoadingPlaceholder />
          ) : (
            resultat.primary || "Ingen treff"
          )
        }
        secondary={resultat.secondary || kartlag.tittel}
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
