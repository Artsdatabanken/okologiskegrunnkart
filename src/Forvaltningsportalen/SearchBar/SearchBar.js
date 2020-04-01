import React from "react";
import "../../style/searchbar.css";
import ForvaltningsElement from "../ForvaltningsKartlag/ForvaltningsElement";

const SearchBar = props => {
  let treffliste = props.treffliste;
  let treffliste_lokalt = props.treffliste_lokalt;

  return (
    <div className="searchbar_container">
      <div className="searchbar">
        <input
          className="searchbarfield"
          id="searchfield"
          type="text"
          placeholder="søk i sideinnhold eller geografisk område"
          onChange={e => {
            if (e.target.value) {
              props.handleSearchBar(e.target.value.toLowerCase());
            } else {
              props.handleSearchBar(null);
            }
          }}
        />

        <button
          onClick={() => {
            props.handleRemoveTreffliste();
            props.handleSearchBar(null);
            document.getElementById("searchfield").value = "";
          }}
        >
          x
        </button>
      </div>

      <div className="treffliste">
        {treffliste &&
          props.treffliste.length > 0 &&
          treffliste.map(item => {
            let itemname = item[0] || "";
            let itemtype = item[1] || "";
            let itemnr = item[2] || "";
            return (
              <button
                className="searchbar_item"
                key={item}
                onClick={() => {
                  props.handleGeoSelection(item);
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }}
              >
                <span className="itemname">{itemname} </span>
                <span className="itemtype">{itemtype} </span>
                <span className="itemnr">{itemnr} </span>
              </button>
            );
          })}

        {treffliste_lokalt &&
          props.treffliste_lokalt.length > 0 &&
          treffliste_lokalt.map(item => {
            return (
              <div className="searchbar_item searchbar_local_item_container">
                <ForvaltningsElement
                  kartlag_key={item.id}
                  kartlag={item}
                  key={item.id}
                  onUpdateLayerProp={props.onUpdateLayerProp}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;
