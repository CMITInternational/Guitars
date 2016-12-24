import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader } from 'react-bootstrap';

type IProps = {
  id: string
}

class Product extends React.Component <void, IProps, void> {
  static propTypes = {
    id: React.PropTypes.string.isRequired
  };

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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
