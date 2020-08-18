import React from "react";
import { Paper, Tabs, Tab, Button } from "@material-ui/core";
import Tjeneste from "./Tjeneste";
import TextField2 from "./TextField2";
import { Create as CreateIcon, Save as SaveIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import KartlagListItem from "./KartlagListItem";
import KlikkResultatPreview from "./KlikkResultatPreview";

const MainTabs = ({
  tab,
  setTab,
  doc,
  id,
  feature,
  setFeature,
  setDoc,
  onUpdate,
  onUpdateLayerField,
  sub,
  selectedLayerIndex,
  writeUpdateLayer,
  writeUpdateSublayer
}) => {
  const history = useHistory();
  if (!doc) return null;
  if (!doc.underlag) return null;
  const layer = doc.underlag[selectedLayerIndex];
  return (
    <>
      {tab === 0 && (
        <TabPanel value={tab} index={0}>
          <TextField2
            title="WMS URL"
            dockey="wmsurl"
            doc={doc}
            onUpdate={onUpdate}
          />
          <TextField2
            title="WMS version"
            dockey="wmsversion"
            doc={doc}
            onUpdate={onUpdate}
          />
          <TextField2
            title="Projeksjon"
            dockey="projeksjon"
            doc={doc}
            onUpdate={onUpdate}
          />
          <TextField2
            title="API URL (hvis tom brukes WMS url)"
            dockey="klikkurl"
            doc={doc}
            onUpdate={onUpdate}
          />
          <TextField2
            title="Featureinfo format"
            dockey="wmsinfoformat"
            doc={doc}
            onUpdate={onUpdate}
          />
          <TextField2
            title="Faktaark URL"
            dockey="faktaark"
            doc={doc}
            onUpdate={onUpdate}
            onIconClick={() => {
              history.push(`?id=${doc._id}&sub=faktaark`);
            }}
            icon={<CreateIcon />}
          />
          <Button
            style={{ width: 476, margin: 16 }}
            onClick={() => writeUpdateLayer()}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
          >
            Oppdater feltene over i Django
          </Button>
        </TabPanel>
      )}
      {tab === 1 && (
        <TabPanel value={tab} index={1}>
          <KartlagListItem layer={layer} />
          {doc && (
            <>
              <Tjeneste
                key={id}
                doc={doc}
                feature={feature}
                setFeature={setFeature}
                onSetDoc={setDoc}
                onUpdateLayerField={onUpdateLayerField}
                onSave={() => writeUpdateSublayer(selectedLayerIndex, layer)}
                sub={sub}
                selectedLayerIndex={selectedLayerIndex}
              />
              <KlikkResultatPreview layer={layer} feature={feature} />
            </>
          )}
        </TabPanel>
      )}
      <Paper square style={{ position: "fixed", bottom: 0, width: 508 }}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={(e, v) => setTab(v)}
          aria-label="disabled tabs example"
        >
          <Tab label="WMS" />
          <Tab label="Layers" />
        </Tabs>
      </Paper>
    </>
  );
};

const TabPanel = ({ children }) => (
  <div
    style={{
      overflowY: "auto",
      backgroundColor: "rgb(250, 250, 250)",
      _padding: 16,
      paddingBottom: 64
    }}
  >
    {children}
  </div>
);

export default MainTabs;
