import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, ButtonGroup, Button, Form, FormControl } from 'react-bootstrap';
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
  isEdit: boolean,
  showHeader: Function,
  loadAsync: Function,
  saveAsync: Function,
  editOn: Function,
  editOff: Function
}

class Product extends React.Component <void, IProps, void> {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape(GuitarPropTypes).isRequired,
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    ready: React.PropTypes.bool.isRequired,
    isEdit: React.PropTypes.bool.isRequired,
    showHeader: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired,
    saveAsync: React.PropTypes.func.isRequired,
    editOn: React.PropTypes.func.isRequired,
    editOff: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      Id: '',
      Title: '',
      SubTitle: '',
      Description: ''
    };

    this.renderProduct = this.renderProduct.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderAdminButtons = this.renderAdminButtons.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
    this.props.loadAsync(this.props.id);
  }

  componentWillReceiveProps (nextProps: IProps) {
    this.setState({
      Id: nextProps.data.Id,
      Title: nextProps.data.Title,
      SubTitle: nextProps.data.SubTitle,
      Description: nextProps.data.Description
    });
  }

  onSave () {
    let guitar = this.props.data;
    this.props.saveAsync(guitar);
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

  renderAdminButtons () {
    return (this.props.app.isAdmin)
      ? (this.props.isEdit)
        ? (
          <ButtonGroup>
            <Button onClick={this.onSave} bsStyle="primary">Save</Button>
            <Button onClick={this.props.editOff} bsStyle="danger">Cancel</Button>
          </ButtonGroup>
        )
        : (
          <Button onClick={this.props.editOn} bsStyle="primary">Edit</Button>
        )
      : null;
  }

  updateTitle (evt) {
    this.setState({
      Title: evt.target.value
    });
  }

  updateSubTitle (evt) {
    this.setState({
      SubTitle: evt.target.value
    });
  }

  updateDescription (evt) {
    this.setState({
      Description: evt.target.value
    });
  }

  renderProduct () {
    return (
      <div>
        <PageHeader>
          {this.renderAdminButtons()}
          <div className="section-header">
            <h1 className="section-title">
              {
                (this.props.isEdit)
                  ? (
                    <FormControl
                      type="text"
                      onChange={this.updateTitle}
                      value={this.props.data.Title}
                    />
                  )
                  : this.props.data.Title
              }
            </h1>
            <p className="section-description lead">
              {
                (this.props.isEdit)
                  ? (
                    <FormControl
                      componentClass="textarea"
                      onChange={this.updateSubTitle}
                      value={this.props.data.SubTitle}
                    />
                  )
                  : this.props.data.SubTitle
              }
            </p>
            <p className="section-description">
              {
                (this.props.isEdit)
                  ? (
                    <FormControl
                      style={{height: '100px'}}
                      componentClass="textarea"
                      onChange={this.updateDescription}
                      value={this.props.data.Description}
                    />
                  )
                  : this.props.data.Description
              }
            </p>
          </div>
        </PageHeader>
        <Grid fluid>
          {this.renderImages()}
        </Grid>
        {this.renderAdminButtons()}
      </div>
    );
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
      : (this.props.isEdit)
      ? (
        <Form onValidSubmit={this.onSave}>
          {this.renderProduct()}
        </Form>
      )
      : this.renderProduct();
  }
}

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.params.id,
  app: state.app,
  data: state.product.data,
  ready: state.product.isReady,
  isEdit: state.product.isEditing
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    loadAsync: productActions.loadProductAsync,
    saveAsync: productActions.saveProductAsync,
    editOn: productActions.editProductOn,
    editOff: productActions.editProductOff
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
