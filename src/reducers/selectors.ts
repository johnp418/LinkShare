// import { createSelector } from "reselect";
import * as _ from "lodash";
import { AppState } from "src/types";

// TODO: use ramda
export const createLoadingSelector = (actions: string[]) => (
  state: AppState
) => {
  // returns true only when all actions is not loading
  return _.some(actions, (action: string) =>
    _.get(state, `ui.loading.${action}`)
  );
};
export const createErrorMessageSelector = (actions: string[]) => (
  state: AppState
): string => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  return _(actions)
    .map((action: string) => _.get(state, `ui.error.${action}`))
    .compact()
    .first();
};

// Application Selectors
export const getRepository = (state: AppState, id: string) =>
  state.entity.repositories.byId[id];
export const getCurrentUser = (state: AppState) => state.currentUser;
export const getActiveRepository = (state: AppState) => state.activeRepository;
