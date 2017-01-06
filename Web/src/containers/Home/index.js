import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { button } from 'react-bootstrap';
import appActions from '../App/Actions';

type IProps = {
  ready: boolean,
  showHeader: Function,
  redirectToProducts: Function
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    ready: React.PropTypes.bool.isRequired,
    showHeader: React.PropTypes.func.isRequired,
    redirectToProducts: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.showHeader(false);
  }

  render () {
    return (
      <div>
        <button onClick={this.props.redirectToProducts}>Enter</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ready: state.app.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    redirectToProducts: appActions.redirectToProducts
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
