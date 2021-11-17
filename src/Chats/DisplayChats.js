import React from "react";

export const DisplayChats = ({ message, userID }) => {
  const { text, uid, photoURL } = message;

  const messageClass = uid === userID ? "sent" : "received";

  return (
    <>
      <div className={`display-chat-text ${messageClass}`}>
        <img
          src={
            photoURL ||
            "https://lh3.googleusercontent.com/a/AATXAJxiaKdc2jxrKQcRluarByEK2wRhTLCwswVADfEb=s96-c"
          }
          alt=""
        />
        <p>{text}</p>
      </div>
    </>
  );
};
