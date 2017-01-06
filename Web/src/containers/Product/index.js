import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader } from 'react-bootstrap';
import appActions from '../App/Actions';

type IProps = {
  id: string,
  showHeader: Function
}

class Product extends React.Component <void, IProps, void> {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    showHeader: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.showHeader(true);
  }

  render () {
    return (
      <div>
        <PageHeader>{this.props.id}</PageHeader>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.params.id
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
