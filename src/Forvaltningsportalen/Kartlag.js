import React from "react";
import { useParams, useHistory } from "react-router";
import "../style/kartknapper.css";
import "../style/kartlagfane.css";
import ForvaltningsElement from "./ForvaltningsKartlag/ForvaltningsElement";
import { KeyboardBackspace } from "@material-ui/icons";
import ExpandedHeader from "./FeatureInfo/ExpandedHeader";

const Kartlag = ({ kartlag, punkt, onUpdateLayerProp }) => {
  let { id } = useParams();
  const history = useHistory();
  console.log({ kartlag, id, punkt });
  const valgtLag = kartlag[id];
  if (!valgtLag) return null;
  return (
    <div>
      Kartlag {id}
      <div className="valgtLag">
        <button
          className="listheadingbutton"
          onClick={e => {
            history.push("/");
          }}
        >
          <KeyboardBackspace />
          <span>Tilbake</span>
        </button>

        {punkt.faktaark_url && (
          <>
            <ExpandedHeader
              visible={true}
              geonorge={kartlag.geonorge}
              url={punkt.faktaark_url}
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
                src={punkt.faktaark_url}
              />
            )}
          </>
        )}
        <ForvaltningsElement
          valgt={true}
          kartlag_key={id}
          kartlag={valgtLag}
          key={valgtLag.id}
          onUpdateLayerProp={onUpdateLayerProp}
        />
      </div>
    </div>
  );
};

export default Kartlag;
