import React from "react";
import "./Modal.css";

export const ConfirmModal = ({
  handleContinue,
  handleCancel,
  message,
  confirmText,
  cancelText,
}) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={handleCancel}>X</button>
        </div>
        <div className="title">
          <p>{message || "Are You Sure You Want To Continue?"}</p>
        </div>
        <div className="footer">
          <button onClick={handleCancel} id="cancelBtn">
            {cancelText || "No, cancel"}
          </button>
          <button onClick={handleContinue}>
            {confirmText || "Yes, continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
