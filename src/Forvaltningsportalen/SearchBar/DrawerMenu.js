import React, { useState, useEffect } from "react";
import {
  Done,
  Close,
  Map,
  MenuBook,
  Layers,
  Forward,
  Folder
} from "@material-ui/icons";
import {
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Modal,
  Drawer
} from "@material-ui/core";
import backend from "../../Funksjoner/backend";
import CustomIcon from "../../Common/CustomIcon";

const DrawerMenu = ({
  openDrawer,
  handleCloseDrawer,
  handleAboutModal,
  showFavoriteLayers,
  toggleShowFavoriteLayers,
  toggleEditLayers,
  uploadPolygonFile,
  getSavedPolygons
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [manual, setManual] = useState("");

  const openHelp = () => {
    // returnerer brukermanualen fra wiki
    backend.getUserManualWiki().then(manual => {
      setShowHelpModal(true);
      setManual(manual);
    });
  };

  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const formattedManual = () => {
    if (!manual || manual === "") {
      return [];
    }
    const array = manual.split(/\r?\n/);
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
                <>
                  {elements[i]}
                  <a href={links[i]} target="_blank" rel="noopener noreferrer">
                    {linknames[i]}
                  </a>
                </>
              );
            } else {
              elementsWithLinks.push(<>{elements[i]}</>);
            }
          }
          items.push(
            <p key={index} className="help-text-line">
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

  return (
    <>
      <Drawer
        id="settings-drawer"
        anchor="right"
        keepMounted
        open={openDrawer}
        onClose={handleCloseDrawer}
      >
        <ListItem id="settings-drawer-titel">
          <button
            tabIndex="0"
            className="close-drawer-button-wrapper"
            onClick={() => {
              console.log("Click in button");
              handleCloseDrawer();
            }}
          >
            <div className="close-drawer-button">
              <CustomIcon
                id="drawer-minimize"
                icon="chevron-doble-right"
                color="#fff"
                size={24}
              />
            </div>
          </button>
          <ListItemText primary={"Økologiske grunnkart"} />
        </ListItem>

        <MenuItem
          id="settings-drawer-user-manual"
          onClick={() => {
            handleAboutModal(true);
            handleCloseDrawer();
          }}
          tabIndex="0"
        >
          <ListItemIcon id="drawer-item-icon">
            <Map />
          </ListItemIcon>
          <ListItemText primary={`Om "Økologiske Grunnkart"`} />
        </MenuItem>

        <MenuItem
          id="settings-drawer-about-info"
          onClick={() => {
            openHelp();
            handleCloseDrawer();
          }}
          tabIndex="0"
        >
          <ListItemIcon id="drawer-item-icon">
            <MenuBook />
          </ListItemIcon>
          <ListItemText primary="Brukermanual" />
        </MenuItem>

        <Divider variant="fullWidth" />

        <MenuItem
          id="settings-drawer-favourite-kartlag"
          onClick={() => {
            toggleShowFavoriteLayers(true);
          }}
          selected={showFavoriteLayers}
          tabIndex="0"
        >
          <ListItemText primary="Vis favoritt kartlag" />
          <ListItemIcon id="filter-layers-menu-icon">
            {showFavoriteLayers ? <Done fontSize="small" /> : <div />}
          </ListItemIcon>
        </MenuItem>

        <MenuItem
          id="settings-drawer-all-kartlag"
          onClick={() => {
            toggleShowFavoriteLayers(false);
          }}
          selected={!showFavoriteLayers}
          tabIndex="0"
        >
          <ListItemText primary="Vis fullstendig kartlag" />
          <ListItemIcon id="filter-layers-menu-icon">
            {!showFavoriteLayers ? <Done fontSize="small" /> : <div />}
          </ListItemIcon>
        </MenuItem>

        <MenuItem
          id="settings-drawer-edit-kartlag"
          onClick={() => {
            toggleEditLayers();
            handleCloseDrawer();
          }}
          tabIndex="0"
        >
          <ListItemIcon id="drawer-item-icon">
            <Layers />
          </ListItemIcon>
          <ListItemText primary="Editere favoritt kartlag" />
        </MenuItem>

        <Divider variant="fullWidth" />

        <MenuItem
          id="settings-drawer-upload-polygon"
          onClick={() => {
            uploadPolygonFile("menu");
            handleCloseDrawer();
          }}
          tabIndex="0"
        >
          <ListItemIcon id="drawer-item-icon">
            <Forward style={{ transform: "rotate(-90deg)" }} />
          </ListItemIcon>
          <ListItemText primary="Laste opp polygon" />
        </MenuItem>

        <MenuItem
          id="settings-drawer-saved-polygon"
          onClick={() => {
            getSavedPolygons();
            handleCloseDrawer();
          }}
          tabIndex="0"
        >
          <ListItemIcon id="drawer-item-icon">
            <Folder />
          </ListItemIcon>
          <ListItemText primary="Åpne lagret polygon" />
        </MenuItem>
      </Drawer>

      <Modal
        open={showHelpModal}
        onClose={closeHelpModal}
        className="help-modal-body"
      >
        <div className="help-modal-wrapper">
          <div className="help-modal-title">
            <div>Brukermanual</div>
            <button
              tabIndex="0"
              className="close-modal-button-wrapper"
              onClick={e => {
                closeHelpModal();
              }}
            >
              <div className="close-modal-button">
                <Close />
              </div>
            </button>
          </div>
          <div className="help-modal-content">{formattedManual()}</div>
        </div>
      </Modal>
    </>
  );
};

export default DrawerMenu;
