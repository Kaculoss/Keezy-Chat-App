import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import {
  getChatProperties,
  getFriendChatName,
  getSpaceName,
  useAuth,
} from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { AdminList } from "./AdminList";
import { AdminSpaceHeader } from "./AdminSpaceHeader";
import { ChatRoom } from "./ChatRoom";
import { OtherHeader } from "./OtherHeader";

const ChatPage = () => {
  const [chatname, setChatname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [{ showAdminList }, dispatch] = useDataLayerValue();
  const { chatID } = useParams();
  const currentUser = useAuth();

  useEffect(() => {
    if (currentUser) {
      getChatProperties(chatID).then((result) => {
        if (result.chatCategory === "friend-chat") {
          getFriendChatName(chatID, currentUser.uid)
            .then((results) => setChatname(results))
            .catch((err) => console.log(err));
        }

        if (result.chatCategory === "space-chat") {
          getSpaceName(chatID)
            .then((name) => setChatname(name))
            .catch((err) => console.log(err));
        }

        if (result.admin === currentUser?.uid) {
          setIsAdmin(true);
        }

        if (result.admin !== currentUser?.uid) {
          setIsAdmin(false);
        }
      });
    }
  }, [currentUser, chatID]);

  const closeAdminList = () => {
    dispatch({ type: "CLOSE_ADMIN_LIST" });
  };

  return (
    <>
      {currentUser && (
        <div className="chat-ui">
          {isAdmin ? (
            <AdminSpaceHeader
              userID={currentUser?.uid}
              chatID={chatID}
              closeAdminList={closeAdminList}
            />
          ) : (
            <OtherHeader chatname={chatname} userID={currentUser?.uid} />
          )}
          {showAdminList && (
            <AdminList
              closeAdminList={closeAdminList}
              chatID={chatID}
              userID={currentUser?.uid}
            />
          )}
          <section>
            <ChatRoom user={currentUser} chatID={chatID} />
          </section>
        </div>
      )}
    </>
  );
};

export default withRouter(ChatPage);
