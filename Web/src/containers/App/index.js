import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Button } from 'react-bootstrap';
import AppPropTypes from './PropTypes';
import type IApp from './IApp';
import Menu from 'react-burger-menu/lib/menus/stack';
import DocumentTitle from 'react-document-title';
import ToggleDisplay from 'react-toggle-display';
import { Form, ValidatedInput } from '../../components/ValidatedInput';

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

    this.hideAuth = this.hideAuth.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.generateRedirect = this.generateRedirect.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
    this.onValidAuth = this.onValidAuth.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  onValidAuth (values) {
    this.props.authenticateAsAdmin(values.password)
      .then(() => {
        this.hideAuth();
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

  hideAuth () {
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

  renderHeader (docTitle : string) {
    let logOutButton = (this.props.app.isAdmin === true)
      ? (<div onClick={this.logOut} className="menu-item">LogOut</div>)
      : (<div />);
    let logInButton = (this.props.app.isAdmin === false)
      ? (<span style={{cursor: 'pointer'}} onClick={this.logIn}>.</span>)
      : `${(this.props.app.isAdmin) ? '(Admin)' : ''}`;
    let title = docTitle;
    let brand = (<div>{title} {logInButton}</div>);

    if (this.props.app.showHeader) {
      var bmTop = 50 + ((this.props.app.isAdmin) ? this.props.app.bmOffset : 0);
      var bmStyles = {
        bmOverlay: {
          top: `${bmTop}px`
        },
        bmMenuWrap: {
          top: `${bmTop}px`
        }
      };

      return (
        <div>
          <div>&nbsp;</div>
          <Menu right isOpen={this.state.expanded} onStateChange={this.onMenuStateChange} styles={bmStyles}>
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
              <ToggleDisplay show={this.props.app.showAuth}>
                <Form onValidSubmit={this.onValidAuth}>
                  <ValidatedInput
                    name="password"
                    type="password"
                    label="Password"
                    validate="required"
                    errorHelp={{
                      required: 'Please specify a password'
                    }}
                  />
                  <Button type="submit" bsStyle="primary">Submit</Button>
                  <Button onClick={this.hideAuth}>Cancel</Button>
                </Form>
              </ToggleDisplay>
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
