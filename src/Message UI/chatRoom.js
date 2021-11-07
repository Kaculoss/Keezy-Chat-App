import React, { useRef } from "react";
import { useFirestore } from "../authenticate app/chatAppUtils";
import DisplayAllTexts from "./displayAllTexts";
import TextBox from "./textbox";

const ChatRoom = () => {
  const dummy = useRef();
  const allMessages = useFirestore();
  return (
    <>
      <main>
        {allMessages?.map((msg) => {
          return (
            <DisplayAllTexts
              key={msg.id}
              message={msg}
              autoScroll={dummy.current}
            />
          );
        })}
        <div ref={dummy}></div>
      </main>

      <TextBox />
    </>
  );
};

export default ChatRoom;
