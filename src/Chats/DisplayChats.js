import React, { memo } from "react";

export const DisplayChats = memo(({ message, user }) => {
  const { text, uid, photoURL, timestamp } = message;

  const messageClass = uid === user.uid ? "sent" : "received";
  const fullTime = timestamp?.toDate().toString().split(" (")[0].split(" G")[0];
  const time = fullTime?.split(" ")[4].split(":").slice(0, 2).join(":");
  const date = fullTime?.split(time)[0].split(" ").slice(0, 3).join(" ");
  const dateTime = `${time} ${date}`;

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
        <div className="text-div">
          <p id="text-p">{text}</p>
          <p id="date-time-p">
            {typeof date !== "undefined" && typeof time !== "undefined"
              ? dateTime
              : ""}
          </p>
        </div>
      </div>
    </>
  );
});
