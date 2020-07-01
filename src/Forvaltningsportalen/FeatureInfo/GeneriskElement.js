import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Collapse, ListItem, ListItemIcon } from "@material-ui/core";
import React, { useState } from "react";
import ExpandedHeader from "./ExpandedHeader";
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

  let secondaryTextResults = false;
  if (
    secondaryText.harData &&
    secondaryText.elementer.length > 0 &&
    secondaryText.elementer[0]
  ) {
    secondaryTextResults = true;
  }

  return (
    <div
      style={{ backgroundColor: faktaark_url && open ? "#fff" : "#eeeeee" }}
      className="generic_element"
    >
      {!resultat.loading && (
        <ListItem
          button
          divider
          onClick={() => {
            setOpen(!open);
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
              {secondaryTextResults ? secondaryText.elementer : kartlag.tittel}
            </div>
            <div className="generic-element-data-owner">{kartlag.dataeier}</div>
          </div>
          {faktaark_url && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
        </ListItem>
      )}

      {faktaark_url && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ExpandedHeader
            visible={props.visible}
            geonorge={props.geonorge}
            url={faktaark_url}
            type={kartlag.type}
          />
          {kartlag.type !== "naturtype" && (
            <iframe
              allowtransparency="true"
              style={{
                frameBorder: 0,
                width: "100%",
                minHeight: "500px",
                maxHeight: "100%",
                position: "relative",
                overflow: "none"
              }}
              title="Faktaark"
              src={faktaark_url}
            />
          )}
        </Collapse>
      )}
    </div>
  );
};

export default GeneriskElement;
