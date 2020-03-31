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
            console.log("klikk");
          }}
        >
          {" "}
          Søk
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
            console.log(item);
            return (
              <button
                key={item}
                onClick={() => {
                  props.handleGeoSelection(item);
                  props.handleRemoveTreffliste();
                  document.getElementById("searchfield").value = "";
                }}
              >
                <span className="itemname">{""} </span>

                <ForvaltningsElement
                  kartlag_key={item.id}
                  kartlag={item}
                  key={item.id}
                  onUpdateLayerProp={props.onUpdateLayerProp}
                />
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;
