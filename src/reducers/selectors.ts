import * as _ from "lodash";

// TODO: use ramda
export const createLoadingSelector = (actions: any) => (state: any) => {
  // returns true only when all actions is not loading
  return _.some(actions, (action: any) => _.get(state, `ui.loading.${action}`));
};
export const createErrorMessageSelector = (actions: any) => (state: any) => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  return (
    _(actions)
      .map((action: any) => _.get(state, `ui.error.${action}`))
      .compact()
      .first() || ""
  );
};
