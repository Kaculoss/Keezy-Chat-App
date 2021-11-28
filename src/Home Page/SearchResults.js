import React, { memo, useEffect, useState } from "react";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { Button } from "./Buttons";

export const SearchResults = memo(({ currentUser }) => {
  const [{ searchResults, searchRef }, dispatch] = useDataLayerValue();
  const [friendIDs, setFriendIDs] = useState([]);

  useEffect(() => {
    const id_list = [];
    currentUser.friends.forEach((friend) => id_list.push(friend.friendID));
    setFriendIDs(id_list);
  }, [currentUser]);
  const clearResults = () => {
    dispatch({ type: "CLEAR_RESULTS" });
  };

  let count = 0;
  return (
    <>
      {currentUser && (
        <div className="search-results-div">
          <h4>Search Results</h4>
          <div className="all-results">
            {searchResults.length !== 0 ? (
              searchResults.map((result) => {
                const shade = count % 2 !== 0 ? "no-shade" : "shade";
                count += 1;
                return (
                  <div key={result.id} className={`all-chats ${shade}`}>
                    <p>{result.name}</p>
                    <Button
                      user={currentUser}
                      id_list={friendIDs}
                      searchedResult={result}
                    />
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <p>{searchRef} not found</p>
              </div>
            )}
          </div>
          <button onClick={clearResults}>clear results</button>
        </div>
      )}
    </>
  );
});
