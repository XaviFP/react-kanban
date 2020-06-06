import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import * as serviceWorker from "./serviceWorker";
import history from "./history";
import Kanban from "./Kanban";
import kanbanReducer from "./reducers";
import { saveState } from "./localStorage";
import thunkMiddleware from "redux-thunk";

const loggerMiddleware = createLogger();
// const preloadedState = loadState();
const store = createStore(
  kanbanReducer,
  // preloadedState,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);
store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Provider store={store}>
        <Kanban />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
