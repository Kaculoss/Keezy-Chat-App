import React from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import ChatPage from "../Chats/ChatPage";
import { SignInPage } from "../Sign In/SignInPage";
import { useAuth } from "../Utilities/firebaseUtils";
import { ProtectedRoute } from "../Utilities/react-router-utils";
import { DataLayer, initialState, reducer } from "../Utilities/reuseFunctions";
import Home from "./Home";

const Index = () => {
  const currentUser = useAuth();

  return (
    <>
      <DataLayer initialState={initialState} reducer={reducer}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <SignInPage />
            </Route>
            <ProtectedRoute
              path="/home/:id"
              component={Home}
              isAuth={currentUser}
            />
            <ProtectedRoute
              path="/chatpage/:chatID"
              component={ChatPage}
              isAuth={currentUser}
            />
            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </Router>
      </DataLayer>
    </>
  );
};

function Error() {
  return <Redirect to={"/"} />;
}

export default Index;
