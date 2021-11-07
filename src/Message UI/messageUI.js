import React from "react";
import "./messageUI.css";
import ChatRoom from "./chatRoom";
import {
  googleSignIn,
  logout,
  useAuth,
} from "../authenticate app/chatAppUtils";

function MessageUI() {
  const currentUser = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      alert("Error!");
    }
  };

  return (
    <div className="message-ui">
      <header>
        <h3 id="message-ui-title">Messages Portfolio</h3>
        {currentUser && (
          <button onClick={handleLogout} className="sign-out-button">
            Sign Out
          </button>
        )}
      </header>
      <section>{currentUser ? <ChatRoom /> : <SignInPage />}</section>
    </div>
  );
}

const SignInPage = () => {
  const handleGoogleSignIn = async () => {
    googleSignIn().catch((err) => {
      alert("Error!");
    });
  };

  return (
    <>
      <main className="sign-in">
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <p>
          Do not violate the community guidelines or you will be banned for
          life!
        </p>
      </main>
    </>
  );
};

export default MessageUI;
