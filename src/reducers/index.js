import { combineReducers } from "redux";
import * as actionTypes from "../actions";

import loading from "./loading";
import error from "./error";

// const repositoriesActionHandlers = {
//   [actionTypes.FETCH_REPOSITORIES.REQUEST]:
// }
const {
  FETCH_REPOSITORY,
  FETCH_REPOSITORIES,
  UPDATE_REPOSITORY,
  DELETE_REPOSITORY,
  IMPORT_REPOSITORY
} = actionTypes;

const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_REPOSITORIES.SUCCESS:
      const { payload } = action;
      const nextState = { ...state };
      payload.forEach(repo => {
        nextState[repo.id] = repo;
      });
      return nextState;
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case FETCH_REPOSITORIES.SUCCESS:
      const { payload } = action;
      return payload.map(repo => repo.id);
    default:
      return state;
  }
};

const activeRepository = (
  state = {
    root: []
  },
  action
) => {
  switch (action.type) {
    case IMPORT_REPOSITORY.SUCCESS:
    case FETCH_REPOSITORY.SUCCESS:
      const { title, root, id } = action.payload;
      return {
        ...state,
        title: title || state.title,
        id: id || state.id,
        root
      };
    default:
      return state;
  }
};

const repositories = combineReducers({
  byId,
  allIds
});

const repositoryNodes = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_REPOSITORY.SUCCESS:
    case FETCH_REPOSITORY.SUCCESS:
      const { repository } = action.payload;
      return { ...state, ...repository };
    default:
      return state;
  }
};

const links = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_REPOSITORY.SUCCESS:
    case FETCH_REPOSITORY.SUCCESS:
      const { link } = action.payload;
      return { ...state, ...link };
    default:
      return state;
  }
};

const entity = combineReducers({
  activeRepository,
  repositories,
  repositoryNodes,
  links
});

const ui = combineReducers({
  loading,
  error
});

export default combineReducers({
  entity,
  ui
});
