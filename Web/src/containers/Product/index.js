import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail } from 'react-bootstrap';
import appActions from '../App/Actions';
import productActions from './Actions';
import type IGuitar from '../../models/IGuitar';
import GuitarPropTypes from '../../models/GuitarPropTypes';
import type IApp from '../App/IApp';
import AppPropTypes from '../App/PropTypes';

type IProps = {
  id: string,
  data: IGuitar,
  app: IApp,
  ready: boolean,
  showHeader: Function,
  loadAsync: Function
}

class Product extends React.Component <void, IProps, void> {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape(GuitarPropTypes).isRequired,
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    ready: React.PropTypes.bool.isRequired,
    showHeader: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
    this.props.loadAsync(this.props.id);
  }

  render () {
    return (this.props.ready === false)
      ? (
        <div>
          <PageHeader>Loading {this.props.id}</PageHeader>
        </div>
      )
      : (
        <div>
          <PageHeader>{this.props.data.Title}</PageHeader>
          <Grid fluid>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>{this.props.data.SubTitle}</Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>{this.props.data.Description}</Col>
            </Row>
            {(this.props.data.Images !== undefined && this.props.data.Images.length > 0)
              ? (
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Thumbnail src={`${this.props.app.assetUrl}${this.props.data.Path}/${this.props.data.Images[0]}`} />
                  </Col>
                  {(this.props.data.Images.length > 1)
                    ? (
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Thumbnail src={`${this.props.app.assetUrl}${this.props.data.Path}/${this.props.data.Images[1]}`} />
                      </Col>
                    )
                    : null
                  }
                </Row>
              )
              : null
            }
          </Grid>
        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.params.id,
  app: state.app,
  data: state.product.data,
  ready: state.product.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    loadAsync: productActions.loadProductAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
