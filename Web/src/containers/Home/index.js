import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SpinImage from '../../img/loading.svg';

type IProps = {
  ready: boolean,
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    ready: React.PropTypes.bool.isRequired
  };

  render () {
    return (
      <span><img src={SpinImage} /></span>
    );
  }
}

const mapStateToProps = (state) => ({
  ready: state.app.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
