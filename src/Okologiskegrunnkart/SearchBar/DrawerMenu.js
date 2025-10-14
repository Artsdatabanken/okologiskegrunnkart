import React, { useState } from "react";
import {
  Done,
  Close,
  Map,
  MenuBook,
  Forward,
  Folder,
  CloudDownload,
  GitHub,
  Comment
} from "@mui/icons-material";
import {
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Modal,
  Drawer,
  IconButton
} from "@mui/material";
import backend from "../../Funksjoner/backend";
import {
  AllLayersIcon,
  FavouriteLayesIcon,
  EditLayesIcon,
  ChevronDobleRightWhite
} from "../../Common/SvgIcons";

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
    backend.getUserManual().then(manual => {
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

  const openInNewTabWithoutOpener = url => {
    // Done this way for security reasons
    var newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
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
          <IconButton onClick={() => handleCloseDrawer()}>
            <ChevronDobleRightWhite />
          </IconButton>
          <ListItemText
            id="drawer-title-text"
            primary={"Økologiske grunnkart"}
          />
        </ListItem>

        <MenuItem
          id="drawer-menuitem-about-info"
          className="drawer-menuitem"
          onClick={() => {
            handleAboutModal(true);
            handleCloseDrawer();
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <Map />
          </ListItemIcon>
          <ListItemText primary={`Om "Økologiske Grunnkart"`} />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-user-manual"
          className="drawer-menuitem"
          onClick={() => {
            openHelp();
            handleCloseDrawer();
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <MenuBook />
          </ListItemIcon>
          <ListItemText primary="Brukermanual" />
        </MenuItem>

        <Divider variant="fullWidth" />

        <MenuItem
          id="drawer-menuitem-favourite-kartlag"
          className="drawer-menuitem"
          onClick={() => {
            toggleShowFavoriteLayers(true);
            handleCloseDrawer();
          }}
          selected={showFavoriteLayers}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <FavouriteLayesIcon />
          </ListItemIcon>
          <ListItemText primary="Vis favorittkartlag" />
          <ListItemIcon id="filter-layers-menu-icon">
            {showFavoriteLayers ? <Done fontSize="small" /> : <div />}
          </ListItemIcon>
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-all-kartlag"
          className="drawer-menuitem"
          onClick={() => {
            toggleShowFavoriteLayers(false);
            handleCloseDrawer();
          }}
          selected={!showFavoriteLayers}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <AllLayersIcon />
          </ListItemIcon>
          <ListItemText primary="Vis alle kartlag" />
          <ListItemIcon id="filter-layers-menu-icon">
            {!showFavoriteLayers ? <Done fontSize="small" /> : <div />}
          </ListItemIcon>
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-edit-kartlag"
          className="drawer-menuitem"
          onClick={() => {
            toggleEditLayers();
            handleCloseDrawer();
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <EditLayesIcon />
          </ListItemIcon>
          <ListItemText primary="Endre favorittkartlag" />
        </MenuItem>

        <Divider variant="fullWidth" />

        <MenuItem
          id="drawer-menuitem-upload-polygon"
          className="drawer-menuitem"
          onClick={() => {
            uploadPolygonFile("menu");
            handleCloseDrawer();
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <Forward style={{ transform: "rotate(-90deg)" }} />
          </ListItemIcon>
          <ListItemText primary="Last opp polygon" />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-saved-polygon"
          className="drawer-menuitem"
          onClick={() => {
            getSavedPolygons();
            handleCloseDrawer();
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <Folder />
          </ListItemIcon>
          <ListItemText primary="Åpne lagret polygon" />
        </MenuItem>

        <Divider variant="fullWidth" />

        <MenuItem
          id="drawer-menuitem-download-data"
          className="drawer-menuitem"
          onClick={() => {
            handleCloseDrawer();
            const url =
              "https://kartkatalog.geonorge.no/?nationalinitiative=%C3%98kologiskGrunnkart";
            openInNewTabWithoutOpener(url);
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <CloudDownload />
          </ListItemIcon>
          <ListItemText primary="Last ned data" />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-source-code"
          className="drawer-menuitem"
          onClick={() => {
            handleCloseDrawer();
            const url = "https://github.com/Artsdatabanken/okologiskegrunnkart";
            openInNewTabWithoutOpener(url);
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <GitHub />
          </ListItemIcon>
          <ListItemText primary="Kildekode" />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-feedback"
          className="drawer-menuitem"
          onClick={() => {
            handleCloseDrawer();
            const url =
              "mailto:postmottak@artsdatabanken.no?subject=Tilbakemelding%20%C3%98kologiske%20grunnkart";
            window.location.href = url;
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <Comment />
          </ListItemIcon>
          <ListItemText primary="Tilbakemeldinger" />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-astatus"
          className="drawer-menuitem"
          onClick={() => {
            handleCloseDrawer();
            const url =
              " https://uustatus.no/nb/erklaringer/publisert/f7f5b426-0b2f-443a-980d-cfa51c57c2f5";
            openInNewTabWithoutOpener(url);
          }}
          tabIndex={0}
        >
          <ListItemIcon id="drawer-item-icon">
            <Comment />
          </ListItemIcon>
          <ListItemText primary="Tilgjengelighetserklæring" />
        </MenuItem>

        <MenuItem
          id="drawer-menuitem-artsdatabanken"
          className="drawer-menuitem"
          onClick={() => {
            handleCloseDrawer();
            const url = " https://artsdatabanken.no/";
            openInNewTabWithoutOpener(url);
          }}
          tabIndex={0}
        >
          <img
            id="drawer-item-image"
            src="/logoer/adb32.png"
            alt="artsdatabanken-logo"
            height="24"
            width="24"
          />
          <ListItemText primary="Artsdatabanken" />
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
