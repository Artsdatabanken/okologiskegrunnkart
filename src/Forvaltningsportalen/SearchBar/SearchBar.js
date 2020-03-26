import React from "react";
import "../../style/searchbar.css";

const SearchBar = props => {
  let treffliste = props.treffliste;

  return (
    <div className="infobox_container">
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
            return <button key={item}> {item} </button>;
          })}
      </div>
    </div>
  );
};

export default SearchBar;
