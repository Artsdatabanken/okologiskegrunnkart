import React from "react";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import DrmInfestedLeaflet from "./Kart/DrmInfestedLeaflet";
import FeaturePicker from "./FeaturePicker";
import { getFeatureInfo } from "./probe";
import { Switch, Route, useLocation } from "react-router-dom";
import Kartlagliste from "./Kartlagliste";
import Tjenesteliste from "./Tjenesteliste";
import TjenesteListItem from "./TjenesteListItem";
import url_formatter from "./FeatureInfo/url_formatter";
import backend from "./Funksjoner/backend";
import { Alert } from "@material-ui/lab";
import MainTabs from "./MainTabs";

const kartlagUrl =
  "https://forvaltningsportal.test.artsdatabanken.no/kartlag.json";

export default function TjenesteContainer() {
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [feature, setFeature] = useState();
  const [doc, setDoc] = useState({});
  const [kartlag, setKartlag] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showForbidden, setShowForbidden] = useState(false);

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || 1;
  const sub = params.get("sub");
  const selectedLayerIndex = parseInt(params.get("ulid")) || 0;

  const alphaNumericOnly = s => s.replace(/[^a-zA-Z0-9]/g, "");
  useEffect(() => {
    const dl = async () => {
      const response = await fetch(kartlagUrl);
      const kartlag = await response.json();
      setKartlag(kartlag);
      const doc = kartlag[id] || { error: "Finner ikke kartlag #" + id };
      doc._id = id;
      doc.underlag = Object.values(doc.underlag || {});
      Object.values(doc.underlag).forEach(ul => {
        ul.key = ul.id;
        ul.id =
          alphaNumericOnly(doc.tittel) + "_" + alphaNumericOnly(ul.tittel);

        ul.queryable = true;
      }); // HACK
      setDoc(doc);
    };
    dl();
  }, [id]);

  const writeUpdateLayer = () => {
    backend.updateLayer(doc._id, doc).then(({ response, layer }) => {
      if (response.ok) {
        setShowSuccess(true);
        const newKartlag = { ...kartlag };
        const newLayer = newKartlag[id];
        newLayer.klikktekst = layer.klikktekst || "";
        newLayer.klikktekst2 = layer.klikktekst2 || "";
        newLayer.testkoordinater = layer.testkoordinater || "";
        newLayer.faktaark = layer.faktaark || "";
        setKartlag(newKartlag);
      } else if (response.status === 403) {
        setShowForbidden(true);
      } else {
        setShowError(true);
      }
    });
  };

  const writeUpdateSublayer = (index, sublag) => {
    const subId = sublag.key;
    backend.updateSublayer(subId, sublag).then(({ response, sublayer }) => {
      if (response.ok) {
        setShowSuccess(true);
        const newKartlag = { ...kartlag };
        const newLayer = newKartlag[id];
        const newSublayer = newLayer.underlag[index];
        newSublayer.klikktekst = sublayer.klikktekst || "";
        newSublayer.klikktekst2 = sublayer.klikktekst2 || "";
        newSublayer.testkoordinater = sublayer.testkoordinater || "";
        setKartlag(newKartlag);
      } else if (response.status === 403) {
        setShowForbidden(true);
      } else {
        setShowError(true);
      }
    });
  };

  const closeSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false);
  };

  const closeError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
  };

  const closeForbidden = (event, reason) => {
    setShowForbidden(false);
  };

  const handleUpdate = (k, v) => {
    const newDoc = { ...doc, [k]: v };
    setDoc(newDoc);
  };

  const layer = (doc && doc.underlag && doc.underlag[selectedLayerIndex]) || {};

  useEffect(() => {
    async function doprobe() {
      if (!doc || !doc.wmsurl) return null;
      if (!layer.testkoordinater) return null;
      const delta = 0.01;
      const koords = layer.testkoordinater.split(",").map(e => parseFloat(e));
      if (koords.length !== 2) return;
      const [lat, lng] = koords;
      const bbox = [lng - delta, lat - delta, lng + delta, lat + delta];
      try {
        if (doc.klikkurl) {
          const variables = { lng: lat, lat: lng, zoom: 10 };
          doc.klikk_testurl = url_formatter(doc.klikkurl, variables);
        } else {
          // WMS
          const uri = new URL(doc.wmsurl);
          uri.searchParams.set("request", "GetFeatureInfo");
          uri.searchParams.set("service", "WMS");
          uri.searchParams.set("version", doc.wmsversion);
          uri.searchParams.set("bbox", bbox.join(","));
          uri.searchParams.set("x", 128);
          uri.searchParams.set("y", 128);
          uri.searchParams.set("width", 255);
          uri.searchParams.set("height", 255);
          uri.searchParams.set("layers", layer.wmslayer);
          uri.searchParams.set("query_layers", layer.wmslayer);
          uri.searchParams.set("info_format", doc.wmsinfoformat);
          uri.searchParams.set("crs", "EPSG:4326");
          uri.searchParams.set("srs", "EPSG:4326");
          doc.klikk_testurl = uri.toString();
        }
        const r = await getFeatureInfo(doc, doc.klikk_testurl);
        delete r.url;
        delete r.status;
        delete r.contentType;
        delete r["xmlns:gml"];
        delete r["xmlns:namespace"];
        delete r["xmlns:xlink"];
        delete r["xmlns:xsi"];
        setFeature(r);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    doprobe();
  }, [doc, doc.klikkurl, doc.wmsversion, layer]);

  const handleUpdateLayer = layer => {
    if (!doc.underlag) return;
    doc.underlag[selectedLayerIndex] = { ...layer };
    setDoc({ ...doc });
  };

  const handleUpdateLayerField = (key, value) => {
    layer[key] = value;
    handleUpdateLayer(layer);
  };
  if (!doc) return <CircularProgress />;
  return (
    <>
      <DrmInfestedLeaflet
        wms={doc}
        onClick={(lng, lat) =>
          handleUpdateLayerField("testkoordinater", lng + "," + lat)
        }
        latitude={63}
        longitude={10}
        selectedLayer={layer}
      />
      <div
        style={{
          height: "100%",
          width: 508,
          float: "left"
        }}
      >
        <Switch>
          <Route path="/tjeneste">
            <Tjenesteliste tjenester={kartlag} />
          </Route>
          <Route path="/kartlag">
            <Kartlagliste
              kartlag={doc.underlag}
              selectedLayerIndex={selectedLayerIndex}
            />
          </Route>

          <Route path="/">
            <TjenesteListItem doc={doc}></TjenesteListItem>
            <MainTabs
              tab={tab}
              setTab={setTab}
              key={id}
              doc={doc}
              feature={feature}
              setFeature={setFeature}
              onSetDoc={setDoc}
              onUpdate={handleUpdate}
              onUpdateLayerField={handleUpdateLayerField}
              writeUpdateLayer={writeUpdateLayer}
              writeUpdateSublayer={writeUpdateSublayer}
              sub={sub}
              selectedLayerIndex={selectedLayerIndex}
            />
          </Route>
        </Switch>
        {sub && sub.length > 0 && (
          <FeaturePicker
            feature={feature}
            variabel={sub}
            layer={layer}
            picker={sub}
            onUpdate={(key, value) => handleUpdateLayerField(key, value)}
            onClick={v => {
              layer[sub] = (layer[sub] || "") + " {" + v + "}";
              handleUpdateLayer(layer);
            }}
          ></FeaturePicker>
        )}
      </div>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={closeSuccess}
      >
        <Alert severity="success">Data lagret i databasen</Alert>
      </Snackbar>
      <Snackbar open={showError} autoHideDuration={3000} onClose={closeError}>
        <Alert severity="error">Kunne ikke lagre data i databasen</Alert>
      </Snackbar>
      <Snackbar
        open={showForbidden}
        autoHideDuration={10000}
        onClose={closeForbidden}
      >
        <Alert severity="error">
          Ikke tillatt. Logg inn i django admin, prøv så igjen...
        </Alert>
      </Snackbar>
    </>
  );
}
