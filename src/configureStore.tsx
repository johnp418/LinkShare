import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk, { ThunkMiddleware } from "redux-thunk";
// import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import apiMiddleware from "./apiMiddleware";
// import rootSaga from './sagas';
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

export const history = createBrowserHistory();
// const sagaMiddleware = createSagaMiddleware();

// Add middlewares / enhancers here
// const middlewares = [routerMiddleware(history), thunk, sagaMiddleware, createLogger()];
let middlewares = [
  routerMiddleware(history),
  thunk as ThunkMiddleware,
  apiMiddleware
];

// tslint:disable-next-line
const enhancers: any[] = [];

// Install Chrome extension for Redux devtools
// https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
if (process.env.NODE_ENV === "development") {
  // https://github.com/leoasis/redux-immutable-state-invariant
  // middlewares.unshift(reduxImmutableStateInvariant());
  middlewares = [
    reduxImmutableStateInvariant(),
    ...middlewares,
    createLogger()
  ];

  // tslint:disable-next-line
  const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

// Initial State
const initialState = {};

const configureStore = (state = initialState) => {
  const store = createStore(
    connectRouter(history)(rootReducer),
    state,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  );

  // Start sagas
  // sagaMiddleware.run(rootSaga);

  if ((module as any).hot) {
    (module as any).hot.accept("./reducers", () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
};

export default configureStore;
