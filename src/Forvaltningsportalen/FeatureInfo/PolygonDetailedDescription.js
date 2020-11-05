import React, { useState, useEffect } from "react";
import "../../style/infobox.css";

const PolygonDetailedDescription = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open && item.beskrivelse) {
      setDescription("Beskrivelse: " + item.beskrivelse);
    } else if (item.beskrivelse) {
      const text = "Beskrivelse: " + item.beskrivelse.substring(0, 30);
      setDescription(text);
    } else {
      setDescription("");
    }
  }, [item, open]);

  return (
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
  );
};

export default PolygonDetailedDescription;
