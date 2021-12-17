import React from "react";
import "./index.css";
import {
  DataLayer,
  initialState,
  ProtectedRoute,
  reducer,
} from "./Utilities/OthersUtils";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { SignInPage } from "./Sign In/SignInPage";
import Home from "./Home Page/Home";
import ChatPage from "./Chat Page/ChatPage";
import { useAuth } from "./Utilities/firebaseUtilsUpdated";

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

export function Error() {
  return <Redirect to={"/"} />;
}

export default Index;
