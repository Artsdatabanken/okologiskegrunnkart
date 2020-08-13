import React from "react";
import { ListSubheader } from "@material-ui/core";
import TextField2 from "./TextField2";
import Klikktekster from "./Klikktekster";
const { useHistory } = require("react-router-dom");

const Underlag = ({ underlag, feature, onUpdate, selectedLayerIndex }) => {
  const history = useHistory();
  const layer = underlag[selectedLayerIndex];
  if (!layer) return null;
  //  const onUpdate = (key, value) => {
  //    console.log({ key, value });
  //  };
  const handleChangeSelectedLayer = index => {
    const url = new URL(window.location);
    url.searchParams.set("ulid", index);
    history.push(url.search);
  };
  return (
    <>
      <ListSubheader disableSticky>Kartlag</ListSubheader>
      <div style={{ marginLeft: 24, marginRight: 24 }}>
        {underlag.map((ul, index) => {
          const isSelected = index === selectedLayerIndex;
          return (
            <span
              key={ul.wmslayer}
              style={{
                cursor: "pointer",
                margin: 4,
                fontWeight: isSelected && "bold"
              }}
              onClick={() => handleChangeSelectedLayer(index)}
            >
              {isSelected ? "[" + ul.tittel + "]" : ul.tittel}
            </span>
          );
        })}
      </div>
      <ListSubheader disableSticky>{layer.tittel}</ListSubheader>
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
