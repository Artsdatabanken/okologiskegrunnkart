import React, { useState } from "react";
import {
  Button,
  TextField,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import geography from "../geography";
import { useHistory } from "react-router-dom";
import { Error } from "@material-ui/icons";

const LastOpp = ({ onPreviewGeojson, onAddLayer }) => {
  const history = useHistory();
  const [metadata, setMetadata] = useState({});
  const [geojson, setGeojson] = useState({ nogood: true });
  const [status, setStatus] = useState({});
  const handleUpload = event => {
    const file = event.target.files[0];
    setMetadata({
      name: file.name,
      length: file.size,
      lastModfied: file.lastModified
    });
    setStatus({});
    var filereader = new FileReader();
    filereader.onloadend = handleFileComplete;
    filereader.readAsText(file);
  };

  const handleFileComplete = e => {
    try {
      const data = e.target.result;
      var json = JSON.parse(data);
      if (!json.features) throw new Error("Ikke en GeoJSON fil.");
      json.bounds = geography.bbox(json);
      console.log({ metadata });
      console.log({ json });
      setGeojson(json);
      onPreviewGeojson(json);
      setStatus({ ok: true });
    } catch (err) {
      setStatus({ error: true, message: err.message });
    }
  };

  const onOK = () => {
    const src = Object.assign(metadata, geojson);
    const layer = {
      [src.name]: {
        id: src.name,
        tittel: src.name,
        kart: { format: { geojson: { data: src } } },
        underlag: {}
      }
    };
    console.log({ layer });
    onAddLayer(layer);
    history.push("/");
  };

  return (
    <>
      <ListSubheader disableSticky>Last opp en GeoJSON fil</ListSubheader>
      <ListItem>
        <input type="file" name="file" onChange={handleUpload} />
      </ListItem>
      {status.ok && (
        <>
          <ListItem>
            <ListItemAvatar>
              <CheckCircle style={{ color: "rgb(49, 202, 83)" }} />
            </ListItemAvatar>
            <ListItemText>
              {geojson.features.length} egenskaper lest.
            </ListItemText>
          </ListItem>
          <ListSubheader disableSticky>sfds</ListSubheader>
          <ListItem>
            <TextField
              style={{ width: "100%" }}
              required
              label="Navn på kartlaget"
              defaultValue={geojson.name}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" onClick={onOK}>
              OK
            </Button>
          </ListItem>
        </>
      )}
      {status.error && (
        <ListItem>
          <ListItemAvatar>
            <Error style={{ color: "rgb(202, 49, 83)" }} />
          </ListItemAvatar>
          <ListItemText>{status.message}</ListItemText>
        </ListItem>
      )}
    </>
  );
};

export default LastOpp;
