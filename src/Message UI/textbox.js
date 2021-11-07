import React, { useState } from "react";
import { addMessage, useAuth } from "../authenticate app/chatAppUtils";

const TextBox = () => {
  const [message, setMessage] = useState("");
  const currentUser = useAuth();

  const handleAddMessage = (event) => {
    event.preventDefault();
    if (message) {
      addMessage(message, currentUser.uid, currentUser.photoURL);
      setMessage("");
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <form onSubmit={handleAddMessage}>
      <input
        value={message}
        type="text"
        placeholder="say something nice"
        onChange={handleChange}
      />
      <button type="submit" disabled={!message}>
        send
      </button>
    </form>
  );
};

export default TextBox;
