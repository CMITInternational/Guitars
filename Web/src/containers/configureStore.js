import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../containers/Root/Reducer';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';

export default function configureStore (initialState = {}, history, loggerOptions) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk, routerMiddleware(history), loggerOptions && createLogger(loggerOptions));
  if (__DEBUG__) {
    const devTools = window.devToolsExtension
      ? window.devToolsExtension()
      : require('../containers/Root/DevTools').default.instrument();
    middleware = compose(middleware, devTools);
  }

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(reducer, initialState);

  if (module.hot) {
    module.hot.accept('../containers/Root/Reducer', () => {
      const nextRootReducer = require('../containers/Root/Reducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
