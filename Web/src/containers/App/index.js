import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { bindActionCreators } from 'redux';
import appContainerActions from './Actions';
import Alert from 'react-s-alert';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';

export class App extends React.Component {
  static propTypes = {
    app: React.PropTypes.shape({}),
    loadAppAsync: React.PropTypes.func.isRequired,
    redirect: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired
  };

  constructor () {
    super();

    this.state = {
      expanded: false
    };

    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.generateOnSelect = this.generateOnSelect.bind(this);
  }

  onToggle (val) {
    console.log(`onToggle val(${JSON.stringify(val)})`);
    this.setState({
      expanded: val
    });
  }

  onSelect (path) {
    console.log(`onSelect path(${JSON.stringify(path)})`);
    this.setState({
      expanded: false
    });
    this.props.redirect(path);
  }

  generateOnSelect (path) {
    return () => {
      this.onSelect(path);
    };
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
    return (
      <div>
        <Navbar expanded={this.state.expanded} onToggle={this.onToggle} fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              PJB Guitars
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={this.generateOnSelect('/')} className="menu-item">Home</NavItem>
              <NavItem onClick={this.generateOnSelect('/products')} className="menu-item">Products</NavItem>
              <NavItem onClick={this.generateOnSelect('/contacts')} className="menu-item">Contact Us</NavItem>
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
    loadAppAsync: appContainerActions.loadAppAsync,
    redirect: routerActions.push
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
