import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { ListSubheader } from "@material-ui/core";
import TextField2 from "./TextField2";

const useStyles = makeStyles({
  root: {
    xheight: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function findSublayer(layer, key) {
  if (!key) return null;
  if (layer.Title === key) return layer;
  if (!layer.Layer) return null;
  if (Array.isArray(layer.Layer))
    for (var sublayer of layer.Layer) {
      const hit = findSublayer(sublayer, key);
      if (hit) return hit;
    }
  return findSublayer(layer.Layer, sublayer);
}

export default function WmsLayerList({ caps }) {
  const classes = useStyles();
  const [sublayer, setSublayer] = useState();
  const activeSubLayer = findSublayer(caps.Layer, sublayer);
  return (
    <>
      <ListSubheader>WMS layers</ListSubheader>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={[caps.Layer.Title]}
        onNodeSelect={(e, v) => setSublayer(v)}
      >
        <RecursiveTreeView nodes={caps.Layer} />
      </TreeView>
      {activeSubLayer && (
        <>
          <ListSubheader>Aktivt underlag</ListSubheader>
          <TextField2
            title="Tittel"
            dockey="Title"
            doc={activeSubLayer}
            onUpdate={() => {}}
          />
          <TextField2
            title="Abstrakt"
            dockey="Abstract"
            doc={activeSubLayer}
            onUpdate={() => {}}
          />
          <Legend layer={activeSubLayer} />
        </>
      )}
    </>
  );
}

const Legend = ({ layer }) => {
  const onlineResource = layer.Style?.LegendURL?.OnlineResource;
  if (!onlineResource) return <span>Ingen legendURL tilgjengelig.</span>;
  return (
    <>
      <TextField2
        title="Legend URL"
        dockey="xlink:href"
        doc={layer.Style.LegendURL.OnlineResource}
        onUpdate={() => {}}
      />
      <ListSubheader>Legend preview</ListSubheader>
      <img alt="tegnforklaring" src={onlineResource["xlink:href"]} />
      <div>{onlineResource["xlink:href"]}</div>
    </>
  );
};

function RecursiveTreeView({ nodes }) {
  return (
    <TreeItem
      key={nodes.Title}
      nodeId={nodes.Title}
      label={
        <div style={{ xcolor: nodes.BoundingBox ? "red" : "green" }}>
          {nodes.Title}
        </div>
      }
    >
      {Array.isArray(nodes.Layer)
        ? nodes.Layer.map((node) => (
            <RecursiveTreeView key={node.Title} nodes={node} />
          ))
        : null}
    </TreeItem>
  );
}
