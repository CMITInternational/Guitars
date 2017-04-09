/**
 * Created by Darcy on 18/08/2016.
 */
import React from 'react'

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import makeRoutes from '../../routes';
import Root from './';
import configureStore from '../configureStore';
import { routerActions } from 'react-router-redux';

import {mount, render, shallow} from 'enzyme'
import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme'

import fetchMock from 'fetch-mock'

// Configure history for react-router
const browserHistory = useRouterHistory(createHistory)({
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

chai.use(chaiEnzyme()) // Note the invocation at the end

fetchMock.get('/appConfig.json', {
    "ProjectSetting": "Guitars",
    "clientAppSettings": {
      "build": "0.0.0.0",
      "apiUrl": "http://localhost:61154/api/",
      "assetUrl": "http://localhost:61154/",
      "admin": "bkllTXRlTA=="
    }
  }
);

fetchMock.get('http://localhost:61154/api/portfolio',{});

describe('Root', () => {
  it('should mount', (done: Function) => {
    const wrapper = mount(<Root history={history} routes={routes} store={store} />);

    store.dispatch(routerActions.push('/products'));

    console.log(wrapper.debug());

    expect(true).to.be.true;

    done();
  });
});