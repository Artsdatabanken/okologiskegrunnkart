import React, { useState } from "react";
import "../../style/searchbar.css";

const SearchBar = props => {
  const [searchTerm, setSearchTerm] = useState(null);

  return (
    <div className="infobox_container">
      <div className="searchbar">
        <input
          className="searchbarfield"
          type="text"
          onChange={e => {
            if (e.target.value) {
              setSearchTerm(e.target.value.toLowerCase());
            }
          }}
        />
        <button
          onClick={() => {
            console.log(searchTerm);
          }}
        >
          {" "}
          Søk
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
