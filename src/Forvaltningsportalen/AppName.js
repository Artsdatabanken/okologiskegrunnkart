import React from "react";
import "../style/appname.css";
import { Snackbar, Button, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const AppName = ({
  showAppName,
  closeAppName,
  showAboutModal,
  handleAboutModal,
  aboutPage,
  showInfobox,
  isMobile
}) => {
  const formattedAboutPage = () => {
    if (!aboutPage || aboutPage === "") {
      return [];
    }
    const array = aboutPage.split(/\r?\n/);
    const items = [];
    for (const [index, value] of array.entries()) {
      if (!value || value === "") {
        continue;
      } else if (value.startsWith("## ")) {
        items.push(
          <p key={index} className="help-text-line-header">
            {value.substring(3, value.length)}
          </p>
        );
      } else {
        items.push(
          <p key={index} className="help-text-line">
            {value}
          </p>
        );
      }
    }
    return items;
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
        <div
          className={
            !isMobile && showInfobox
              ? "app-name-wrapper centered"
              : "app-name-wrapper"
          }
        >
          <div className="app-name-text">Økologiske grunnkart</div>
          <Button
            id="read-more-about"
            variant="contained"
            size="small"
            onClick={() => {
              closeAppName();
              handleAboutModal(true);
            }}
            color="primary"
          >
            Mer info
          </Button>
        </div>
      </Snackbar>

      <Modal
        open={showAboutModal}
        onClose={() => handleAboutModal(false)}
        className="help-modal-body"
      >
        <div className="help-modal-wrapper">
          <div className="help-modal-title">
            <div>Om "Økologiske Grunnkart"</div>
            <button
              tabIndex="0"
              className="close-modal-button-wrapper"
              onClick={() => handleAboutModal(false)}
            >
              <div className="close-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="help-modal-content">{formattedAboutPage()}</div>
        </div>
      </Modal>
    </>
  );
};

export default AppName;
