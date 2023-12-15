import React, { useEffect } from "react";
import "../style/appname.css";
import { Snackbar, Button, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";

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
        const matches = value.matchAll(
          /\((?<link>.*?)\)|\[(?<linkname>.*?)\]/g
        );
        let allmatches = Array.from(matches);
        allmatches = allmatches.map(e => {
          const r = e.groups;
          return r;
        });
        let links = allmatches.map(e => {
          if (e.link) return e.link;
          return null;
        });
        let linknames = allmatches.map(e => {
          if (e.linkname) return e.linkname;
          return null;
        });
        links = links.filter(e => e != null);
        linknames = linknames.filter(e => e != null);
        if (links.length > 0 && linknames.length > 0) {
          let text = value;
          let elements = [];
          for (let i = 0; i < links.length; i++) {
            text = text.split("[" + linknames[i] + "](" + links[i] + ")");
            if (text.length > 1) {
              elements.push(text[0]);
              text = text[1];
            } else {
              elements.push(text[0]);
              text = text[0];
            }
          }
          let elementsWithLinks = [];
          for (let i = 0; i < elements.length; i++) {
            if (links[i]) {
              elementsWithLinks.push(
                <span key={i}>
                  {elements[i]}
                  <a
                    key={i}
                    className="help-text-link"
                    href={links[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linknames[i]}
                  </a>
                </span>
              );
            } else {
              elementsWithLinks.push(<>{elements[i]}</>);
            }
          }
          items.push(
            <p key={index + "-" + linknames[0]} className="help-text-line">
              {elementsWithLinks}
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
    }
    return items;
  };

  useEffect(() => {
    if (isMobile) {
      closeAppName();
    }
  }, [isMobile, closeAppName]);

  return (
    <>
      {!isMobile && (
        <Snackbar
          id="app-name-snackbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={showAppName}
          onClose={() => closeAppName()}
          aria-label="Appname"
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
      )}

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
