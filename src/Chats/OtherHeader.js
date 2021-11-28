import React, { memo } from "react";
import { Link } from "react-router-dom";
import { logout } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";

export const OtherHeader = memo(({ chatname, userID }) => {
  const [{}, dispatch] = useDataLayerValue();

  const handleLogout = async () => {
    try {
      dispatch({ type: "CLEAR_RESULTS" });
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  return (
    <>
      <header>
        <div className="home chat-page">
          <h2 className="chat-ui-title" id="home-title">
            Keezy Chat App
          </h2>
          <Link to={`/home/${userID}`} className="react-link">
            Back To Homepage
          </Link>
        </div>
        <h3 className="chat-page-chatname">{chatname}</h3>
        <div className="chat-page-button">
          <button
            className="sign-out-button"
            id="chat-page-signout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>
    </>
  );
});
