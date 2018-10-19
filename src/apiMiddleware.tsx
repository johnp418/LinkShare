import { push } from "connected-react-router";
import { Dispatch } from "redux";
import { AxiosResponse, AxiosError } from "axios";

export default ({
  dispatch,
  getState
}: {
  dispatch: Dispatch;
  getState: any;
}) => {
  return (next: Function) => (action: any) => {
    const {
      types,
      callAPI,
      shouldCallAPI = () => true,
      payload = {},
      redirectTo
    } = action;
    if (!types) {
      return next(action);
    }
    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === "string")
    ) {
      throw new Error("Expected an array of three string types.");
    }
    if (typeof callAPI !== "function") {
      throw new Error("Expected callAPI to be a function.");
    }
    if (!shouldCallAPI(getState())) {
      return;
    }
    const [requestType, successType, failureType] = types;
    dispatch({ type: requestType, ...payload });
    return callAPI().then(
      (response: AxiosResponse) => {
        dispatch({ type: successType, ...payload, payload: response.data });
        if (redirectTo) {
          dispatch(push("/path/to/somewhere"));
        }
      },
      (error: AxiosError) =>
        dispatch({
          type: failureType,
          ...payload,
          payload: error
        })
    );
  };
};
