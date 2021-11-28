import React, { useEffect, useState } from "react";
import { addToSpace } from "../Utilities/firebaseUtils";

export const AddToSpace = ({
  friends,
  participants,
  closeAdminList,
  chatID,
}) => {
  const [showFriends, setShowFriends] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedFriend, setCheckedFriend] = useState([]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    let friendList = [];
    updatedCheckedState.forEach((state, index) => {
      if (state === true) {
        friendList.push({
          name: showFriends[index].name,
          id: showFriends[index].friendID,
        });
      }
    });
    setCheckedFriend(friendList);
  };

  const handleAdd = () => {
    if (checkedFriend.length !== 0) {
      addToSpace(chatID, checkedFriend);
    }
  };

  useEffect(() => {
    if (friends.length !== 0) {
      let participantsID = [];
      for (let i = 0; i < friends.length; i++) {
        for (let j = 0; j < participants.length; j++) {
          if (friends[i].friendID === participants[j].id) {
            participantsID.push(friends[i].friendID);
          }
        }
      }
      const friendsToShow = friends.filter(
        (friend) => !participantsID.includes(friend.friendID)
      );
      setShowFriends(friendsToShow);
      setCheckedState(new Array(friendsToShow?.length).fill(false));
    } else {
      setShowFriends([]);
      setCheckedState([]);
    }
  }, [friends, participants]);

  let count = 0;
  return (
    <>
      <div className="admin-list">
        <div className="all-lists">
          {showFriends?.length !== 0 ? (
            showFriends?.map((friend, index) => {
              const { name, friendID } = friend;
              const shade = count % 2 !== 0 ? "no-shade" : "shade";
              count += 1;
              return (
                <div key={friendID} className={`each-list ${shade}`}>
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                  <input
                    type="checkbox"
                    name={name}
                    id={`custom-checkbox-${index}`}
                    value={name}
                    checked={checkedState[index]}
                    onChange={() => handleOnChange(index)}
                  />
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p>
                you have no friends to be added in this space. please get some
                friends first.
              </p>
            </div>
          )}
        </div>
        <div className="admin-list-button-div">
          <button onClick={handleAdd}>add</button>
          <button onClick={closeAdminList}>cancel</button>
        </div>
      </div>
    </>
  );
};
