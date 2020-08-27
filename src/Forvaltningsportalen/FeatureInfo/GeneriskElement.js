import { OpenInNew, Info, Close } from "@material-ui/icons";
import { ListItem, ListItemIcon, Modal, Button } from "@material-ui/core";
import React, { useState } from "react";
import { Badge } from "@material-ui/core";
import formatterKlikktekst from "./Klikktekst";
import url_formatter from "../../Funksjoner/url_formatter";
import CustomIcon from "../../Common/CustomIcon";
import CustomTooltip from "../../Common/CustomTooltip";

const GeneriskElement = ({ coordinates_area, kartlag, resultat, element }) => {
  const [open, setOpen] = useState(false);
  const [primaryTextHeader, setPrimaryTextHeader] = useState({
    harData: false,
    element: []
  });
  const [secondaryTextHeader, setSecondaryTextHeader] = useState({
    harData: false,
    element: []
  });

  let layer = kartlag[element];
  if (!layer) return null;
  const faktaark_url = url_formatter(layer.faktaark, {
    ...coordinates_area,
    ...resultat
  });

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  let primaryText = {};
  let secondaryText = {};
  Object.keys(layer.underlag).forEach(subkey => {
    const sublayer = layer.underlag[subkey];
    const primary = formatterKlikktekst(
      sublayer.klikktekst,
      resultat.underlag[subkey] || resultat
    );
    const secondary = formatterKlikktekst(
      sublayer.klikktekst2,
      resultat.underlag[subkey] || resultat
    );
    primaryText = { ...primaryText, [subkey]: primary };
    secondaryText = { ...secondaryText, [subkey]: secondary };

    if (!primaryTextHeader.harData && primary.harData) {
      setPrimaryTextHeader(primary);
      setSecondaryTextHeader(secondary);
    }

    if (sublayer.aggregatedwmslayer && primary.harData) {
      setPrimaryTextHeader(primary);
      setSecondaryTextHeader(secondary);
    }
  });

  return (
    <div className="generic_element">
      {primaryTextHeader.harData && (
        <ListItem
          id="generic-element-list"
          button={faktaark_url ? true : false}
          divider
          onClick={() => {
            if (faktaark_url) {
              setOpen(true);
            }
          }}
        >
          <ListItemIcon className="infobox-list-icon-wrapper">
            <>
              <Badge
                badgeContent={resultat.error ? "!" : 0}
                color="primary"
                overlap="circle"
              >
                <CustomIcon
                  id="infobox-list-icon"
                  icon={layer.tema}
                  size={isLargeIcon(layer.tema) ? 30 : 26}
                  padding={isLargeIcon(layer.tema) ? 0 : 2}
                  color={"#777"}
                />
              </Badge>
            </>
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
            <div className="generic-element-secondary-text">
              {secondaryTextHeader.harData
                ? secondaryTextHeader.elementer
                : layer.tittel}
            </div>
            <div className="generic-element-data-owner">{layer.dataeier}</div>
          </div>
          {faktaark_url && (
            <CustomTooltip placement="right" title="Vis faktaark">
              <Info id="open-facts-icon" color="primary" />
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
