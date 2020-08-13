import React from "react";
import TextField2 from "./TextField2";
import Klikktekster from "./Klikktekster";

const Underlag = ({ underlag, feature, onUpdate, selectedLayerIndex }) => {
  const layer = underlag[selectedLayerIndex];
  if (!layer) return null;
  return (
    <>
      <Klikktekster
        underlag={layer}
        selectedLayerIndex={selectedLayerIndex}
        feature={feature}
        onUpdate={onUpdate}
      />
      <TextField2
        title="Testkoordinater for klikk i kart (˚Ø,˚N)"
        dockey="testkoordinater"
        doc={layer}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default Underlag;
