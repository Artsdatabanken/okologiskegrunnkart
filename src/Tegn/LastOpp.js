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

const LastOpp = ({ onPreviewGeojson, onAddLayer }) => {
  const history = useHistory();
  const [metadata, setMetadata] = useState({});
  const [geojson, setGeojson] = useState({ nogood: true });
  const [successfulLoad, setSuccessfulLoad] = useState();
  const handleUpload = event => {
    const file = event.target.files[0];
    setMetadata({
      name: file.name,
      length: file.size,
      lastModfied: file.lastModified
    });
    setSuccessfulLoad(false);
    var filereader = new FileReader();
    filereader.onloadend = handleFileComplete;
    filereader.readAsText(file);
  };

  const handleFileComplete = e => {
    const data = e.target.result;
    var json = JSON.parse(data);
    json.bounds = geography.bbox(json);
    console.log({ metadata });
    console.log({ json });
    setGeojson(json);
    onPreviewGeojson(json);
    setSuccessfulLoad(true);
  };

  const onOK = e => {
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
      {successfulLoad && (
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
    </>
  );
};

export default LastOpp;
