import React, { useEffect, useState } from "react";
import { removeFromSpace } from "../Utilities/firebaseUtils";

export const RemoveFromSpace = ({
  participants,
  chatID,
  userID,
  closeAdminList,
}) => {
  const [checkedState, setCheckedState] = useState([]);
  const [checkedFriend, setCheckedFriend] = useState([]);
  const [showFriends, setShowFriends] = useState([]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    let friendList = [];
    updatedCheckedState.forEach((state, index) => {
      if (state === true) {
        friendList.push(showFriends[index].id);
      }
    });
    setCheckedFriend(friendList);
  };

  const handleRemove = () => {
    if (checkedFriend.length !== 0) {
      removeFromSpace(chatID, checkedFriend);
    }
  };

  useEffect(() => {
    if (participants) {
      const participantsToShow = participants.filter(
        (participant) => participant.id !== userID
      );
      setShowFriends(participantsToShow);
      setCheckedState(new Array(participantsToShow?.length).fill(false));
    } else {
      setShowFriends([]);
      setCheckedState([]);
    }
  }, [participants, userID]);

  let count = 0;
  return (
    <>
      <div className="admin-list">
        <div className="all-lists">
          {showFriends?.length !== 0 ? (
            showFriends?.map((friend, index) => {
              const { name, id } = friend;
              const shade = count % 2 !== 0 ? "no-shade" : "shade";
              count += 1;
              return (
                <div key={id} className={`each-list ${shade}`}>
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
              <p>no other participants to be removed</p>
            </div>
          )}
        </div>
        <div className="admin-list-button-div">
          <button onClick={handleRemove}>remove</button>
          <button onClick={closeAdminList}>cancel</button>
        </div>
      </div>
    </>
  );
};
