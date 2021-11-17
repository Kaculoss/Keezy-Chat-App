import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriends, mergeFriend } from "../Utilities/firebaseUtils";
import { getSpaceChats } from "../Utilities/reuseFunctions";

export const AllChats = memo(({ category, currentUser }) => {
  const [friends, setFriends] = useState([]);
  let data;
  if (category === "space") {
    data = getSpaceChats();
  }

  useEffect(() => {
    if (typeof currentUser !== "undefined") {
      const myFriends = currentUser?.friends;
      const friendIDs = myFriends?.map((friend) => friend.friendID);

      if (typeof friendIDs !== "undefined" && friendIDs.length !== 0) {
        getFriends(friendIDs)
          .then((results) => {
            const friendChats = currentUser.friends.map((friend) => friend);
            const friends = mergeFriend(friendChats, results);
            return friends;
          })
          .then((results) => setFriends(results));
      }
    }
  }, [currentUser]);

  let count = 0;
  if (category === "space") {
    return (
      <>
        <div className={`chat-div chat-${category}-div`}>
          {data.map((chat) => {
            const { id, name, chatID } = chat;
            const shade = count % 2 !== 0 ? "no-shade" : "shade";
            count += 1;
            return (
              <div key={id} className={`${category}-chat all-chats ${shade}`}>
                <p>{name}</p>
                <Link className="react-link chats-link">enter space</Link>
              </div>
            );
          })}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={`chat-div chat-${category}-div`}>
          {friends.map((chat) => {
            const { id, name, chatID } = chat;
            const shade = count % 2 !== 0 ? "no-shade" : "shade";
            count += 1;
            return (
              <div key={id} className={`${category}-chat all-chats ${shade}`}>
                <p>{name}</p>
                <Link
                  to={`/chatpage/${chatID}`}
                  className="react-link chats-link"
                >
                  chat
                </Link>
              </div>
            );
          })}
        </div>
      </>
    );
  }
});
