import { AnyAction } from "redux";

export default (state = {}, action: AnyAction) => {
  const { type, payload } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  console.log("ErrorSelector Payload ", payload);
  // const err = payload && payload.response.data.body;
  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]: requestState === "FAILURE" ? payload.response : ""
  };
};
