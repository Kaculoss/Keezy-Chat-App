import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { collection, where, query, onSnapshot } from "@firebase/firestore";

import {
  db,
  getFriendChatName,
  logout,
  useAuth,
  useFirestore,
} from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { ChatRoom } from "./ChatRoom";

const ChatPage = () => {
  const [{}, dispatch] = useDataLayerValue();
  const [user, setUser] = useState([]);
  const [chatname, setChatname] = useState("");
  const { chatID } = useParams();
  const currentUser = useAuth();
  const chatroom = useFirestore(chatID);

  const handleLogout = async () => {
    try {
      dispatch({ type: "CLEAR_RESULTS" });
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  useEffect(() => {
    if (currentUser) {
      const collectionRef = collection(db, "users");
      const queryStatement = where("id", "==", currentUser?.uid);
      const q = query(collectionRef, queryStatement);

      const unsub = onSnapshot(q, (snapshot) => {
        setUser(snapshot.docs.map((doc) => doc.data())[0]);
      });

      return unsub;
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof user !== "undefined") {
      getFriendChatName(chatID, user.id).then((results) => {
        return setChatname(results);
      });

      return () => {
        setChatname({});
      };
    }
  }, [user]);
  return (
    <>
      {user && (
        <div className="chat-ui">
          <header>
            <div className="home chat-page">
              <h2 className="chat-ui-title" id="home-title">
                Keezy Chat App
              </h2>
              <Link to="/home" className="react-link">
                Back To Homepage
              </Link>
            </div>
            <h3 className="chat-page-chatname">{chatname}</h3>
            <div className="chat-page-button">
              <button
                className="sign-out-button"
                id="chat-page-signout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </header>

          <section>
            {chatroom[0]?.participantIDs.includes(user.id) && (
              <ChatRoom
                chatroom={chatroom}
                currentUser={user}
                chatID={chatID}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default withRouter(ChatPage);
