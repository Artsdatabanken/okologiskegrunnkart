import React, { useState, useEffect } from "react";
import "../../style/infobox.css";

const PolygonDetailedDescription = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [expandable, setExpandable] = useState(false);

  useEffect(() => {
    // Set description
    if ((open || !item.expandable) && item.beskrivelse) {
      setDescription(item.beskrivelse);
    } else if (item.beskrivelse) {
      const text = item.beskrivelse.substring(0, 45);
      setDescription(text);
    } else {
      setDescription("");
    }
    // Set expandable
    if (item.expandable) {
      setExpandable(true);
    } else {
      setExpandable(false);
    }
  }, [item, open]);

  return (
    <>
      {expandable && (
        <div
          className={
            open
              ? "polygon-details-description-wrapper-open"
              : "polygon-details-description-wrapper"
          }
          tabIndex="0"
          role="button"
          onClick={() => setOpen(!open)}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              setOpen(!open);
            }
          }}
        >
          <div
            className={
              open
                ? "polygon-details-description-text-open"
                : "polygon-details-description-text"
            }
          >
            {description}
          </div>
          <div
            className={
              open
                ? "polygon-details-description-link-open"
                : "polygon-details-description-link"
            }
          >
            {open ? "Les mindre" : "Les mer"}
          </div>
        </div>
      )}
      {!expandable && (
        <div className="polygon-details-description-wrapper-fixed">
          <div className="polygon-details-description-text-fixed">
            {description}
          </div>
        </div>
      )}
    </>
  );
};

export default PolygonDetailedDescription;
