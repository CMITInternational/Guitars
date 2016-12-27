import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Modal, Button } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';
import AppPropTypes from './PropTypes';
import type IApp from './IApp';
import Menu from 'react-burger-menu/lib/menus/stack';

type IProps = {
  app: IApp,
  loadAppAsync: Function,
  showAuth: Function,
  authenticateAsAdmin: Function,
  redirect: Function,
  children: any
}

export class App extends React.Component {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes),
    loadAppAsync: React.PropTypes.func.isRequired,
    redirect: React.PropTypes.func.isRequired,
    showAuth: React.PropTypes.func.isRequired,
    authenticateAsAdmin: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      expanded: false
    };

    this.hideAuthModal = this.hideAuthModal.bind(this);
    this.generateOnSelect = this.generateOnSelect.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
  }

  onMenuStateChange (state) {
    this.setState({
      expanded: state.isOpen
    });
  }

  generateOnSelect (path) {
    return () => {
      this.setState({
        expanded: false
      }, () => { this.props.redirect(path); });
    };
  }

  hideAuthModal () {
    this.props.showAuth(false);
  }

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
    return (this.props.app.isReady)
    ? (
      <div>
        <Menu right isOpen={this.state.expanded} onStateChange={this.onMenuStateChange}>
          <div onClick={this.generateOnSelect('/')} className="menu-item">Home</div>
          <div onClick={this.generateOnSelect('/products')} className="menu-item">Products</div>
          <div onClick={this.generateOnSelect('/contacts')} className="menu-item">Contact Us</div>
        </Menu>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              PJB Guitars
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        <Modal show={this.props.app.showAuth} bsSize="lg" onHide={this.hideAuthModal}>
          <Modal.Title>Admin Authentication</Modal.Title>
          <Modal.Body>
            <Button onClick={this.hideAuthModal}>Go</Button>
          </Modal.Body>
        </Modal>
        <div className="page-container">
          <div className="view-container">
            {this.props.children}
          </div>
        </div>
        <Alert stack={{limit: 5}} timeout={5000} position="bottom" spacing={50} offset={50} effect="slide" html />
      </div>
    )
    : null;
  }
}

const mapStateToProps = (state) => ({
  app: state.app
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    loadAppAsync: appActions.loadAppAsync,
    redirect: routerActions.push,
    showAuth: appActions.showAuth,
    authenticateAsAdmin: appActions.authenticateAsAdmin
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
