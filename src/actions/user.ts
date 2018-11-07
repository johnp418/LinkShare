import { Auth } from "aws-amplify";
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from ".";
import { AppState } from "src/types";
import { Dispatch } from "redux";
import { push } from "connected-react-router";
import {
  ISignUpResult,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken
} from "amazon-cognito-identity-js";
import axios from "axios";

export const SET_CURRENT_USER = createRequestTypes("SET_CURRENT_USER");
export const GET_USER_DATA = createRequestTypes("GET_USER_DATA");
export const USER_SIGN_IN = createRequestTypes("USER_SIGN_IN");
export const USER_SIGN_UP = createRequestTypes("USER_SIGN_UP");
export const USER_SIGN_OUT = createRequestTypes("USER_SIGN_OUT");

export const getUserInfo = () => {
  return {
    types: [
      GET_USER_DATA[REQUEST],
      GET_USER_DATA[SUCCESS],
      GET_USER_DATA[FAILURE]
    ],
    callAPI: () => axios.get("/user/data")
  };
};

export const getAuthenticatedUser = (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  dispatch({ type: SET_CURRENT_USER[REQUEST] });
  return Auth.currentSession().then(
    (currentSession: CognitoUserSession) => {
      console.log("CurrentSession ", currentSession);
      const accessToken: CognitoAccessToken = currentSession.getAccessToken();
      const accessJwtToken = accessToken.getJwtToken();
      const idToken: CognitoIdToken = currentSession.getIdToken();
      const decodedPayload = idToken.decodePayload();
      dispatch({
        type: SET_CURRENT_USER[SUCCESS],
        payload: {
          username: decodedPayload["cognito:username"],
          email: decodedPayload.email
        }
      });

      // Set authorization header from now on
      axios.defaults.headers.common.Authorization = accessJwtToken;

      // Retrieve user info
      // @ts-ignore
      dispatch(getUserInfo());
    },
    err => {
      console.log("SetCurrentUser fail ", err);
      dispatch({
        type: SET_CURRENT_USER[FAILURE],
        payload: err
      });
    }
  );
};

export const login = ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch({ type: USER_SIGN_IN[REQUEST] });
    return Auth.signIn(email, password).then(
      response => {
        console.log("SignIn Result ", response);
        dispatch({ type: USER_SIGN_IN[SUCCESS], payload: response });
        // TODO: redirect user to previous link
        dispatch(push("/"));
      },
      err => {
        dispatch({ type: USER_SIGN_IN[FAILURE], payload: err });
      }
    );
  };
};

// TODO: Test this
export const signUp = (email: string, password: string) => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch({ type: USER_SIGN_UP[REQUEST] });
    return Auth.signUp({ username: email, password }).then(
      (response: ISignUpResult) => {
        dispatch({ type: USER_SIGN_UP[SUCCESS] });
      },
      err => {
        dispatch({ type: USER_SIGN_UP[FAILURE], payload: err });
      }
    );
  };
};

export const signOut = () => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch({ type: USER_SIGN_OUT[REQUEST] });
    return Auth.signOut().then(
      () => {
        dispatch({ type: USER_SIGN_OUT[SUCCESS] });
      },
      err => {
        dispatch({ type: USER_SIGN_OUT[FAILURE], payload: err });
      }
    );
  };
};
