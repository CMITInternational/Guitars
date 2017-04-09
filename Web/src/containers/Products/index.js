import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, Button, Navbar } from 'react-bootstrap';
import { routerActions } from 'react-router-redux';
import productsActions from './Actions';
import productActions from '../Product/Actions';
import AppPropTypes from '../App/PropTypes';
import type IApp from '../App/IApp';
import GuitarListPropTypes from '../../models/GuitarListPropTypes';
import type IGuitarList from '../../models/IGuitarList';
import appActions from '../App/Actions';
import ReactAudioPlayer from 'react-audio-player';

type IProps = {
  app: IApp,
  guitars: IGuitarList,
  loadAsync: Function,
  removeProductAsync: Function,
  saveAsync: Function,
  editProductOn: Function,
  goToProduct: Function,
  showHeader: Function
}

class Products extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    guitars: React.PropTypes.shape(GuitarListPropTypes),
    goToProduct: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired,
    removeProductAsync: React.PropTypes.func.isRequired,
    editProductOn: React.PropTypes.func.isRequired,
    saveAsync: React.PropTypes.func.isRequired,
    showHeader: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.renderGuitar = this.renderGuitar.bind(this);
    this.generateRouteToProduct = this.generateRouteToProduct.bind(this);
    this.renderAdminButtons = this.renderAdminButtons.bind(this);
    this.onNewProduct = this.onNewProduct.bind(this);
  }

  generateRouteToProduct = (guitar) => {
    return () => {
      this.props.goToProduct(guitar.Id);
    };
  };

  componentWillMount () {
    this.props.showHeader({
      willShowHeader: true,
      hasAdminHeader: true
    });
  }

  componentDidMount () {
    this.props.loadAsync();
  }

  removeProduct (id) {
    this.props.removeProductAsync(id);
  }

  generateRemoveProduct (id) {
    return () => {
      this.removeProduct(id);
    };
  }

  renderGuitar (guitar) {
    let thumbUrl = `${this.props.app.assetUrl}${guitar.Path}/${guitar.Thumb}`;
    let audioFiles = guitar.Images.filter(image => image.includes('mp3'));
    let audioUrl = (audioFiles.length > 0) ? `${this.props.app.assetUrl}${guitar.Path}/${audioFiles[0]}` : '';

    return (
      <Col xs={12} sm={6} md={6} lg={3} key={guitar.Id}>
        {
          (this.props.app.isAdmin)
            ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveProduct(guitar.Id)}>&times;</Button>)
            : null
        }
        <Thumbnail src={thumbUrl}>
          <h3>{guitar.Title}</h3>
          <p>{guitar.Description}</p>
          {
            (audioUrl.length > 0)
              ? <p><ReactAudioPlayer src={audioUrl} /></p>
              : null
          }
          <p>
            <Button onClick={this.generateRouteToProduct(guitar)} bsStyle="primary">More Details</Button>&nbsp;
          </p>
        </Thumbnail>
      </Col>
    );
  };

  onNewProduct () {
    this.props.saveAsync({
      Title: 'New',
      SubTitle: 'New Guitar',
      Description: 'A New Guitar'
    }).then((Id) => {
      this.props.editProductOn();
      this.props.goToProduct(Id);
    });
  }

  renderAdminButtons () {
    return (this.props.app.isAdmin)
      ? (
        <Navbar fixedTop style={{top: '50px'}}>
          <Navbar.Header>
            <Navbar.Form pullLeft>
              <Button bsStyle="primary" onClick={this.onNewProduct}>New</Button>
            </Navbar.Form>
          </Navbar.Header>
        </Navbar>
      )
      : null;
  }

  render () {
    return (
      <div>
        {this.renderAdminButtons()}
        <PageHeader>
          <div className="section-header">
            <h1 className="section-title">Products</h1>
          </div>
        </PageHeader>
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
    saveAsync: productActions.saveProductAsync,
    editProductOn: productActions.editProductOn,
    loadAsync: productsActions.loadProductsAsync,
    removeProductAsync: productsActions.removeProductAsync,
    showHeader: appActions.showHeaderAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
