import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Modal, ButtonInput, Glyphicon, Button } from 'react-bootstrap';
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
  redirectToHome: Function,
  redirectToProducts: Function,
  redirectToContactUs: Function,
  children: any
}

export class App extends React.Component {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes),
    loadAppAsync: React.PropTypes.func.isRequired,
    redirectToHome: React.PropTypes.func.isRequired,
    redirectToProducts: React.PropTypes.func.isRequired,
    redirectToContactUs: React.PropTypes.func.isRequired,
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
    this.generateRedirectToHome = this.generateRedirectToHome.bind(this);
    this.generateRedirectToProducts = this.generateRedirectToProducts.bind(this);
    this.generateRedirectToContactUs = this.generateRedirectToContactUs.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
    this.onValidAuth = this.onValidAuth.bind(this);
    this.renderLoginModal = this.renderLoginModal.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
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

  generateRedirectToHome () {
    return () => {
      this.setState({
        expanded: false
      }, () => { this.props.redirectToHome(); });
    };
  }

  generateRedirectToProducts () {
    return () => {
      this.setState({
        expanded: false
      }, () => { this.props.redirectToProducts(); });
    };
  }

  generateRedirectToContactUs () {
    return () => {
      this.setState({
        expanded: false
      }, () => { this.props.redirectToContactUs(); });
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

  renderLoginModal () {
    return (
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
    );
  }

  renderHeader () {
    let logOutButton = (this.props.app.isAdmin === true)
      ? (<div onClick={this.logOut} className="menu-item">LogOut</div>)
      : (<div />);
    let logInButton = (this.props.app.isAdmin === false)
      ? (<Button bsSize="small" onClick={this.logIn}><Glyphicon glyph="wrench" /></Button>)
      : `${(this.props.app.isAdmin) ? '(Admin)' : ''}`;
    let brand = (<div>Phillip J Buttrose Pty Ltd / Australian Handcrafted Guitars {logInButton}</div>);

    if (this.props.app.showHeader) {
      return (
        <div>
          <Menu right isOpen={this.state.expanded} onStateChange={this.onMenuStateChange}>
            <div onClick={this.generateRedirectToHome()} className="menu-item">Home</div>
            <div onClick={this.generateRedirectToProducts()} className="menu-item">Products</div>
            <div onClick={this.generateRedirectToContactUs()} className="menu-item">Contact Us</div>
            {logOutButton}
          </Menu>
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                {brand}
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Navbar>
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    return (this.props.app.isReady)
    ? (
      <div>
        {this.renderHeader()}
        {this.renderLoginModal()}
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
    redirectToHome: appActions.redirectToHome,
    redirectToProducts: appActions.redirectToProducts,
    redirectToContactUs: appActions.redirectToContactUs,
    showAuth: appActions.showAuth,
    logOut: appActions.logOut,
    authenticateAsAdmin: appActions.authenticateAsAdmin
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
