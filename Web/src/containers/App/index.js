import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Modal, Glyphicon, Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import AppPropTypes from './PropTypes';
import type IApp from './IApp';
import Menu from 'react-burger-menu/lib/menus/stack';
import DocumentTitle from 'react-document-title';

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
      expanded: false,
      authPwd: ''
    };

    this.hideAuthModal = this.hideAuthModal.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.generateRedirect = this.generateRedirect.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
    this.onValidAuth = this.onValidAuth.bind(this);
    this.renderLoginModal = this.renderLoginModal.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.updatePwd = this.updatePwd.bind(this);
  }

  updatePwd (evt) {
    this.setState({
      authPwd: evt.target.value
    });
  }

  onValidAuth () {
    this.props.authenticateAsAdmin(this.state.authPwd)
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

  generateRedirect (fn: Function) {
    return () => {
      this.setState({
        expanded: false
      }, () => { fn(); });
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
          <Form inline>
            <FormGroup controlId="password">
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" onChange={this.updatePwd} value={this.state.authPwd} />
            </FormGroup>
            <Button onClick={this.onValidAuth}>Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  renderHeader (docTitle : string) {
    let logOutButton = (this.props.app.isAdmin === true)
      ? (<div onClick={this.logOut} className="menu-item">LogOut</div>)
      : (<div />);
    let logInButton = (this.props.app.isAdmin === false)
      ? (<Button bsSize="small" onClick={this.logIn}><Glyphicon glyph="wrench" /></Button>)
      : `${(this.props.app.isAdmin) ? '(Admin)' : ''}`;
    let title = docTitle;
    let brand = (<div>{title} {logInButton}</div>);

    if (this.props.app.showHeader) {
      return (
        <div>
          <Menu right isOpen={this.state.expanded} onStateChange={this.onMenuStateChange}>
            <div onClick={this.generateRedirect(this.props.redirectToHome)} className="menu-item">Home</div>
            <div onClick={this.generateRedirect(this.props.redirectToProducts)} className="menu-item">Products</div>
            <div onClick={this.generateRedirect(this.props.redirectToContactUs)} className="menu-item">Contact Us</div>
            {logOutButton}
          </Menu>
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                {brand}
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    let docTitle = 'Phillip J Buttrose Pty Ltd';

    return (this.props.app.isReady)
    ? (
      <DocumentTitle title={docTitle}>
        <div style={{height: '100%'}}>
          {this.renderHeader(docTitle)}
          {this.renderLoginModal()}
          <div className="page-container" style={{height: '100%'}}>
            <div className="view-container" style={{height: '100%'}}>
              {this.props.children}
            </div>
          </div>
          <Alert stack={{limit: 5}} timeout={5000} position="bottom" spacing={50} offset={50} effect="slide" html />
        </div>
      </DocumentTitle>
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
