import React, { useState } from "react";
import "../style/appname.css";
import { Snackbar, Button, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const AppName = ({ showAppName, closeAppName }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const openAboutModal = () => {
    setShowAboutModal(true);
    console.log("Opening");
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={showAppName}
        onClose={() => closeAppName()}
      >
        <div className="app-name-wrapper">
          <div className="app-name-text">Økologiske grunnkart</div>
          <Button
            id="read-more-about"
            variant="contained"
            size="small"
            onClick={() => openAboutModal()}
            color="primary"
          >
            Mer info
          </Button>
        </div>
      </Snackbar>

      <Modal
        open={showAboutModal}
        onClose={closeAboutModal}
        className="help-modal-body"
      >
        <div className="help-modal-wrapper">
          <div className="help-modal-title">
            <div>Om "Økologiske Grunnkart"</div>
            <button
              tabIndex="0"
              className="close-modal-button-wrapper"
              onClick={e => {
                closeAboutModal();
              }}
            >
              <div className="close-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="help-modal-content">This is a description</div>
        </div>
      </Modal>
    </>
  );
};

export default AppName;
