import React from "react";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import DrmInfestedLeaflet from "./Kart/DrmInfestedLeaflet";
import FeaturePicker from "./FeaturePicker";
import { getFeatureInfo, getCapabilities } from "./probe";
import { Switch, Route, useLocation } from "react-router-dom";
import Tjeneste from "./Tjeneste";
import KartlagList from "./KartlagList";
import KartlagListItem from "./KartlagListItem";
import { plukkForetrukketFormat, selectCrs } from "./wms";
import url_formatter from "./FeatureInfo/url_formatter";
import backend from "./Funksjoner/backend";
import { Alert } from "@material-ui/lab";

const kartlagUrl =
  "https://forvaltningsportal.test.artsdatabanken.no/kartlag.json";

export default function TjenesteContainer() {
  const location = useLocation();
  const [feature, setFeature] = useState();
  const [doc, setDoc] = useState({});
  const [kartlag, setKartlag] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showForbidden, setShowForbidden] = useState(false);

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || 1;
  const sub = params.get("sub");
  const { wmsurl, wmsversion } = doc || {};

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
        ul.id =
          alphaNumericOnly(doc.tittel) + "_" + alphaNumericOnly(ul.tittel);

        ul.queryable = true;
      }); // HACK
      // console.log("underlag", doc.underlag);
      setDoc(doc);
    };
    dl();
  }, [id]);

  const testkoords = doc?.testkoordinater;
  const underlag = doc?.underlag;

  const writeUpdate = () => {
    backend.updateLayer(doc._id, doc).then(({ response, layer }) => {
      if (response.ok) {
        setShowSuccess(true);
        const newLayer = {
          ...kartlag[id],
          klikktekst: layer.klikktekst || "",
          klikktekst2: layer.klikktekst2 || "",
          testkoordinater: layer.testkoordinater || "",
          faktaark: layer.faktaark || ""
        };
        const newKartlag = { ...kartlag, [id]: newLayer };
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

  const updateCallback = useCallback(
    capabilities => {
      const updateDoc = layer => {
        setDoc(doc => {
          return { ...doc, ...layer };
        });
      };

      const layer = {
        wms_capabilities: capabilities
      };
      const capability = capabilities.Capability;
      const service = capabilities.Service || {};
      if (capability) {
        const uri = new URL(wmsurl);
        uri.searchParams.delete("service");
        uri.searchParams.delete("request");
        layer.wmsurl = uri.toString();
        layer.type = "wms";
        layer.tittel = layer.tittel || service.Title;
        layer.abstract = layer.abstract || service.Abstract;
        layer.dataeier =
          layer.dataeier ||
          service.ContactInformation?.ContactPersonPrimary?.ContactOrganization;
        layer.wmsversion = capabilities.version;

        layer.crs = selectCrs(capability);
        if (!layer.wmsinfoformat)
          layer.wmsinfoformat = plukkForetrukketFormat(
            capability.Request.GetFeatureInfo.Format
          );
        layer.wmslayers = [];
        fyllPåUnderlag(capability.Layer, layer.wmslayers);
        // console.log("nyeunderlag", layer.underlag);
      }
      updateDoc(layer);
    },
    [wmsurl]
  );

  useEffect(() => {
    async function doprobe() {
      if (!wmsurl) return;
      const r = await getCapabilities(wmsurl);
      updateCallback(r);
    }
    if (wmsurl) doprobe();
    else updateCallback({});
  }, [wmsurl, updateCallback]);

  const handleUpdate = (k, v) => {
    const newDoc = { ...doc, [k]: v };
    // console.log("onUpdate", k, v);
    // console.log("newdoc", newDoc);
    setDoc(newDoc);
  };

  useEffect(() => {
    async function doprobe() {
      if (!doc || !doc.wmsurl) return null;
      if (!testkoords) return null;
      const delta = 0.01;
      const koords = doc.testkoordinater.split(",").map(e => parseFloat(e));
      if (koords.length !== 2) return;
      const [lat, lng] = koords;
      const bbox = [lng - delta, lat - delta, lng + delta, lat + delta];
      try {
        console.log("klikkurl", doc.klikkurl);
        if (doc.klikkurl) {
          const variables = { lng: lat, lat: lng, zoom: 10 };
          doc.klikk_testurl = url_formatter(doc.klikkurl, variables);
          // console.log(doc.klikk_testurl);
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
          // console.log("underlag", doc.underlag);
          const enabledLayers = doc.underlag
            .filter(lag => lag.queryable)
            .map(lag => lag.wmslayer);
          // console.log("querylayers", enabledLayers);
          uri.searchParams.set("layers", enabledLayers);
          uri.searchParams.set("query_layers", enabledLayers);
          uri.searchParams.set("info_format", doc.wmsinfoformat);
          uri.searchParams.set("crs", "EPSG:4326");
          uri.searchParams.set("srs", "EPSG:4326");
          doc.klikk_testurl = uri.toString();
        }
        const r = await getFeatureInfo(doc.klikk_testurl);
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
  }, [doc, doc.klikkurl, wmsversion, testkoords, underlag]);

  if (!doc) return <CircularProgress />;
  return (
    <>
      <DrmInfestedLeaflet
        layer={doc}
        onClick={(lng, lat) => handleUpdate("testkoordinater", lng + "," + lat)}
        latitude={63}
        longitude={10}
      />
      <div
        style={{
          height: "100%",
          width: 508,
          float: "left",
          _position: "fixed",
          _zIndex: 1,
          _right: 0,
          _top: 0,
          _overflowX: "hidden",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
          _overflowY: "scroll"
        }}
      >
        <Switch>
          <Route
            path="/kartlag"
            component={() => <KartlagList kartlag={kartlag} />}
          />
          <Route
            path="/"
            component={() => (
              <>
                <KartlagListItem doc={doc}></KartlagListItem>
                <Tjeneste
                  key={id}
                  doc={doc}
                  feature={feature}
                  setFeature={setFeature}
                  onSetDoc={setDoc}
                  onUpdate={handleUpdate}
                  onSave={() => writeUpdate(doc)}
                  sub={sub}
                />
              </>
            )}
          />
        </Switch>
        {sub === "kartlag" && <KartlagList kartlag={kartlag} />}
        {sub && sub.length > 0 && (
          <FeaturePicker
            feature={feature}
            variabel={sub}
            doc={doc}
            picker={sub}
            onUpdate={handleUpdate}
            onClick={v => {
              handleUpdate(sub, (doc[sub] || "") + " {" + v + "}");
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

function fyllPåUnderlag(layer, underlag) {
  if (layer.Name)
    underlag.push({
      erSynlig: false,
      wmslayer: layer.Name,
      tittel: layer.Title,
      queryable: layer.queryable
    });
  if (!layer.Layer) return;
  var ll = layer.Layer;
  if (!Array.isArray(ll)) ll = [ll];
  for (var sublayer of ll) fyllPåUnderlag(sublayer, underlag);
}
