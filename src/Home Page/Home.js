import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useParams } from "react-router";
import { logout, db, createSpace } from "../Utilities/firebaseUtils";
import { useDataLayerValue } from "../Utilities/reuseFunctions";
import { AllChats } from "./AllChats";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { UserInfo } from "./UserInfo";
import { ShowRequests } from "./ShowRequests";
import { PromptModal } from "../Modals/PromptModal";
import { collection, where, query, onSnapshot } from "@firebase/firestore";

const Home = () => {
  const [{ showResults, showRequests }, dispatch] = useDataLayerValue();
  const [user, setUser] = useState([]);
  const [state, setState] = useState({ modalOpen: false, text: "" });
  const { id } = useParams();

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const queryStatement = where("id", "==", id);
    const q = query(collectionRef, queryStatement);
    const unsub = onSnapshot(q, (snapshot) => {
      const info = snapshot.docs.map((doc) => doc.data());
      setUser(info[0]);
    });
    return unsub;
  }, [id]);

  const handleSpaceName = () => {
    if (state.text) {
      createSpace(user, state.text).then(handleCancel());
    }
    handleCancel();
  };

  const handleCancel = () => {
    setState({ ...state, modalOpen: false, text: "" });
  };

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
                <SearchBar currentUserID={id} />
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
                      disabled={
                        user.reqSent?.length === 0 && user.reqRec?.length === 0
                      }
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
                    <AllChats chats={user.friends} category="friend" />
                  ) : (
                    <ShowRequests currentUser={user} />
                  )}
                </div>
              </section>

              <section className="home-space-section">
                <div className="space-header">
                  <h3>Spaces</h3>
                  <button
                    onClick={() => {
                      setState({ ...state, modalOpen: true });
                    }}
                    id="create-new-space"
                  >
                    Create New Space
                  </button>
                  <Link
                    to={`/chatpage/${user?.community?.chatID}`}
                    className="react-link space-link"
                  >
                    Community Space
                  </Link>
                </div>

                <div className="all-space-chats">
                  <AllChats chats={user.spaces} category="space" />
                </div>
              </section>
            </div>
          </div>
          {state.modalOpen && (
            <PromptModal
              handleConfirm={handleSpaceName}
              handleCancel={handleCancel}
              stateText={state}
              setStateText={setState}
              title="Enter The New Space Name"
            />
          )}
        </div>
      )}
    </>
  );
};

export default withRouter(Home);
