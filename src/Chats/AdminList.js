import React, { useEffect, useState } from "react";
import { getMyFriends, useParticipants } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { AddToSpace } from "./AddToSpace";
import { RemoveFromSpace } from "./RemoveFromSpace";

export const AdminList = ({ chatID, closeAdminList, userID }) => {
  const [{ whatToShow }] = useDataLayerValue();
  const [friends, setFriends] = useState([]);
  const participants = useParticipants(chatID);

  useEffect(() => {
    getMyFriends(userID).then((results) => {
      if (results) {
        setFriends(results);
      } else {
        setFriends([]);
      }
    });
  }, [userID]);

  return (
    <>
      {whatToShow === "friends" ? (
        <AddToSpace
          friends={friends}
          participants={participants}
          closeAdminList={closeAdminList}
          chatID={chatID}
        />
      ) : (
        <RemoveFromSpace
          participants={participants}
          chatID={chatID}
          userID={userID}
          closeAdminList={closeAdminList}
        />
      )}
    </>
  );
};
