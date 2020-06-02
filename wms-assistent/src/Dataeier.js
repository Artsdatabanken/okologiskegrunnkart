import { useGet } from "react-pouchdb/browser";
import { useDB } from "react-pouchdb/browser";
import { InputAdornment, TextField, ListSubheader } from "@material-ui/core";
import OpenInNew from "@material-ui/icons/OpenInNew";

export default function Dataeier({ match }) {
  const id = match.params.key;
  const doc = useGet({
    id: id,
  });
  console.log(id, doc);
  return <EditItem2 key={id} doc={doc} />;
}

const EditItem2 = ({ doc }) => {
  const { put } = useDB();

  const update = (key, value) => {
    console.log("update", key, value);
    put({
      ...doc,
      [key]: value,
    });
  };

  return (
    <form noValidate autoComplete="off">
      <div>
        <ListSubheader>Dataeier {doc.tittel}</ListSubheader>
        <TextField2
          title="Tittel"
          dockey="tittel"
          doc={doc}
          onUpdate={update}
        />
        <TextField2
          title="Hjemmeside"
          dockey="url"
          doc={doc}
          onUpdate={update}
        />
        <TextField2 title="Logo" dockey="logourl" doc={doc} onUpdate={update} />
        {doc.logourl && (
          <img
            alt="logo"
            style={{
              backgroundColor: "#ddd",
              padding: 8,
              marginLeft: 16,
              maxWidth: "80%",
            }}
            src={doc.logourl}
          />
        )}
      </div>
    </form>
  );
};

const TextField2 = ({ title, dockey, doc, onUpdate }) => {
  const inputProps =
    (doc[dockey] || "").indexOf("http") === 0
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <a href={doc[dockey]} target="_blank" rel="noopener noreferrer">
                <OpenInNew />
              </a>
            </InputAdornment>
          ),
        }
      : {};
  return (
    <TextField
      label={title}
      variant="filled"
      defaultValue={doc[dockey]}
      style={{ marginBottom: 8, width: "100%" }}
      onChange={(e) => onUpdate(dockey, e.target.value)}
      InputProps={inputProps}
    />
  );
};
