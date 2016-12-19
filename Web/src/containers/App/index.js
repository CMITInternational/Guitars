import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appContainerActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';

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
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              PJB Guitars
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem><Link to="/" className="menu-item">Home</Link></NavItem>
              <NavItem><Link to="/products" className="menu-item">Products</Link></NavItem>
              <NavItem><Link to="/contacts" className="menu-item">Contact Us</Link></NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="page-container">
          <div className="view-container">
            {this.props.children}
          </div>
        </div>
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
