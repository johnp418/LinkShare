import * as React from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import Dashboard from "./Dashboard";
export default () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </div>
  );
};
