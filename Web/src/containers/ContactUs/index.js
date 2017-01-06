import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader } from 'react-bootstrap';
import appActions from '../App/Actions';

type IProps = {
  ready: boolean,
  showHeader: Function
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    ready: React.PropTypes.bool.isRequired,
    showHeader: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.showHeader(true);
  }

  render () {
    return (
      <div>
        <PageHeader>Contact Us</PageHeader>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ready: state.app.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
