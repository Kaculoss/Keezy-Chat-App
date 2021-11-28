import React from "react";
import "./Modal.css";

export const PromptModal = ({
  setStateText,
  stateText,
  handleConfirm,
  handleCancel,
  confirmText,
  cancelText,
  title,
}) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer promptContainer">
        <div className="titleCloseBtn">
          <button onClick={handleCancel}>X</button>
        </div>
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="body">
          <input
            type="text"
            placeholder="type the space name here"
            value={stateText?.text}
            onChange={(e) => {
              setStateText({ ...stateText, text: e.target.value });
            }}
          />
        </div>
        <div className="footer">
          <button onClick={handleCancel} id="cancelBtn">
            {cancelText || "Cancel"}
          </button>
          <button onClick={handleConfirm}>{confirmText || "Ok"}</button>
        </div>
      </div>
    </div>
  );
};
