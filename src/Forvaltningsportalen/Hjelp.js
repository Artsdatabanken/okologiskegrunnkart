import React, { useState, useEffect } from "react";
import backend from "../Funksjoner/backend";

const Hjelp = () => {
  const [manual, setManual] = useState();
  useEffect(() => {
    // returnerer brukermanualen fra wiki
    backend.getUserManualWiki().then(manual => {
      const array = manual.split(/\r?\n/);
      const items = [];
      for (const [index, value] of array.entries()) {
        if (!value || value === "") {
          continue;
        } else if (value.startsWith("## ")) {
          items.push(
            <p key={index} className="help-text-line-header">
              {value.substring(3, value.length)}
            </p>
          );
        } else {
          items.push(
            <p key={index} className="help-text-line">
              {value}
            </p>
          );
        }
      }
      setManual(items);
    });
  }, []);

  return (
    <div>
      <div className="help-modal-title">
        <div>Brukermanual</div>
      </div>
      <div className="help-modal-content">{manual}</div>
    </div>
  );
};

export default Hjelp;
