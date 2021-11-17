import React, { useRef, useState } from "react";
import { searchUsers } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";

export const SearchBar = ({ currentUser }) => {
  const [searchItem, setSearchItem] = useState("");
  const searchRef = useRef();
  const [{}, dispatch] = useDataLayerValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchItem) {
      searchUsers(searchItem, currentUser.id).then((results) => {
        dispatch({
          type: "ADD_RESULTS",
          payload: { data: results, search: searchRef.current.value },
        });
        setSearchItem("");
      });
    } else {
      dispatch({ type: "NO_VALUE" });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="search-div-form">
        <input
          type="text"
          placeholder="search for a friend here"
          value={searchItem}
          ref={searchRef}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <button type="submit" disabled={!searchItem}>
          Search
        </button>
      </form>
    </>
  );
};
