import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "@firebase/firestore";
import { Link } from "react-router-dom";
import { editSpaceName, logout, db } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { PromptModal } from "../Modals/PromptModal";

export const AdminSpaceHeader = ({ userID, chatID, closeAdminList }) => {
  const [adminUtils, setAdminUtils] = useState({
    chatname: "",
    isRemoveList: false,
    isAddList: false,
    modalOpen: false,
    text: "",
  });
  const [{}, dispatch] = useDataLayerValue();

  useEffect(() => {
    const docRef = doc(db, "chatrooms", chatID);

    const unsub = onSnapshot(docRef, (doc) => {
      setAdminUtils({ ...adminUtils, chatname: doc.data().name });
    });
    return unsub;
  });

  const handleLogout = async () => {
    try {
      dispatch({ type: "CLEAR_RESULTS" });
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  const handleAddFriend = () => {
    setAdminUtils({ ...adminUtils, isAddList: !adminUtils.isAddList });
    if (adminUtils.isAddList) {
      closeAdminList();
    } else {
      dispatch({ type: "ADD_FRIEND" });
    }
  };

  const handleRemoveFriend = () => {
    setAdminUtils({ ...adminUtils, isRemoveList: !adminUtils.isRemoveList });
    if (adminUtils.isRemoveList) {
      closeAdminList();
    } else {
      dispatch({ type: "REMOVE_FRIEND" });
    }
  };

  const handleRenameSpace = () => {
    if (adminUtils.text) {
      editSpaceName(chatID, adminUtils.text).then(handleCancel());
    }
    handleCancel();
  };

  const handleCancel = () => {
    setAdminUtils({ ...adminUtils, modalOpen: false, text: "" });
  };

  return (
    <>
      <header>
        <div className="home chat-page">
          <h2 className="chat-ui-title" id="home-title">
            Keezy Chat App
          </h2>
          <Link
            to={`/home/${userID}`}
            className="react-link"
            onClick={closeAdminList}
          >
            Back To Homepage
          </Link>
        </div>
        <div className="admin-space-header">
          <h3 className="admin-page-chatname">{adminUtils.chatname}</h3>
          <div className="admin-space-header-buttons">
            <button
              id="rename"
              onClick={() => {
                setAdminUtils({ ...adminUtils, modalOpen: true });
              }}
            >
              rename space
            </button>
            <button id="add" onClick={handleAddFriend}>
              add friend
            </button>
            <button id="remove" onClick={handleRemoveFriend}>
              remove friend
            </button>
          </div>
        </div>

        <div className="chat-page-button">
          <button
            className="sign-out-button"
            id="chat-page-signout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
        {adminUtils.modalOpen && (
          <PromptModal
            handleConfirm={handleRenameSpace}
            handleCancel={handleCancel}
            stateText={adminUtils}
            setStateText={setAdminUtils}
            title="Change Space Name"
          />
        )}
      </header>
    </>
  );
};
