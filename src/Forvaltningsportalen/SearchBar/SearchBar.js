import React from "react";
import "../../style/searchbar.css";

const SearchBar = props => {
  let treffliste = props.treffliste;

  return (
    <div className="searchbar_container">
      <div className="searchbar">
        <input
          className="searchbarfield"
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
                }}
              >
                <span className="itemname">{itemname} </span>
                <span className="itemtype">{itemtype} </span>
                <span className="itemnr">{itemnr} </span>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;
