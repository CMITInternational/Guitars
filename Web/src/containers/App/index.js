import 'babel-polyfill';
import 'es6-shim';
import 'isomorphic-fetch';
import '../../styles/core.scss';
import 'react-select/scss/default.scss';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'fixed-data-table/dist/fixed-data-table.min.css';
import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appContainerActions from './Actions';
import Alert from 'react-s-alert';
import { Link } from 'react-router';
import Menu from '../../components/PJBMenu';

export class App extends React.Component {
  static propTypes = {
    app: React.PropTypes.shape({}),
    loadAppAsync: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired
  };

  componentWillMount () {
  }

  componentWillUnmount () {
  };

  componentDidMount () {
    this.props.loadAppAsync();
  };

  componentWillReceiveProps (nextProps) {
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.app.isReady;
  }

  componentWillUpdate (nextProps, nextState) {
  }

  componentDidUpdate (prevProps, prevState) {
  }

  render () {
    return (
      <div>
        <Menu />
        <header className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-header">
            <div>
              <Link className="navbar-brand" to="/" >
                PJB Guitars
              </Link>
            </div>
          </div>
        </header>
        <div className="page-container">
          <div className="view-container">
            {this.props.children}
          </div>
        </div>
        <footer className="navbar-fixed-bottom navbar-default">
          <a className="navbar-left">&copy; CMIT International 2016</a>
        </footer>
        <Alert stack={{limit: 5}} timeout={5000} position="bottom" spacing={50} offset={50} effect="slide" html />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    loadAppAsync: appContainerActions.loadAppAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
