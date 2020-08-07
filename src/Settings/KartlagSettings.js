import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import "../style/settings.css";
import { makeStyles } from "@material-ui/core/styles";
import useWindowDimensions from "../Funksjoner/useWindowDimensions";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: "100vw",
    maxWidth: 600
  }
});

const KartlagSettings = ({
  kartlag,
  someLayersFavorite,
  toggleEditLayers,
  updateFavoriteLayers
}) => {
  const [layers, setLayers] = useState(kartlag);
  const [layersActive, setLayersActive] = useState(someLayersFavorite);
  const [loading, setLoading] = useState(false);

  const { isMobile } = useWindowDimensions();

  const classes = useStyles();

  const handleAllLayersChange = () => {
    const newStatus = !layersActive;
    setLayersActive(newStatus);
    Object.keys(layers).forEach(layerId => {
      const layer = layers[layerId];
      layer.favorite = newStatus;
      Object.keys(layer.underlag).forEach(sublayerId => {
        const sublayer = layer.underlag[sublayerId];
        sublayer.favorite = newStatus;
      });
    });
  };

  const handleLayerChange = lagId => {
    let updatedLayer = { ...layers[lagId] };
    const newStatus = !updatedLayer.favorite;
    updatedLayer.favorite = newStatus;
    Object.keys(updatedLayer.underlag).forEach(layerId => {
      updatedLayer.underlag[layerId].favorite = newStatus;
    });
    const updatedLayers = { ...layers, [lagId]: updatedLayer };
    setLayers(updatedLayers);
    if (!layersActive && newStatus) {
      setLayersActive(true);
    } else if (!newStatus && !checkAnySublayerActive(updatedLayers)) {
      setLayersActive(false);
    }
  };

  const handleSublayerChange = (lagId, sublagId) => {
    let updatedSublayer = { ...layers[lagId].underlag[sublagId] };
    updatedSublayer.favorite = !updatedSublayer.favorite;
    const updatedSublayers = {
      ...layers[lagId].underlag,
      [sublagId]: updatedSublayer
    };
    let oneSublayerFavorite = false;
    Object.keys(updatedSublayers).forEach(sublayerId => {
      const sublayer = updatedSublayers[sublayerId];
      if (sublayer.favorite) {
        oneSublayerFavorite = true;
      }
    });
    const updatedLayer = {
      ...layers[lagId],
      underlag: updatedSublayers,
      favorite: oneSublayerFavorite
    };
    const updatedLayers = { ...layers, [lagId]: updatedLayer };
    setLayers(updatedLayers);

    if (!layersActive && oneSublayerFavorite) {
      setLayersActive(true);
    } else if (!oneSublayerFavorite && !checkAnySublayerActive(updatedLayers)) {
      setLayersActive(false);
    }
  };

  const checkAnySublayerActive = updatedLayers => {
    if (!updatedLayers) {
      return false;
    }
    let anySublayerFavorite = false;
    Object.keys(updatedLayers).forEach(layerId => {
      if (!anySublayerFavorite) {
        const layer = updatedLayers[layerId];
        Object.keys(layer.underlag).forEach(sublayerId => {
          const sublayer = layer.underlag[sublayerId];
          if (sublayer.favorite) {
            anySublayerFavorite = true;
          }
        });
      }
    });
    return anySublayerFavorite;
  };

  useEffect(() => {
    setLayersActive(someLayersFavorite);
  }, [someLayersFavorite]);

  const save = async () => {
    setLoading(true);
    updateFavoriteLayers(layers).then(() => {
      setLoading(false);
      toggleEditLayers();
    });
  };

  const onlySomeSublayersFavorite = sublayers => {
    let allFavorite = true;
    let noneFavorite = true;
    Object.keys(sublayers).map(sublagId => {
      let sublayer = sublayers[sublagId];
      if (!sublayer.favorite) {
        allFavorite = false;
      }
      if (sublayer.favorite) {
        noneFavorite = false;
      }
      return { allFavorite, noneFavorite };
    });
    return !(allFavorite || noneFavorite);
  };

  return (
    <div className="settings-layers-wrapper">
      <div className="setting-layers-title">
        <span>Velg favoritte lag og underlag</span>
      </div>
      <div className="settings-layers-tree-wrapper">
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem
            id="settings-layers-top-item"
            nodeId="toplevel"
            label={
              <div className="settings-layers-list-item-wrapper">
                <Checkbox
                  id="settings-layers-checkbox"
                  checked={layersActive}
                  onChange={() => handleAllLayersChange()}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    e.stopPropagation();
                    if (e.keyCode === 13) {
                      //Enterpressed
                      handleAllLayersChange();
                    }
                  }}
                  color="primary"
                />
                <Typography id="settings-layers-item-label" variant="h6">
                  Kartlag
                </Typography>
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
                      tabIndex={0}
                      label={
                        <div className="settings-layers-list-item-wrapper">
                          <Checkbox
                            id="settings-layers-checkbox"
                            checked={lag.favorite}
                            onChange={() => handleLayerChange(lagId)}
                            onClick={e => e.stopPropagation()}
                            onKeyDown={e => {
                              e.stopPropagation();
                              if (e.keyCode === 13) {
                                //Enterpressed
                                handleLayerChange(lagId);
                              }
                            }}
                            color={
                              !onlySomeSublayersFavorite(lag.underlag)
                                ? "primary"
                                : "secondary"
                            }
                          />
                          <Typography
                            id="settings-layers-item-label"
                            variant={isMobile ? "body2" : "body1"}
                          >
                            {lag.tittel}
                          </Typography>
                        </div>
                      }
                    >
                      {lag.underlag && (
                        <>
                          {Object.keys(lag.underlag).map(sublagId => {
                            let sublag = lag.underlag[sublagId];

                            return (
                              <TreeItem
                                id="settings-sublayers-list-item"
                                key={"sublayer_" + sublag.key}
                                nodeId={"sublayer_" + sublag.key}
                                label={
                                  <div className="settings-sublayers-list-item-wrapper">
                                    <Checkbox
                                      id="settings-layers-checkbox"
                                      checked={sublag.favorite}
                                      onChange={() =>
                                        handleSublayerChange(lagId, sublagId)
                                      }
                                      onClick={e => e.stopPropagation()}
                                      color="primary"
                                    />
                                    <Typography
                                      id="settings-layers-item-label"
                                      variant={isMobile ? "body2" : "body1"}
                                    >
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
      <div className="settings-layers-buttons-wrapper">
        <Button
          id="settings-layers-cancel-button"
          variant="contained"
          size="small"
          onClick={() => {
            toggleEditLayers();
          }}
        >
          Avbryt
        </Button>
        <Button
          id="settings-layers-save-button"
          variant="contained"
          size="small"
          onClick={() => {
            save();
          }}
        >
          {loading && <CircularProgress size={23} />}
          {!loading && "Lagre"}
        </Button>
      </div>
    </div>
  );
};

export default KartlagSettings;
