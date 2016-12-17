import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from '../App/Reducer';

export default combineReducers({
  router,
  app
});
