import React, { memo, useEffect, useState } from "react";
import { DisplayChats } from "./DisplayChats";
import { TextBox } from "./TextBox";
import ReactScrollableFeed from "react-scrollable-feed";
import { getChatProperties, useFirestore } from "../Utilities/firebaseUtils";

export const ChatRoom = memo(({ user, chatID }) => {
  const chatroom = useFirestore(chatID);
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

  if (!user) {
    return false;
  }
  return (
    <>
      <main className="chatroom-main">
        <ReactScrollableFeed className="scrollable-feed">
          {isParticipant &&
            chatroom?.map((message) => (
              <DisplayChats key={message.id} message={message} user={user} />
            ))}
        </ReactScrollableFeed>
      </main>
      <TextBox user={user} chatID={chatID} />
    </>
  );
});
