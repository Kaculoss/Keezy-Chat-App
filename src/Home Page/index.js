import React from "react";
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
import Home from "./Home";

const Index = () => {
  const currentUser = useAuth();

  return (
    <>
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
    </>
  );
};

function Error() {
  return <Redirect to={"/"} />;
}

export default Index;
