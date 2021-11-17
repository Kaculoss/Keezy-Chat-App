import React from "react";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { logout } from "../Utilities/firebaseUtils";
import { getChatRoom } from "../Utilities/reuseFunctions";
import { ChatRoom } from "./ChatRoom";

const SpacePage = () => {
  const { chatID } = useParams();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  const chatroom = getChatRoom(chatID);
  console.log(chatroom);

  return (
    <>
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
          <h3 className="chat-page-chatname">{chatroom.chatName}</h3>
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
          {chatroom.participantIDs.includes(1) && (
            <ChatRoom chatroom={chatroom} />
          )}
        </section>
      </div>
    </>
  );
};

export default withRouter(SpacePage);
