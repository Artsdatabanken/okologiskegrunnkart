import { ImportContacts, OpenInNew } from "@material-ui/icons";
import { Button, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState } from "react";

const ExpandedHeader = ({ visible, geonorge, url, type }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="expand_header">
        {url && (
          <>
            <Button
              id="infobox-detail-facts"
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => {
                setShowModal(true);
              }}
              endIcon={<ImportContacts />}
            >
              Vis faktaark
            </Button>
            <Button
              id="infobox-detail-facts-new"
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => window.open(url)}
              endIcon={<OpenInNew />}
            >
              Åpne faktaark i nytt vindu
            </Button>
          </>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        className="facts-modal-body"
      >
        <div className="facts-modal-wrapper">
          <div className="facts-modal-title">
            <div>Faktaark</div>
            <div>
              <button
                tabIndex="0"
                className="close-modal-button-wrapper"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <div className="close-modal-button">
                  <Close />
                </div>
              </button>
            </div>
          </div>
          {type !== "naturtype" && (
            <iframe
              className="facts-modal-content"
              allowtransparency="true"
              title="Faktaark"
              src={url}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ExpandedHeader;
