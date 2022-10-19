import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";

/* --------- Components Imports ---------*/
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import SpotBrowser from "./components/Spots"
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
// import OwnersSpot from "./components/OwnersSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <SpotBrowser/>
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          {/* <Route exact path="/spots/current">
            <OwnersSpot/>
          </Route> */}
          <Route exact path="/spots/:spotId">
            <SpotDetails/>
          </Route>
          <Route exact path="/spots">
            <CreateSpotForm/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
