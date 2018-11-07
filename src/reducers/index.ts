import { combineReducers, AnyAction } from "redux";
import loading from "./loading";
import error from "./error";
import currentUser from "./currentUser";
import {
  FETCH_REPOSITORIES,
  IMPORT_REPOSITORY,
  FETCH_REPOSITORY,
  DELETE_REPOSITORY
} from "src/actions/repository";
import { Repository } from "src/types";
import { SUCCESS } from "src/actions";

// TODO: Delete repo
const byId = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case DELETE_REPOSITORY[SUCCESS]: {
      const { payload } = action;
      const nextState = { ...state };
      delete nextState[payload];
      return nextState;
    }
    case FETCH_REPOSITORIES[SUCCESS]: {
      const { payload } = action;
      const nextState = { ...state };
      payload.forEach((repo: Repository) => {
        nextState[repo.id] = repo;
      });
      return nextState;
    }
    default:
      return state;
  }
};

// TODO: Delete repo
const allIds = (state = [], action: AnyAction) => {
  switch (action.type) {
    case FETCH_REPOSITORIES[SUCCESS]:
      const { payload } = action;
      return payload.map((repo: Repository) => repo.id);
    default:
      return state;
  }
};

const activeRepository = (
  state = {
    root: []
  },
  action: AnyAction
) => {
  switch (action.type) {
    case IMPORT_REPOSITORY[SUCCESS]:
    case FETCH_REPOSITORY[SUCCESS]:
      return { ...state, ...action.payload };
    case DELETE_REPOSITORY[SUCCESS]:
      return [];
    default:
      return state;
  }
};

const repositories = combineReducers({
  byId,
  allIds
});

const repositoryNodes = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case IMPORT_REPOSITORY[SUCCESS]:
    case FETCH_REPOSITORY[SUCCESS]:
      const { repository } = action.payload;
      return repository;
    case DELETE_REPOSITORY[SUCCESS]:
      return {};
    default:
      return state;
  }
};

const links = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case IMPORT_REPOSITORY[SUCCESS]:
    case FETCH_REPOSITORY[SUCCESS]:
      const { link } = action.payload;
      return link;
    case DELETE_REPOSITORY[SUCCESS]:
      return {};
    default:
      return state;
  }
};

const entity = combineReducers({
  repositories,
  repositoryNodes,
  links
});

const ui = combineReducers({
  loading,
  error
});

export default combineReducers({
  activeRepository,
  entity,
  ui,
  currentUser
});
