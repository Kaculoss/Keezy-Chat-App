import React from "react";
import { Link } from "react-router-dom";
import {
  acceptFriendReq,
  rejectFriendReq,
  sendFriendReq,
} from "../Utilities/firebaseUtils";

export const Button = ({ user, names, searchedResult }) => {
  if (names?.includes(searchedResult.name)) {
    const { chatID } = user.friends?.filter(
      (friend) => friend.friendID === searchedResult.id
    )[0];

    return (
      <Link to={`chatpage/${chatID}`} className="react-link">
        chat
      </Link>
    );
  }
  if (user?.reqSent.includes(searchedResult.id)) {
    return <p>request sent</p>;
  }
  if (user?.reqRec.includes(searchedResult.id)) {
    return (
      <div className="req-received-buttons">
        <button
          id="accept-friend"
          onClick={() => acceptFriendReq(searchedResult, user)}
        >
          accept
        </button>
        <button
          id="reject-friend"
          onClick={() => {
            rejectFriendReq(searchedResult, user);
          }}
        >
          reject
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => sendFriendReq(user, searchedResult)}>
      send request
    </button>
  );
};
