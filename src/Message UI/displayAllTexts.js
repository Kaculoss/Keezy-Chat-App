import React from "react";
import { useAuth } from "../authenticate app/chatAppUtils";

const DisplayAllTexts = ({ message, autoScroll }) => {
  const currentUser = useAuth();
  const { text, uid, photoURL } = message;

  let messageClass;
  if (currentUser) {
    messageClass = uid === currentUser.uid ? "sent" : "received";

    autoScroll.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={`text-display ${messageClass}`}>
      <img
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt=""
      />
      <p>{text}</p>
    </div>
  );
};

export default DisplayAllTexts;
