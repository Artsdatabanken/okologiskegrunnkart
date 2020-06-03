import React from "react";
import { Pagination, TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { IconButton, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import TextField2 from "./TextField2";
import { Alert } from "@material-ui/lab";
import klikktekst from "./FeatureInfo/Klikktekst";
import KlikkResultatPreview from "./KlikkResultatPreview";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  panel: {
    zIndex: 11111,
    position: "fixed",
    width: 600,
    top: 0,
    bottom: 0,
    left: 0,
    padding: 16,
    overflow: "scroll",
  },
  root: {
    xheight: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const FeaturePicker = ({ feature, onClick, picker, linje, doc, onUpdate }) => {
  const classes = useStyles();
  const history = useHistory();

  const resultat = klikktekst(feature, doc[picker]);
  return (
    <Paper depth={4} className={classes.panel}>
      {feature ? (
        <>
          {true && (
            <IconButton
              onClick={() => history.push(`?id=${doc._id}`)}
              style={{ zIndex: 100, position: "fixed", left: 536, top: 8 }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          )}
          <Typography variant="h5">
            Klikk i kart, resultat for {doc.tittel}
          </Typography>
          <Pagination
            page={linje}
            onChange={(e, v) =>
              history.push(`?id=${doc._id}&sub=klikktekst${v === 2 ? "2" : ""}`)
            }
            count={2}
            shape="rounded"
          />
          <div style={{ margin: 16 }}>
            <TextField2
              title={`Formatstreng linje ${linje}`}
              dockey={picker}
              doc={doc}
              onUpdate={onUpdate}
            />
            {resultat.warn &&
              resultat.warn.map((warning) => (
                <Alert key={warning} severity="warning">
                  {warning}
                </Alert>
              ))}
          </div>

          <Typography variant="h6">
            Klikk på node for å legge til i visning for linje {linje}:
          </Typography>
          <Typography variant="body2">
            GetFeatureInfo {doc.testkoordinater}
          </Typography>
          <TreeView
            className={classes.root}
            defaultExpanded={[]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <RecursiveTreeView o={feature} onClick={onClick} />
          </TreeView>
          <KlikkResultatPreview doc={doc} feature={feature} />
        </>
      ) : (
        <div>Sett et punkt i kartet.</div>
      )}
    </Paper>
  );
};

function RecursiveTreeView({ parentkey, o, onClick }) {
  console.log("parentkey", parentkey, "o", o);
  return (
    <>
      {Object.keys(o || {}).map((key) => {
        const full = parentkey ? parentkey + "." + key : key;
        const value = o[key];
        if (typeof value === "string")
          return (
            <TreeItem
              key={key}
              nodeId={full}
              label={key + " = " + o[key]}
              onClick={(e) => onClick(full)}
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
