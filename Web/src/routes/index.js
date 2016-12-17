import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from '../views/Home';
import App from '../containers/App';

export default (store) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
    </Route>
  );
};
