import React, { useEffect, useState } from "react";
import { getFriends } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { Button } from "./Buttons";

export const SearchResults = ({ currentUser }) => {
  const [{ searchResults, searchRef }, dispatch] = useDataLayerValue();
  const [friendNames, setFriendNames] = useState([]);

  useEffect(() => {
    const friendIDs = [];
    currentUser.friends.forEach((friend) => friendIDs.push(friend.friendID));

    if (friendIDs.length !== 0) {
      getFriends(friendIDs)
        .then((results) => {
          const names = [];
          results.forEach((result) => names.push(result.name));
          return names;
        })
        .then((names) => {
          setFriendNames(names);
        });
    } else {
      setFriendNames([]);
    }
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
                      names={friendNames}
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
};
