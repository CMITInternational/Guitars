import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from '../containers/Home';
import App from '../containers/App';
import Products from '../containers/Products';
import Product from '../containers/Product';
import ContactUs from '../containers/ContactUs';

export default (store) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="products" component={Products} />
      <Route path="product/:id" component={Product} />
      <Route path="contacts" component={ContactUs} />
    </Route>
  );
};
