import { Auth } from "aws-amplify";
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from ".";
import { AppState } from "src/types";
import { Dispatch } from "redux";
import { push } from "connected-react-router";
import { ISignUpResult } from "amazon-cognito-identity-js";
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
  return Auth.currentUserInfo().then(
    userInfo => {
      if (userInfo) {
        const {
          attributes: { email },
          username
        } = userInfo;
        dispatch({
          type: SET_CURRENT_USER[SUCCESS],
          payload: { username, email }
        });
        // Retrieve user info
        dispatch(getUserInfo() as any);
      } else {
        console.log("UserInfo is empty");
      }
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

export const login = (email: string, password: string) => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch({ type: USER_SIGN_IN[REQUEST] });
    return Auth.signIn(email, password).then(
      response => {
        dispatch({ type: USER_SIGN_IN[SUCCESS] });
        // TODO: redirect user to previous link
        dispatch(push("/"));
      },
      err => {
        dispatch({ type: USER_SIGN_IN[FAILURE], payload: err });
      }
    );
  };
};

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
      response => {
        dispatch({ type: USER_SIGN_OUT[SUCCESS] });
      },
      err => {
        dispatch({ type: USER_SIGN_OUT[FAILURE], payload: err });
      }
    );
  };
};
