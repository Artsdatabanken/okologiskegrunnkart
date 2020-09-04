import { OpenInNew, Info, Close } from "@material-ui/icons";
import {
  ListItem,
  ListItemIcon,
  Modal,
  Button,
  IconButton
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Badge } from "@material-ui/core";
import formatterKlikktekst from "./Klikktekst";
import url_formatter from "../../Funksjoner/url_formatter";
import CustomIcon from "../../Common/CustomIcon";
import CustomTooltip from "../../Common/CustomTooltip";

const GeneriskElement = ({
  coordinates_area,
  kartlag,
  resultat,
  element,
  showDetails,
  resultLayer,
  showDetailedResults
}) => {
  const [open, setOpen] = useState(false);
  const [numberResults, setNumberResults] = useState(null);
  const [numberNoMatches, setNumberNoMatches] = useState(null);
  const [faktaark_url, setFaktaark_url] = useState(null);

  const [primaryTextHeader, setPrimaryTextHeader] = useState({
    harData: false,
    elementer: []
  });
  const [primaryText, setPrimaryText] = useState({
    harData: false,
    elementer: []
  });
  const [secondaryText, setSecondaryText] = useState({
    harData: false,
    elementer: []
  });

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  const layer = kartlag[element];
  const resultatJSON = JSON.stringify(resultat);

  useEffect(() => {
    let noResults = 0;
    let noNoMatches = 0;
    let tempPrimary = {};
    let tempSecondary = {};
    let headerHasData = false;
    let headerDefined = false;
    Object.keys(layer.underlag).forEach(subkey => {
      if (!resultat.underlag) return;
      if (resultat.underlag[subkey] && resultat.underlag[subkey].loading)
        return;

      const sublayer = layer.underlag[subkey];
      const primary = formatterKlikktekst(
        sublayer.klikktekst,
        resultat.underlag[subkey] || resultat
      );
      const secondary = formatterKlikktekst(
        sublayer.klikktekst2,
        resultat.underlag[subkey] || resultat
      );
      tempPrimary = { ...tempPrimary, [subkey]: primary };
      tempSecondary = { ...tempSecondary, [subkey]: secondary };

      if (!headerHasData && primary.harData) {
        setPrimaryTextHeader(primary);
        headerHasData = true;
      }

      if (
        sublayer.aggregatedwmslayer &&
        sublayer.aggregatedwmslayer !== "" &&
        primary.harData
      ) {
        setPrimaryTextHeader(primary);
      }

      if (
        !headerDefined &&
        primary.elementer.length > 0 &&
        primary.elementer[0] &&
        primary.elementer[0] !== "" &&
        primary.elementer[0] !== " "
      ) {
        setPrimaryTextHeader(primary);
        headerDefined = true;
      }

      if (primary.elementer && primary.elementer[0]) {
        noResults += 1;
      } else {
        noNoMatches += 1;
      }
    });
    setPrimaryText(tempPrimary);
    setSecondaryText(tempSecondary);
    setNumberResults(noResults);
    setNumberNoMatches(noNoMatches);
  }, [layer, resultat, resultatJSON]);

  useEffect(() => {
    if (showDetails && resultLayer && layer && resultLayer.id === layer.id) {
      showDetailedResults(layer, primaryText, secondaryText, numberResults);
    }
  }, [
    layer,
    resultLayer,
    primaryText,
    secondaryText,
    numberResults,
    showDetails,
    showDetailedResults
  ]);

  useEffect(() => {
    const faktUrl = url_formatter(layer.faktaark, {
      ...coordinates_area,
      ...resultat
    });
    setFaktaark_url(faktUrl);
  }, [layer, resultat, resultatJSON, coordinates_area]);

  if (!layer) return null;

  return (
    <div className="generic_element">
      {primaryTextHeader.elementer && primaryTextHeader.elementer.length > 0 && (
        <ListItem
          id="generic-element-list"
          button
          divider
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            showDetailedResults(
              layer,
              primaryText,
              secondaryText,
              numberResults
            );
          }}
        >
          <ListItemIcon className="infobox-list-icon-wrapper">
            <Badge
              badgeContent={
                resultat.error
                  ? "!"
                  : numberResults + "/" + (numberNoMatches + numberResults)
              }
              color={
                resultat.error
                  ? "error"
                  : numberResults > 0
                  ? "primary"
                  : "secondary"
              }
            >
              <CustomIcon
                id="infobox-list-icon"
                icon={layer.tema}
                size={isLargeIcon(layer.tema) ? 30 : 26}
                padding={isLargeIcon(layer.tema) ? 0 : 2}
                color={"#777"}
              />
            </Badge>
          </ListItemIcon>
          <div
            style={{
              flex: 1
            }}
          >
            <div className="generic-element-primary-text">
              {primaryTextHeader &&
              primaryTextHeader.harData &&
              primaryTextHeader.elementer[0]
                ? primaryTextHeader.elementer
                : resultat.error
                ? "Kunne ikke hente data"
                : "Ingen treff"}
            </div>
            <div className="generic-element-secondary-text">{layer.tittel}</div>
            <div className="generic-element-data-owner">{layer.dataeier}</div>
          </div>
          {faktaark_url && (
            <CustomTooltip placement="right" title="Vis faktaark">
              <IconButton
                id="show-faktaark-button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Info id="open-facts-icon" color="primary" />
              </IconButton>
            </CustomTooltip>
          )}
        </ListItem>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        className="facts-modal-body"
      >
        <div className="facts-modal-wrapper">
          <div className="facts-modal-title">
            <div>Faktaark</div>
            <div className="facts-modal-buttons-div">
              <Button
                id="infobox-detail-facts"
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => window.open(faktaark_url)}
                endIcon={<OpenInNew />}
              >
                Åpne i nytt vindu
              </Button>
              <button
                tabIndex="0"
                className="close-modal-button-wrapper"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <div className="close-modal-button">
                  <Close />
                </div>
              </button>
            </div>
          </div>
          {layer.type !== "naturtype" && (
            <iframe
              className="facts-modal-content"
              allowtransparency="true"
              title="Faktaark"
              src={faktaark_url}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default GeneriskElement;
