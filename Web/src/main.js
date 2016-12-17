import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import syncHistoryWithStore from 'react-router-redux/lib/sync';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './containers/configureStore';

// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
});

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
let initialState = window.__INITIAL_STATE__;
// comment the following three lines to remove persistence of state
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
});

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = makeRoutes(store);

// Now that redux and react-router have been configured, we can render the
// React application to the DOM!
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
);
