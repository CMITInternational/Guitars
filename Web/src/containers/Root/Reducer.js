import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from '../App/Reducer';
import products from '../Products/Reducer';
import product from '../Product/Reducer';

export default combineReducers({
  router,
  app,
  products,
  product
});
