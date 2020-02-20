import {
  OpenInNew
  //VisibilityOutlined,
  //VisibilityOffOutlined
} from "@material-ui/icons";
import //IconButton,
//Typography,
//Slider,
"@material-ui/core";
import React from "react";

const ExpandedHeader = props => {
  return (
    <div className="expand_header">
      {/*
      // Denne knappen både er feilplassert og virker ikke. Midlertidig avskrudd.
      <IconButton
        onClick={e => {
          if (props.onUpdateLayerProp)
            props.onUpdateLayerProp(props.kode, "erSynlig", !props.erSynlig);
          e.stopPropagation();
        }}
      >
        {props.erSynlig ? (
          <VisibilityOutlined style={{ color: "#333" }} />
        ) : (
          <VisibilityOffOutlined style={{ color: "#aaa" }} />
        )}
      </IconButton>

    */}
      {/*
      // Funksjon midlertidig fraværende
      <div style={{ float: "right",background:"hotpink" }}>
        <div style={{ position: "relative" }}>
          <Typography id="range-slider" gutterBottom variant="caption">
            Gjennomsiktighet
          </Typography>
        </div>
        <Slider
          disabled={!props.erSynlig}
          style={{ width: 240, marginLeft: 4, marginTop: 0 }}
          value={100 * props.opacity}
          step={1}
          min={0}
          max={100}
          onChange={(e, v) =>
            props.onUpdateLayerProp &&
            props.onUpdateLayerProp(props.kode, "opacity", v / 100.0)
          }
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          getAriaValueText={opacity => opacity + " %"}
        />
      </div>
    */}
      {props.url && (
        <button onClick={() => window.open(props.url)}>
          Åpne faktaark i nytt vindu <OpenInNew />
        </button>
      )}
    </div>
  );
};

export default ExpandedHeader;
