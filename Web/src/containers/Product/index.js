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

  constructor (props: IProps) {
    super(props);

    this.renderImages = this.renderImages.bind(this);
  }

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
    this.props.loadAsync(this.props.id);
  }

  renderImages () {
    if (this.props.data.Images !== undefined && this.props.data.Images.length > 0) {
      return (
        <Row>
          {this.props.data.Images.map(image => {
            return (
              <Col key={image} lg={6} md={6} sm={6} xs={6}>
                <Thumbnail src={`${this.props.app.assetUrl}${this.props.data.Path}/${image}`} />
              </Col>
            );
          })}
        </Row>
      );
    } else {
      return null;
    }
  }

  render () {
    return (this.props.ready === false)
      ? (
        <div>
          <PageHeader>
            <div className="section-header">
              <h1 className="section-title">Loading {this.props.id}</h1>
            </div>
          </PageHeader>
        </div>
      )
      : (
        <div>
          <PageHeader>
            <div className="section-header">
              <h1 className="section-title">{this.props.data.Title}</h1>
            </div>
          </PageHeader>
          <Grid fluid>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>{this.props.data.SubTitle}</Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>{this.props.data.Description}</Col>
            </Row>
            {this.renderImages()}
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
