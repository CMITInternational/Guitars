/**
 * Created by Darcy on 18/08/2016.
 */
import React from 'react'
import {mount, render, shallow} from 'enzyme'
import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

chai.use(chaiEnzyme()) // Note the invocation at the end

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  results: false
});

const setResults = (data): Action => {
  return {
    type: 'GET_RESULTS',
    payload: data
  }
};

const loadResults = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function): void => {
      dispatch(setResults('hello'));
      resolve('done');
    });
  }
};

class Fixture extends React.Component {
  static propTypes = {
    results: React.PropTypes.any,
    loader: React.PropTypes.func
  };

  render () {
    return (
      <div>
        <input id='checked' defaultChecked />
        <input id='not' defaultChecked={false} />
        <input id='results' defaultChecked={this.props.results} />
        <button id="clickMe" onClick={this.props.loader}>Go</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  results: state.results
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    loader: loadResults
  }, dispatch);
};


const ConnectedFixture = connect(mapStateToProps, mapDispatchToProps)(Fixture);

const wrapper = mount(<Provider store={store}><ConnectedFixture /></Provider>) // mount/render/shallow when applicable

describe('fixture',() => {
  it('should set checked to true',() => {
    expect(wrapper.find('#checked')).to.be.checked();
  });
  it('should set not to false',() => {
    expect(wrapper.find('#not')).to.not.be.checked();
  });
  it('should set results to false',() => {
    expect(wrapper.find('#results')).to.not.be.checked();
  });
});
