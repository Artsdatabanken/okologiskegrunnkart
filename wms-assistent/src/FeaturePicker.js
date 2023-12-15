import React from "react";
import { TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { IconButton, Typography, Paper } from "@mui/material";
import { css } from "@emotion/react"
import CloseIcon from "@mui/icons-material/Close";
import TextField2 from "./TextField2";
import { Alert } from "@mui/lab";
import klikktekst from "./FeatureInfo/Klikktekst";
import { useNavigate } from 'react-router-dom';

const styles = {
  panel: css`
    zIndex: 11111,
    position: "fixed",
    width: 600,
    top: 0,
    bottom: 0,
    left: 0,
    padding: 16,
    overflow: "scroll"
    `,
  root: css`
    xheight: 240,
    flexGrow: 1,
    maxWidth: 400
  `
};

const FeaturePicker = ({
  feature,
  onClick,
  picker,
  variabel,
  layer,
  onUpdate
}) => {
  const navigate = useNavigate();

  const resultat = klikktekst(feature, layer[picker]);
  return (
    <Paper depth={4} css={styles.panel}>
      {feature ? (
        <>
          {true && (
            <IconButton
              onClick={() => navigate(-1)}
              style={{ zIndex: 100, position: "fixed", left: 536, top: 8 }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          )}
          <Typography variant="h5">
            {layer.tittel} - {variabel}
          </Typography>
          <div style={{ margin: 16 }}>
            <TextField2
              title={`Formatstreng for ${variabel}`}
              dockey={picker}
              doc={layer}
              onUpdate={onUpdate}
            />
            {resultat.warn &&
              resultat.warn.map(warning => (
                <Alert key={warning} severity="warning">
                  {warning}
                </Alert>
              ))}
          </div>

          <Typography variant="h6">
            Klikk på node for å legge til i visning for {variabel}:
          </Typography>
          <Typography variant="body2">
            GetFeatureInfo {layer.testkoordinater}
          </Typography>
          <TreeView
            css={styles.root}
            defaultExpanded={[]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <RecursiveTreeView o={feature} onClick={onClick} />
          </TreeView>
        </>
      ) : (
        <div>Sett et punkt i kartet.</div>
      )}
    </Paper>
  );
};

function RecursiveTreeView({ parentkey, o, onClick }) {
  return (
    <>
      {Object.keys(o || {}).map(key => {
        const full = parentkey ? parentkey + "." + key : key;
        const value = o[key];
        if (typeof value === "string")
          return (
            <TreeItem
              key={key}
              nodeId={full}
              label={key + " = " + o[key]}
              onClick={e => onClick(full)}
            />
          );
        return (
          <TreeItem key={key} nodeId={full} label={key}>
            <RecursiveTreeView
              key={key}
              parentkey={full}
              o={value}
              onClick={onClick}
            />
          </TreeItem>
        );
      })}
    </>
  );
}

export default FeaturePicker;
