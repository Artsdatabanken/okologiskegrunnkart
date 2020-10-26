import { ListItem, ListItemIcon } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Badge } from "@material-ui/core";
import formatterKlikktekst from "./Klikktekst";
import formatterFaktaarkURL from "./FaktaarkURL";
import CustomIcon from "../../Common/CustomIcon";

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
  kartlag,
  resultat,
  element,
  infoboxDetailsVisible,
  resultLayer,
  showDetailedResults
}) => {
  // const [open, setOpen] = useState(false);
  const [listResults, setListResults] = useState(null);
  const [numberResults, setNumberResults] = useState(0);
  // const [faktaark_url, setFaktaark_url] = useState(null);

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
    let clickText;
    let clickText2;
    let faktaark;
    let aggregatedLayerKey = null;
    if (!layer) return;

    const wmsinfoformat = layer.wmsinfoformat;
    const klikkurl = layer.klikkurl || "";

    console.log("resultat: ", resultat);

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
        if (sublayer.faktaark && sublayer.faktaark.length > 0) {
          faktaark = { ...faktaark, [subkey]: sublayer.faktaark };
        }
        if (sublayer.aggregatedwmslayer) {
          clickText = {
            ...clickText,
            ...layer.allcategorieslayer.klikktekst[subkey]
          };
          clickText2 = {
            ...clickText2,
            ...layer.allcategorieslayer.klikktekst2[subkey]
          };
          faktaark = {
            ...faktaark,
            ...layer.allcategorieslayer.faktaark[subkey]
          };
          aggregatedLayerKey = subkey;
        }
      });

      if (clickText && clickText[aggregatedLayerKey]) {
        delete clickText[aggregatedLayerKey];
      }
      if (clickText2 && clickText2[aggregatedLayerKey]) {
        delete clickText2[aggregatedLayerKey];
      }
      if (faktaark && faktaark[aggregatedLayerKey]) {
        delete faktaark[aggregatedLayerKey];
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
        if (sublayer.faktaark && sublayer.faktaark.length > 0) {
          faktaark = { ...faktaark, [subkey]: sublayer.faktaark };
        }
        if (sublayer.aggregatedwmslayer) {
          clickText = { ...clickText, ...layer.allcategorieslayer.klikktekst };
          clickText2 = {
            ...clickText2,
            ...layer.allcategorieslayer.klikktekst2
          };
          faktaark = {
            ...faktaark,
            ...layer.allcategorieslayer.faktaark
          };
          aggregatedLayerKey = subkey;
        }
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

    let faktaarkURL;
    if (!faktaark) {
      faktaarkURL = layer.faktaark;
      console.log("faktaarkURL: ", faktaarkURL);
    } else {
      faktaarkURL = formatterFaktaarkURL(
        faktaark,
        result,
        aggregatedLayerKey,
        wmsinfoformat
      );
      console.log("faktaarkURL: ", faktaarkURL);
    }

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

    setListResults(listResults);
    setNumberResults(noResults);
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
              className={"badge-enabled"}
              badgeContent={resultat.error ? "!" : numberResults}
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
          <ListItemIcon id="open-details-icon">
            <CustomIcon
              id="open-details"
              icon="chevron-right"
              size={20}
              padding={0}
              color="#666"
            />
          </ListItemIcon>
        </ListItem>
      )}
    </div>
  );
};

export default GeneriskElement;
