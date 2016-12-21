import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader } from 'react-bootstrap';

type IProps = {
  ready: boolean,
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    ready: React.PropTypes.bool.isRequired
  };

  render () {
    return (
      <div>
        <PageHeader>Home</PageHeader>
      </div>
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
