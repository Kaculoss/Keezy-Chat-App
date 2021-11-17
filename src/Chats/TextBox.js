import React, { useState } from "react";
import { sendMessage } from "../Utilities/firebaseUtils";

export const TextBox = ({ chatID, currentUser }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      sendMessage(chatID, text, currentUser.id, currentUser.photoURL);
      setText("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="say something nice"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-input"
        />
        <button type="submit" disabled={!text}>
          send
        </button>
      </form>
    </>
  );
};
