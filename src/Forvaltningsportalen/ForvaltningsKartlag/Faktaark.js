import Geonorge from "./Geonorge";
import React, { useState } from "react";
import {
  OpenInNew,
  VisibilityOutlined,
  Link,
  Description,
  Layers,
  Category as CategoryIcon,
  Done as DoneIcon,
  VisibilityOffOutlined
} from "@material-ui/icons";
import {
  Chip,
  IconButton,
  ListItemIcon,
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ForvaltningsUnderElement from "./ForvaltningsUnderElement";

const ForvaltningsElement = ({
  kartlag,
  onUpdateLayerProp,
  kartlag_key,
  tagFilter,
  onFilterTag,
  valgt
}) => {
  let tittel = kartlag.tittel;
  let kode = kartlag_key;
  const erSynlig = kartlag.erSynlig;
  let startstate = valgt || false;
  const [open, setOpen] = useState(startstate);
  const [openFakta, setOpenFakta] = useState(false);
  if (!tittel) return null;
  let tags = kartlag.tags || [];

  return (
    <>
      {kartlag.kart && kartlag.kart.format.wms && (
        <>
          {kartlag.produktark && (
            <>
              <ListItem>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Produktark" />
                {kartlag.produktark && (
                  <>
                    {openFakta ? (
                      <ExpandLess
                        className="iconbutton"
                        onClick={e => {
                          setOpenFakta(!openFakta);
                        }}
                      />
                    ) : (
                      <ExpandMore
                        className="iconbutton"
                        onClick={e => {
                          setOpenFakta(!openFakta);
                        }}
                      />
                    )}
                    <OpenInNew
                      className="iconbutton"
                      onClick={e => {
                        window.open(kartlag.produktark);
                      }}
                    />
                  </>
                )}
              </ListItem>

              {kartlag.produktark && (
                <Collapse in={openFakta} timeout="auto" unmountOnExit>
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
                    title="Produktark"
                    src={kartlag.produktark}
                  />
                </Collapse>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ForvaltningsElement;
