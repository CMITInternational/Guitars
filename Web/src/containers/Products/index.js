import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, Button } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';
import productsActions from './Actions';
import AppPropTypes from '../App/PropTypes';
import type IApp from '../App/IApp';
import GuitarListPropTypes from '../../models/GuitarListPropTypes';
import type IGuitarList from '../../models/IGuitarList';

type IProps = {
  app: IApp,
  guitars: IGuitarList,
  loadAsync: Function,
  goToProduct: Function
}

class Products extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    guitars: React.PropTypes.shape(GuitarListPropTypes),
    goToProduct: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.renderGuitar = this.renderGuitar.bind(this);
    this.generateRouteToProduct = this.generateRouteToProduct.bind(this);
  }

  generateRouteToProduct = (guitar) => {
    return () => {
      this.props.goToProduct(guitar.Id);
    };
  };

  componentDidMount () {
    this.props.loadAsync();
  }

  renderGuitar (guitar) {
    let thumbUrl = `${this.props.app.assetUrl}${guitar.Path}/${guitar.Thumb}`;

    return (
      <Col xs={12} sm={6} md={4} lg={3} key={guitar.Id}>
        <Thumbnail src={thumbUrl}>
          <h3>{guitar.Title}</h3>
          <p>{guitar.Description}</p>
          <p>
            <Button onClick={this.generateRouteToProduct(guitar)} bsStyle="primary">More Details</Button>&nbsp;
          </p>
        </Thumbnail>
      </Col>
    );
  };

  render () {
    return (
      <div>
        <PageHeader>Products</PageHeader>
        <Grid fluid>
          <Row>
            {this.props.guitars.data.map(this.renderGuitar)}
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  guitars: state.products
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    goToProduct: (id) => routerActions.push(`/product/${id}`),
    loadAsync: productsActions.loadProductsAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
