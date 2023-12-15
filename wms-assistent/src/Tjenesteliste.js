import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LayersIcon from "@mui/icons-material/Layers";
import ReportIcon from "@mui/icons-material/Report";
import CheckIcon from "@mui/icons-material/Check";

const Tjenesteliste = ({ tjenester }) => {
  const navigate = useNavigate();
  if (!tjenester) return null;
  return (
    <List>
      <ListSubheader>Kartlag</ListSubheader>
      {Object.keys(tjenester).map(k => {
        const lag = tjenester[k];
        const aok =
          lag.wmsurl && lag.wmsversion && lag.projeksjon && lag.wmsinfoformat;
        return (
          <ListItem key={k} button onClick={() => navigate("/?id=" + k)}>
            <ListItemAvatar>
              <LayersIcon></LayersIcon>
            </ListItemAvatar>
            <ListItemText primary={tjenester[k].tittel} secondary="Tjeneste" />
            <ListItemSecondaryAction>
              {aok ? (
                <CheckIcon style={{ color: "#3e3" }} />
              ) : (
                <ReportIcon style={{ color: "#ea0" }} />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Tjenesteliste;
