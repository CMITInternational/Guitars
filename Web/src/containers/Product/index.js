import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, ButtonGroup, Button, Navbar } from 'react-bootstrap';
import appActions from '../App/Actions';
import productActions from './Actions';
import type IGuitar from '../../models/IGuitar';
import GuitarPropTypes from '../../models/GuitarPropTypes';
import type IApp from '../App/IApp';
import AppPropTypes from '../App/PropTypes';
import { Form, ValidatedInput, FileValidator } from '../../components/ValidatedInput';
import _ from 'lodash';

type IProps = {
  id: string,
  data: IGuitar,
  app: IApp,
  ready: boolean,
  isEdit: boolean,
  showHeader: Function,
  loadAsync: Function,
  saveProductImagesAsync: Function,
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
    saveProductImagesAsync: React.PropTypes.func.isRequired,
    saveAsync: React.PropTypes.func.isRequired,
    editOn: React.PropTypes.func.isRequired,
    editOff: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      Images: []
    };

    this.renderProduct = this.renderProduct.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderAdminButtons = this.renderAdminButtons.bind(this);
    this.onSave = this.onSave.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateSubTitle = this.updateSubTitle.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.validateFiles = this.validateFiles.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
    this.props.loadAsync(this.props.id);
  }

  componentWillReceiveProps (nextProps: IProps) {
    this.setState({
      Images: nextProps.data.Images
    });
  }

  onSave (values) {
    let {files, isThumbnail, ...otherFormData} = values;
    let guitar = Object.assign({}, this.props.data, this.state, otherFormData);
    this.props.saveAsync(guitar)
      .then(() => {
        if (files !== undefined && files.length > 0) {
          this.props.saveProductImagesAsync(files, isThumbnail)
            .then(() => {
              this.props.editOff();
            });
        } else {
          this.props.editOff();
        }
      });
  }

  cancelEdit () {
    this.props.editOff();
    this.props.loadAsync(this.props.id);
  }

  removeImage (id) {
    let images = _.filter(this.state.Images, image => image !== id);
    this.setState({
      Images: images
    });
  }

  generateRemoveImage (id) {
    return () => {
      this.removeImage(id);
    };
  }

  validateFiles (files) {
    if (!FileValidator.isEachFileSize(files, 0, 1048576)) {
      return 'Each file must not be larger than 1MB';
    }

    if (!FileValidator.isExtension(files, ['png', 'jpg'])) {
      return 'Only png or jpg files are allowed';
    }

    return true;
  }

  renderImages () {
    if (this.state.Images !== undefined && this.state.Images !== null && this.state.Images.length > 0) {
      return (
        <Row>
          {this.state.Images.map(image => {
            return (
              <Col key={image} lg={6} md={6} sm={6} xs={6}>
                {
                  (this.props.isEdit)
                    ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveImage(image)}>&times;</Button>)
                    : null
                }
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
      ? (
        <Navbar fixTop style={{paddingTop: '50px'}}>
          <Navbar.Header>
            <Navbar.Form pullLeft>
              {
                (this.props.isEdit)
                  ? (
                    <ButtonGroup>
                      <Button type="submit" bsStyle="primary">Save</Button>
                      <Button onClick={this.cancelEdit} bsStyle="danger">Cancel</Button>
                    </ButtonGroup>
                  )
                  : (
                    <Button onClick={this.props.editOn} bsStyle="primary">Edit</Button>
                  )
              }
            </Navbar.Form>
          </Navbar.Header>
        </Navbar>
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
        {this.renderAdminButtons()}
        <PageHeader>
          <div className="section-header">
            <h1 className="section-title">
              {
                (this.props.isEdit)
                  ? (
                    <ValidatedInput
                      name="Title"
                      type="text"
                      defaultValue={this.props.data.Title}
                    />
                  )
                  : this.props.data.Title
              }
            </h1>
            <p className="section-description lead">
              {
                (this.props.isEdit)
                  ? (
                    <ValidatedInput
                      name="SubTitle"
                      componentClass="textarea"
                      defaultValue={this.props.data.SubTitle}
                    />
                  )
                  : this.props.data.SubTitle
              }
            </p>
            <p className="section-description">
              {
                (this.props.isEdit)
                  ? (
                    <ValidatedInput
                      name="Description"
                      style={{height: '100px'}}
                      componentClass="textarea"
                      defaultValue={this.props.data.Description}
                    />
                  )
                  : this.props.data.Description
              }
            </p>
          </div>
        </PageHeader>
        <Grid fluid>
          {
            (this.props.isEdit)
              ? (
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <ValidatedInput
                      ref="files"
                      name="files"
                      type="file"
                      label="New Images"
                      multiple
                      validate={this.validateFiles}
                    />
                    <ValidatedInput
                      name="isThumbnail"
                      type="checkbox"
                      label="Thumbnail"
                    />
                  </Col>
                </Row>
              )
            : null
          }
          {this.renderImages()}
        </Grid>
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
    saveProductImagesAsync: productActions.saveProductImagesAsync,
    saveAsync: productActions.saveProductAsync,
    editOn: productActions.editProductOn,
    editOff: productActions.editProductOff
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
