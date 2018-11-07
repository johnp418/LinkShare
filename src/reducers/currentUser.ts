import { CurrentUser } from "src/types";
import { AnyAction } from "redux";
import {
  SET_CURRENT_USER,
  USER_SIGN_OUT,
  USER_SIGN_IN
} from "src/actions/user";
import { SUCCESS } from "src/actions";

const currentUser = (state = null as CurrentUser | null, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_USER[SUCCESS]: {
      const { email, username } = action.payload;
      return { ...state, email, username };
    }
    case USER_SIGN_IN[SUCCESS]: {
      const {
        signInUserSession: {
          idToken: {
            payload: { email, sub }
          }
        }
      } = action.payload;
      return { ...state, username: sub, email };
    }
    case USER_SIGN_OUT[SUCCESS]:
      console.log("Sign out ");
      return null;
    default:
      return state;
  }
};

export default currentUser;
