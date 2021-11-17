import React from "react";
import { DisplayChats } from "./DisplayChats";
import { TextBox } from "./TextBox";
import ReactScrollableFeed from "react-scrollable-feed";

export const ChatRoom = ({ chatroom, currentUser, chatID }) => {
  if (!currentUser) {
    return false;
  }
  return (
    <>
      <main className="chatroom-main">
        <ReactScrollableFeed className="scrollable-feed">
          {chatroom?.map((message) => (
            <DisplayChats
              key={message.id}
              message={message}
              userID={currentUser.id}
            />
          ))}
        </ReactScrollableFeed>
      </main>
      <TextBox chatID={chatID} currentUser={currentUser} />
    </>
  );
};
