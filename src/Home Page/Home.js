import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { db, logout, useAuth } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { AllChats } from "./AllChats";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { UserInfo } from "./UserInfo";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import { ShowRequests } from "./ShowRequests";

const Home = () => {
  const [{ showResults, showRequests }, dispatch] = useDataLayerValue();
  const [user, setUser] = useState([]);
  const [reqSent, setReqSent] = useState([]);
  const [reqRec, setReqRec] = useState([]);
  const currentUser = useAuth();

  const handleLogout = async () => {
    try {
      dispatch({ type: "CLEAR_RESULTS" });
      await logout();
    } catch {
      throw new Error("can not sign out");
    }
  };

  const handleViewRequests = () => {
    dispatch({ type: "SHOW_REQUESTS" });
  };

  const handleViewFriends = () => {
    dispatch({ type: "SHOW_FRIENDS" });
  };

  useEffect(() => {
    if (currentUser) {
      const collectionRef = collection(db, "users");
      const queryStatement = where("id", "==", currentUser?.uid);
      const q = query(collectionRef, queryStatement);

      const unsub = onSnapshot(q, (snapshot) => {
        setUser(snapshot.docs.map((doc) => doc.data())[0]);
      });

      return unsub;
    }
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      setReqSent(user.reqSent);
      setReqRec(user.reqRec);
    }
  }, [user]);

  return (
    <>
      {user && (
        <div className="chat-ui">
          <header>
            <div className="home">
              <h2 className="chat-ui-title" id="home-title">
                Keezy Chat App
              </h2>
              <h3>Home</h3>
            </div>
            <button className="sign-out-button" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

          <div className="empty-div"></div>

          <div className="main-page">
            <div className="section-one">
              <div className="search-section">
                <SearchBar currentUser={user} />
                {showResults && <SearchResults currentUser={user} />}
              </div>
              <div className="section-two">
                <UserInfo currentUser={user} />
              </div>
            </div>

            <div className="home-section-div">
              <section className="home-friend-section">
                <div className="friend-header">
                  <h3>Friends</h3>
                  {!showRequests ? (
                    <button
                      id="view-all-requests"
                      disabled={reqSent?.length === 0 && reqRec?.length === 0}
                      onClick={handleViewRequests}
                    >
                      view all requests
                    </button>
                  ) : (
                    <button id="view-all-requests" onClick={handleViewFriends}>
                      view friends
                    </button>
                  )}
                </div>
                <div className="all-friend-chats">
                  {!showRequests ? (
                    <AllChats category="friend" currentUser={user} />
                  ) : (
                    <ShowRequests
                      currentUser={user}
                      reqRec={reqRec}
                      reqSent={reqSent}
                    />
                  )}
                </div>
              </section>

              <section className="home-space-section">
                <div className="space-header">
                  <h3>Spaces</h3>
                  <Link className="react-link space-link">
                    Create New Space
                  </Link>
                  <Link className="react-link space-link">Community Space</Link>
                </div>

                <div className="all-space-chats">
                  <AllChats category="space" currentUser={user} />
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Home);
