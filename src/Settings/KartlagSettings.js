import React, { useState, useEffect } from "react";
import { Button, Checkbox, Typography } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import "../style/settings.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: "100vw",
    maxWidth: 600
  }
});

const KartlagSettings = ({
  kartlag,
  allLayersActive,
  toggleAllLayersActive,
  toggleEditLayers,
  updateActiveLayers
}) => {
  const [layers, setLayers] = useState(kartlag);
  const [layersActive, setLayersActive] = useState(allLayersActive);
  // const [checked, setChecked] = useState([]);
  // const [expanded, setExpanded] = useState([]);

  const classes = useStyles();

  const handleAllLayersChange = () => {
    console.log("All layers change");
    setLayersActive(!layersActive);
  };

  const handleLayerChange = lagId => {
    let updatedLayer = { ...layers[lagId] };
    const newStatus = !updatedLayer.active;
    updatedLayer.active = newStatus;
    Object.keys(updatedLayer.underlag).forEach(key => {
      updatedLayer.underlag[key].active = newStatus;
    });
    const updatedLayers = { ...layers, [lagId]: updatedLayer };
    setLayers(updatedLayers);
  };

  const handleSublayerChange = (lagId, sublagId) => {
    let updatedSublayer = { ...layers[lagId].underlag[sublagId] };
    updatedSublayer.active = !updatedSublayer.active;
    const updatedSublayers = {
      ...layers[lagId].underlag,
      [sublagId]: updatedSublayer
    };
    const updatedLayer = { ...layers[lagId], underlag: updatedSublayers };
    const updatedLayers = { ...layers, [lagId]: updatedLayer };
    setLayers(updatedLayers);
  };

  // const definenodes = () => {
  //   const nodes = [];
  //   Object.entries(kartlag).forEach(async ([key, k]) => {
  //     const value = "layer_" + k.id;
  //     const label = k.tittel;
  //     const children = Object.entries(k.underlag).map(([key, sublayer]) => {
  //       return { value: "sublayer_" + sublayer.key, label: sublayer.tittel };
  //     });
  //     nodes.push({ value, label, children });
  //   });
  //   return nodes;
  // };
  // useEffect(() => {
  //   const layers = [];
  //   Object.entries(kartlag).forEach(async ([key, k]) => {
  //     const value = "layer_" + k.id;
  //     const label = k.tittel;
  //     const children = Object.entries(k.underlag).map(([key, sublayer]) => {
  //       return { value: "sublayer_" + sublayer.key, label: sublayer.tittel };
  //     });
  //     layers.push({ value, label, children });
  //   });
  //   setNodes(layers);
  //   console.log(layers)
  // }, [kartlag]);

  const save = async () => {
    updateActiveLayers(layers).then(() => {
      toggleEditLayers();
    });
  };

  return (
    <div className="settings-layers-wrapper">
      <div>Velg lag og underlag som skal vises</div>
      <div>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem
            id="settings-layers-list-item"
            nodeId="toplevel"
            label={
              <div className="settings-layers-list-item-wrapper">
                <Checkbox
                  id="settings-layers-checkbox"
                  checked={layersActive}
                  onChange={() => handleAllLayersChange()}
                  onClick={e => e.stopPropagation()}
                  color="primary"
                />
                <Typography variant="h6">Kartlag</Typography>
              </div>
            }
          >
            {kartlag && (
              <>
                {Object.keys(layers).map(lagId => {
                  let lag = layers[lagId];

                  return (
                    <TreeItem
                      id="settings-layers-list-item"
                      key={"layer_" + lag.id}
                      nodeId={"layer_" + lag.id}
                      label={
                        <div className="settings-layers-list-item-wrapper">
                          <Checkbox
                            id="settings-layers-checkbox"
                            checked={lag.active}
                            onChange={() => handleLayerChange(lagId)}
                            onClick={e => e.stopPropagation()}
                            color="primary"
                          />
                          <Typography variant="body1">{lag.tittel}</Typography>
                        </div>
                      }
                    >
                      {lag.underlag && (
                        <>
                          {Object.keys(lag.underlag).map(sublagId => {
                            let sublag = lag.underlag[sublagId];

                            return (
                              <TreeItem
                                id="settings-layers-list-item"
                                key={"sublayer_" + sublag.key}
                                nodeId={"sublayer_" + sublag.key}
                                label={
                                  <div className="settings-layers-list-item-wrapper">
                                    <Checkbox
                                      id="settings-layers-checkbox"
                                      checked={sublag.active}
                                      onChange={() =>
                                        handleSublayerChange(lagId, sublagId)
                                      }
                                      onClick={e => e.stopPropagation()}
                                      color="primary"
                                    />
                                    <Typography variant="body1">
                                      {sublag.tittel}
                                    </Typography>
                                  </div>
                                }
                                style={{ paddingLeft: 30 }}
                              />
                            );
                          })}
                        </>
                      )}
                    </TreeItem>
                  );
                })}
              </>
            )}
          </TreeItem>
        </TreeView>
      </div>
      <div>
        <Button
          id="settings-layers-save-button"
          variant="contained"
          size="small"
          onClick={() => {
            save();
          }}
        >
          Lagre
        </Button>
      </div>
    </div>
  );
};

export default KartlagSettings;
