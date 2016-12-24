import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, Button } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';
import productsActions from './Actions';

type IProps = {
  guitars: {
    data: List<{
      id: string,
      label: string,
      smallDesc: string,
      thumbUrl: string
    }>,
    ready: boolean
  },
  loadAsync: Function,
  goToProduct: Function
}

class Products extends React.Component<void, IProps, void> {
  static propTypes = {
    guitars: React.PropTypes.shape({
      data: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        smallDesc: React.PropTypes.string.isRequired,
        thumbUrl: React.PropTypes.string.isRequired
      })).isRequired,
      ready: React.PropTypes.bool.isRequired
    }),
    goToProduct: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired
  };

  generateRouteToProduct = (guitar) => {
    return () => {
      this.props.goToProduct(guitar.id);
    };
  };

  componentWillMount () {
    this.props.loadAsync();
  }

  render () {
    let guitarThumbnail = (guitar) => {
      return (
        <Col xs={12} sm={6} md={4} lg={3} key={guitar.id}>
          <Thumbnail src={guitar.thumbUrl}>
            <h3>{guitar.label}</h3>
            <p>{guitar.smallDesc}</p>
            <p>
              <Button onClick={this.generateRouteToProduct(guitar)} bsStyle="primary">More Details</Button>&nbsp;
            </p>
          </Thumbnail>
        </Col>
      );
    };

    return (
      <div>
        <PageHeader>Products</PageHeader>
        <Grid fluid>
          <Row>
            {this.props.guitars.data.map(guitarThumbnail)}
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  guitars: state.products
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    goToProduct: (id) => routerActions.push(`/product/${id}`),
    loadAsync: productsActions.loadProductsAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
