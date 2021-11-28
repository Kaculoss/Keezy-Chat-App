import React from "react";
import { Link } from "react-router-dom";
import { googleSignIn, logout, useAuth } from "../Utilities/firebaseUtils";

export const SignInPage = () => {
  const currentUser = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  return (
    <>
      {!currentUser ? (
        <div className="chat-ui sign-in-page">
          <header>
            <h3 className="chat-ui-title">Keezy Chat App</h3>
          </header>

          <section>
            <main className="sign-in">
              <button onClick={googleSignIn}>Sign in with Google</button>
              <p>
                Do not violate the community guidelines or you will be banned
                for life!
              </p>
            </main>
          </section>
        </div>
      ) : (
        <div className="chat-ui sign-in-page">
          <header>
            <h3 className="chat-ui-title">Keezy Chat App</h3>
            <button className="sign-out-button" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

          <section>
            <main className="sign-in">
              <Link to={`/home/${currentUser?.uid}`}>
                <button id="go-to-home-button">Go to Home Page</button>
              </Link>
              <p id="successfully-logged-in">
                You have signed in successfully!
              </p>
            </main>
          </section>
        </div>
      )}
    </>
  );
};
