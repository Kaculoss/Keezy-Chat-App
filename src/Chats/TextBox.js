import React, { useEffect, useState } from "react";
import { getChatProperties, sendMessage } from "../Utilities/firebaseUtils";

export const TextBox = ({ user, chatID }) => {
  const [text, setText] = useState("");
  const [isParticipant, setIsParticipant] = useState(true);

  useEffect(() => {
    getChatProperties(chatID).then((results) => {
      const { participants } = results;
      const participantIDs = participants.map((participant) => participant.id);
      if (participantIDs.includes(user.uid)) {
        setIsParticipant(true);
      } else {
        setIsParticipant(false);
      }
    });
  }, [user, chatID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      sendMessage(chatID, text, user.uid, user.photoURL);
      setText("");
    }
  };

  return (
    <>
      {isParticipant ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="say something nice"
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="text-input"
          />
          <button type="submit" disabled={!text}>
            send
          </button>
        </form>
      ) : (
        <form>
          <input
            type="text"
            placeholder="you have been removed from this chat"
            className="text-input"
            disabled={!isParticipant}
          />
          <button type="submit" disabled={!isParticipant}>
            send
          </button>
        </form>
      )}
    </>
  );
};
