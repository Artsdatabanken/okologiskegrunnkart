import { OpenInNew, Close } from "@material-ui/icons";
import { ListItem, ListItemIcon, Modal, Button } from "@material-ui/core";
import React, { useState } from "react";
import { Badge } from "@material-ui/core";
import formatterKlikktekst from "./Klikktekst";
import url_formatter from "../../Funksjoner/url_formatter";
import CustomIcon from "../../Common/CustomIcon";

const GeneriskElement = props => {
  const [open, setOpen] = useState(false);
  const resultat = props.resultat;

  let kartlag = props.kartlag[props.element];
  if (!kartlag) return null;
  const faktaark_url = url_formatter(kartlag.faktaark, {
    ...props.coordinates_area,
    ...props.resultat
  });

  const isLargeIcon = tema => {
    return ["Arealressurs", "Arter", "Klima", "Skog", "Landskap"].includes(
      tema
    );
  };

  const primaryText = formatterKlikktekst(kartlag.klikktekst, resultat);
  const secondaryText = formatterKlikktekst(kartlag.klikktekst2, resultat);

  return (
    <div className="generic_element">
      {!resultat.loading && (
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
                  icon={kartlag.tema}
                  size={isLargeIcon(kartlag.tema) ? 30 : 26}
                  padding={isLargeIcon(kartlag.tema) ? 0 : 2}
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
              {primaryText && primaryText.harData && primaryText.elementer[0]
                ? primaryText.elementer
                : resultat.error
                ? "Kunne ikke hente data"
                : "Ingen treff"}
            </div>
            <div className="generic-element-secondary-text">
              {secondaryText.harData ? secondaryText.elementer : kartlag.tittel}
            </div>
            <div className="generic-element-data-owner">{kartlag.dataeier}</div>
          </div>
          {faktaark_url && <OpenInNew id="open-facts-icon" color="primary" />}
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
          {kartlag.type !== "naturtype" && (
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
