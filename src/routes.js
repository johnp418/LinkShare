import * as React from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import AWS from "aws-sdk";
import { Auth } from "aws-amplify";
import { withAuthenticator, Authenticator } from "aws-amplify-react"; // or 'aws-amplify-react-native';
import withMaterial from "./withMaterial";
import Navbar from "./views/Navbar";
import RepositoryList from "./views/RepositoryList";
import RepositoryDetailView from "./views/RepositoryDetailView";
import CreateRepository from "./views/CreateRepository";

import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Playground from "./Playground";

const Body = styled.div`
  display: flex;
  height: 100%;
`;

const Routes = props => {
  return (
    <Body>
      <Navbar />
      <Switch>
        <Route exact path="/" component={RepositoryList} />
        <Route path="/playground" component={Playground} />
        <Route path="/list/:repositoryId" component={RepositoryDetailView} />
        <Route path="/repo/create" component={CreateRepository} />
        <Route path="/auth/login" component={SignIn} />
        <Route path="/auth/signUp" component={SignUp} />
      </Switch>
    </Body>
  );
};

export default withMaterial(Routes);
