import React from "react";
import { Chip, ListSubheader, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from "@material-ui/icons/Save";
import WmsLayerList from "./LayerList";
import TextField2 from "./TextField2";
import TjenesteType from "./TjenesteType";
import KlikkIKart from "./KlikkkIKart";
import Warnings from "./Warnings";

const Tjeneste = ({ doc, onUpdate, onSave, feature, setFeature }) => {
  if (doc.error)
    return (
      <Alert style={{ marginTop: 64 }} severity="error">
        {doc.error} />
      </Alert>
    );

  return (
    <form noValidate autoComplete="off" style={{ _overflow: "hidden" }}>
      <div style={{ backgroundColor: "#eee", padding: 8 }}>
        {false && (
          <TjenesteType
            title="Type"
            dockey="type"
            doc={doc}
            onUpdate={onUpdate}
          />
        )}
        <TextField2
          title="Kartdata / WMS / API URL"
          dockey="wmsurl"
          doc={doc}
          onUpdate={onUpdate}
        />
        <Warnings doc={doc} />
        {false && <Capabilities caps={doc.wms_capabilities} />}
        <TextField2
          title="WMS version"
          dockey="wmsversion"
          doc={doc}
          onUpdate={onUpdate}
        />
        <TextField2
          title="Projeksjon"
          dockey="crs"
          doc={doc}
          onUpdate={onUpdate}
        />
        <TextField2
          title="Featureinfo format"
          dockey="wmsinfoformat"
          doc={doc}
          onUpdate={onUpdate}
        />
        {false && (
          <>
            <TextField2
              title="Tittel"
              dockey="tittel"
              doc={doc}
              onUpdate={onUpdate}
            />
            <TextField2
              title="Dataeier"
              dockey="dataeier"
              doc={doc}
              onUpdate={onUpdate}
            />
            <TextField2
              title="Kilde URL"
              dockey="kildeurl"
              doc={doc}
              onUpdate={onUpdate}
            />
            <TextField2
              title="Produktark"
              dockey="produktark"
              doc={doc}
              onUpdate={onUpdate}
            />
            <TextField2
              title="Faktaark"
              dockey="faktaark"
              doc={doc}
              onUpdate={onUpdate}
            />
            <TextField2
              title="Geonorge"
              dockey="geonorgeurl"
              doc={doc}
              onUpdate={onUpdate}
            />
          </>
        )}
        <KlikkIKart
          doc={doc}
          onUpdate={onUpdate}
          feature={feature}
          setFeature={setFeature}
        />
        {false && <Tags tags={doc.tags} />}
        <Button
          style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
          onClick={onSave}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
        >
          Oppdater feltene under i Django
        </Button>
      </div>
    </form>
  );
};

const Capabilities = ({ caps }) => {
  if (!caps || !caps.status) return null;
  if (!caps.Service) return null;
  const { Capability } = caps;
  return <WmsLayerList caps={Capability} />;
};

const Tags = ({ tags }) => {
  return (
    <>
      <ListSubheader>Tags</ListSubheader>
      {(tags || []).map((tag) => (
        <Chip
          label={tag}
          key={tag}
          style={{ margin: 4 }}
          clickable
          color="primary"
          onDelete={() => {}}
          deleteIcon={<DoneIcon />}
          onClick={() => {}}
        />
      ))}
    </>
  );
};

export default Tjeneste;
