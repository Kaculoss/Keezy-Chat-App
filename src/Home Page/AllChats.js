import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../Modals/ConfirmModal";
import { deleteSpace } from "../Utilities/firebaseUtils";

export const AllChats = memo(({ chats, category }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteChatID, setDeleteChatID] = useState("");

  const handleDeleteBtn = (chatID) => {
    setDeleteChatID(chatID);
    setModalOpen(true);
  };

  const handleDeleteSpace = () => {
    if (deleteChatID) {
      deleteSpace(deleteChatID).then(handleCancle());
    }
    handleCancle();
  };

  const handleCancle = () => {
    setModalOpen(false);
    setDeleteChatID("");
  };

  let count = 0;
  return (
    <>
      <div className={`chat-div chat-${category}-div`}>
        {chats &&
          chats.map((chat) => {
            const { name, chatID, isAdmin } = chat;
            const shade = count % 2 !== 0 ? "no-shade" : "shade";
            count += 1;
            return (
              <div
                key={chatID}
                className={`${category}-chat all-chats ${shade}`}
              >
                <p>{name}</p>
                {category === "space" && isAdmin ? (
                  <div className="admin-space-chat">
                    <button
                      onClick={() => handleDeleteBtn(chatID)}
                      className="react-link space-link"
                      id="delete-space"
                    >
                      delete space
                    </button>
                    <Link
                      to={`/chatpage/${chatID}`}
                      className="react-link chats-link"
                    >
                      enter space
                    </Link>
                  </div>
                ) : (
                  <Link
                    to={`/chatpage/${chatID}`}
                    className="react-link chats-link"
                  >
                    {category === "space" ? "enter space" : "chat"}
                  </Link>
                )}
              </div>
            );
          })}
        {modalOpen && (
          <ConfirmModal
            handleContinue={handleDeleteSpace}
            handleCancel={handleCancle}
            message="Are You Sure You Want To Delete This Space?"
          />
        )}
      </div>
    </>
  );
});
