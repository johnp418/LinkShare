import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./configureStore";
import Routes from "./hot-routes";
import "normalize.css";
import "./index.css";
import "./test.scss";
// import aws from 'aws-sdk'
// import AWS from "aws-sdk";

// import Amplify, { Hub, Logger } from "aws-amplify";
import axios from "axios";
import awsConfig from "./aws-config";
import Amplify, { Auth } from "aws-amplify";
import {
  SET_CURRENT_USER,
  getUserInfo,
  getAuthenticatedUser
} from "./actions/user";
import { REQUEST, SUCCESS, FAILURE } from "./actions";
// import "./Watcher";

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",

    // REQUIRED - Amazon Cognito Region
    region: awsConfig.region,
    userPoolId: awsConfig.Auth.userPoolId,
    userPoolWebClientId: awsConfig.Auth.userPoolWebClientId

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: "XX-XXXX-X",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false

    // OPTIONAL - Configuration for cookie storage
    // cookieStorage: {
    //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //   domain: "localhost:3000",
    //   // OPTIONAL - Cookie path
    //   path: "/",
    //   // OPTIONAL - Cookie expiration in days
    //   expires: 365,
    //   // OPTIONAL - Cookie secure flag
    //   secure: true
    // }

    // OPTIONAL - customized storage object
    // storage: new MyStorage(),

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

const store = configureStore();

// @ts-ignore
store.dispatch(getAuthenticatedUser);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
