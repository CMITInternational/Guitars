import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Modal, ButtonInput } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';
import AppPropTypes from './PropTypes';
import type IApp from './IApp';
import Menu from 'react-burger-menu/lib/menus/stack';
import { Form, ValidatedInput } from 'react-bootstrap-validation';

type IProps = {
  app: IApp,
  loadAppAsync: Function,
  showAuth: Function,
  logOut: Function,
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
    logOut: React.PropTypes.func.isRequired,
    authenticateAsAdmin: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      expanded: false
    };

    this.hideAuthModal = this.hideAuthModal.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.generateOnSelect = this.generateOnSelect.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
    this.onValidAuth = this.onValidAuth.bind(this);
  }

  onValidAuth (values) {
    this.props.authenticateAsAdmin(values.password)
      .then(() => {
        this.hideAuthModal();
      })
      .catch(() => {
        Alert.error('Authentication Failed');
      });
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

  logIn () {
    this.setState({
      expanded: false
    }, () => { this.props.showAuth(true); });
  }

  logOut () {
    this.setState({
      expanded: false
    }, () => { this.props.logOut(false); });
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
    let brand = `PJB Guitars ${(this.props.app.isAdmin) ? '(Admin)' : ''}`;
    let logInButton = (this.props.app.isAdmin === false)
      ? (<div onClick={this.logIn} className="menu-item">Admin</div>)
      : (<div onClick={this.logOut} className="menu-item">LogOut</div>);

    return (this.props.app.isReady)
    ? (
      <div>
        <Menu right isOpen={this.state.expanded} onStateChange={this.onMenuStateChange}>
          <div onClick={this.generateOnSelect('/')} className="menu-item">Home</div>
          <div onClick={this.generateOnSelect('/products')} className="menu-item">Products</div>
          <div onClick={this.generateOnSelect('/contacts')} className="menu-item">Contact Us</div>
          {logInButton}
        </Menu>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              {brand}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        <Modal show={this.props.app.showAuth} bsSize="lg" onHide={this.hideAuthModal}>
          <Modal.Title>Admin Authentication</Modal.Title>
          <Modal.Body>
            <Form onValidSubmit={this.onValidAuth}>
              <ValidatedInput
                type="password"
                name="password"
                label="Password"
                // You can pass params to validation rules
                validate="required,isLength:7"
                errorHelp={{
                  required: 'Please specify a password',
                  isLength: 'Password must be 7 characters'
                }}
              />
              <ButtonInput
                type="submit"
                bsSize="large"
                bsStyle="primary"
                value="Login"
              />
            </Form>
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
    logOut: appActions.logOut,
    authenticateAsAdmin: appActions.authenticateAsAdmin
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
