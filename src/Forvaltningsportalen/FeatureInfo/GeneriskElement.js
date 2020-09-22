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

const modifyResult = (resultat, clickText, clickText2) => {
  let tempResult = resultat.underlag || resultat;
  let result = {};
  Object.keys(clickText).forEach(subkey => {
    result = { ...result, [subkey]: tempResult };
    const originalClickText = clickText[subkey];
    const indices = [];
    for (let i = 0; i < originalClickText.length; i++) {
      if (originalClickText[i] === "{") indices.unshift(i + 1);
    }
    let newClickText = clickText[subkey];
    for (const index of indices) {
      newClickText =
        newClickText.slice(0, index) + subkey + "." + newClickText.slice(index);
    }
    clickText = { ...clickText, [subkey]: newClickText };

    const originalClickText2 = clickText2[subkey];
    const indices2 = [];
    for (let i = 0; i < originalClickText2.length; i++) {
      if (originalClickText2[i] === "{") indices2.unshift(i + 1);
    }
    let newClickText2 = clickText2[subkey];
    for (const index2 of indices2) {
      newClickText2 =
        newClickText2.slice(0, index2) +
        subkey +
        "." +
        newClickText2.slice(index2);
    }
    clickText2 = { ...clickText2, [subkey]: newClickText2 };
  });
  return {
    newResult: result,
    newClickText: clickText,
    newClickText2: clickText2
  };
};

const GeneriskElement = ({
  coordinates_area,
  kartlag,
  resultat,
  element,
  infoboxDetailsVisible,
  resultLayer,
  showDetailedResults
}) => {
  const [open, setOpen] = useState(false);
  const [listResults, setListResults] = useState(null);
  const [numberResults, setNumberResults] = useState(0);
  const [numberNoMatches, setNumberNoMatches] = useState(0);
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
    let clickText;
    let clickText2;
    let aggregatedLayerKey = null;
    if (!layer) return;

    const wmsinfoformat = layer.wmsinfoformat;
    const klikkurl = layer.klikkurl || "";

    if (resultat.error) {
      setPrimaryTextHeader({ harData: false, elementer: [] });
      setPrimaryText({ harData: false, elementer: [] });
      setSecondaryText({ harData: false, elementer: [] });
      return;
    } else if (
      wmsinfoformat === "application/vnd.ogc.gml" ||
      wmsinfoformat === "application/vnd.esri.wms_raw_xml"
    ) {
      // Use GetFeatureInfo with list of sublayers per layer
      Object.keys(layer.underlag).forEach(subkey => {
        if (!resultat || resultat.loading) return;

        const sublayer = layer.underlag[subkey];
        clickText = { ...clickText, [subkey]: sublayer.klikktekst };
        clickText2 = { ...clickText2, [subkey]: sublayer.klikktekst2 };
        if (sublayer.aggregatedwmslayer) {
          clickText = {
            ...clickText,
            ...layer.allcategorieslayer.klikktekst[subkey]
          };
          clickText2 = {
            ...clickText2,
            ...layer.allcategorieslayer.klikktekst2[subkey]
          };
          aggregatedLayerKey = subkey;
        }
        noNoMatches += 1;
      });

      if (clickText && clickText[aggregatedLayerKey]) {
        delete clickText[aggregatedLayerKey];
      }
      if (clickText2 && clickText2[aggregatedLayerKey]) {
        delete clickText2[aggregatedLayerKey];
      }
    } else {
      // Use GetFeatureInfo per sublayer
      Object.keys(layer.underlag).forEach(subkey => {
        if (!resultat.underlag) return;
        if (resultat.underlag[subkey] && resultat.underlag[subkey].loading)
          return;

        const sublayer = layer.underlag[subkey];
        clickText = { ...clickText, [subkey]: sublayer.klikktekst };
        clickText2 = { ...clickText2, [subkey]: sublayer.klikktekst2 };
        if (sublayer.aggregatedwmslayer) {
          clickText = { ...clickText, ...layer.allcategorieslayer.klikktekst };
          clickText2 = {
            ...clickText2,
            ...layer.allcategorieslayer.klikktekst2
          };
          aggregatedLayerKey = subkey;
        }
        noNoMatches += 1;
      });
    }

    let result;
    // Modify how results and clicktext are defined when using klikkurl
    if (klikkurl !== "" && clickText) {
      const { newResult, newClickText, newClickText2 } = modifyResult(
        resultat,
        clickText,
        clickText2
      );
      result = newResult;
      clickText = newClickText;
      clickText2 = newClickText2;
    } else {
      result = resultat.underlag || resultat;
    }

    const primary = formatterKlikktekst(
      clickText,
      result,
      aggregatedLayerKey,
      wmsinfoformat
    );
    const secondary = formatterKlikktekst(
      clickText2,
      result,
      aggregatedLayerKey,
      wmsinfoformat
    );

    if (Object.keys(primary).length > 0) {
      const indices = Object.keys(primary);
      let firstMatch = primary[indices[0]];
      const nyeElementer = [];
      if (firstMatch && firstMatch.elementer) {
        for (let i = 0; i < firstMatch.elementer.length; i++) {
          const element = firstMatch.elementer[i];
          const length = firstMatch.elementer.length;
          Object.keys(element).forEach(elementkey => {
            let elem = element[elementkey];
            if (i < length - 1) {
              elem = elem + ". ";
            }
            nyeElementer.push(elem);
          });
        }
      }
      firstMatch = {
        harData: firstMatch.harData || false,
        elementer: nyeElementer
      };

      setPrimaryTextHeader(firstMatch);
      setPrimaryText(primary);
      setSecondaryText(secondary);
    } else {
      setPrimaryTextHeader({ harData: false, elementer: [] });
      setPrimaryText({ harData: false, elementer: [] });
      setSecondaryText({ harData: false, elementer: [] });
    }

    let listResults = [Object.keys(primary), Object.keys(secondary)];
    listResults = [...new Set([].concat(...listResults))] || [];
    listResults = listResults.filter(item => item !== "harData");
    noResults = listResults.length;
    noNoMatches = noNoMatches - noResults;

    setListResults(listResults);
    setNumberResults(noResults);
    setNumberNoMatches(noNoMatches);
  }, [layer, resultat, resultatJSON]);

  useEffect(() => {
    if (
      infoboxDetailsVisible &&
      resultLayer &&
      layer &&
      resultLayer.id === layer.id
    ) {
      showDetailedResults(
        layer,
        listResults,
        primaryText,
        secondaryText,
        numberResults
      );
    }
  }, [
    layer,
    listResults,
    resultLayer,
    primaryText,
    secondaryText,
    numberResults,
    infoboxDetailsVisible,
    showDetailedResults
  ]);

  useEffect(() => {
    if (!layer || !layer.faktaark) {
      setFaktaark_url(null);
      return;
    }
    const faktUrl = url_formatter(layer.faktaark, {
      ...coordinates_area,
      ...resultat
    });
    setFaktaark_url(faktUrl);
  }, [layer, resultat, resultatJSON, coordinates_area]);

  if (!layer) return null;

  return (
    <div className="generic_element">
      {primaryTextHeader.elementer && (
        <ListItem
          id="generic-element-list"
          button
          divider
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            showDetailedResults(
              layer,
              listResults,
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
