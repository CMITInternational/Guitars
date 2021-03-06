import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, ButtonGroup, Button, Navbar, Panel } from 'react-bootstrap';
import appActions from '../App/Actions';
import productActions from './Actions';
import type IGuitar from '../../models/IGuitar';
import GuitarPropTypes from '../../models/GuitarPropTypes';
import type IApp from '../App/IApp';
import AppPropTypes from '../App/PropTypes';
import { Form, ValidatedInput, FileValidator } from '../../components/ValidatedInput';
import _ from 'lodash';
import DropZone from 'react-dropzone';
import ReactAudioPlayer from 'react-audio-player';

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
      Images: [],
      Thumb: '',
      droppedImages: [],
      droppedThumbImages: []
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
    this.onDrop = this.onDrop.bind(this);
    this.onThumbDrop = this.onThumbDrop.bind(this);
    this.clearDroppedImages = this.clearDroppedImages.bind(this);
    this.clearDroppedThumbImages = this.clearDroppedThumbImages.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.generateRemoveImage = this.generateRemoveImage.bind(this);
    this.removeDroppedImage = this.removeDroppedImage.bind(this);
    this.generateRemoveDroppedImage = this.generateRemoveDroppedImage.bind(this);
    this.removeDroppedThumbImage = this.removeDroppedThumbImage.bind(this);
    this.generateRemoveDroppedThumbImage = this.generateRemoveDroppedThumbImage.bind(this);
  }

  onDrop (acceptedFiles, rejectedFiles) {
    let droppedImages = [...acceptedFiles, ...this.state.droppedImages];
    this.setState({
      droppedImages
    });
  }

  clearDroppedImages () {
    this.setState({
      droppedImages: []
    });
  }

  onThumbDrop (acceptedFiles, rejectedFiles) {
    let droppedThumbImages = [acceptedFiles[0]];
    this.setState({
      droppedThumbImages
    });
  }

  clearDroppedThumbImages () {
    this.setState({
      droppedThumbImages: []
    });
  }

  componentWillMount () {
    this.props.showHeader({
      willShowHeader: true,
      hasAdminHeader: true
    });
  }

  componentDidMount () {
    this.props.loadAsync(this.props.id);
  }

  componentWillReceiveProps (nextProps: IProps) {
    this.setState({
      Images: nextProps.data.Images,
      Thumb: nextProps.data.Thumb
    });
  }

  onSave (values) {
    let files = [...this.state.droppedThumbImages, ...this.state.droppedImages];
    let isThumbnail = this.state.droppedThumbImages.length > 0;
    let guitar = Object.assign({}, this.props.data, {
      Images: this.state.Images,
      Thumb: this.state.Thumb
    }, values);
    this.props.saveAsync(guitar)
      .then(() => {
        if (files !== undefined && files.length > 0) {
          this.props.saveProductImagesAsync(files, isThumbnail)
            .then(() => {
              this.props.editOff();
              this.clearDroppedThumbImages();
              this.clearDroppedImages();
            });
        } else {
          this.props.editOff();
        }
      });
  }

  cancelEdit () {
    this.clearDroppedImages();
    this.clearDroppedThumbImages();
    this.props.editOff();
    this.props.loadAsync(this.props.id);
  }

  removeImage (id) {
    let images = _.filter(this.state.Images, image => image !== id);
    let thumb = (this.state.Thumb === id) ? '' : this.state.Thumb;
    this.setState({
      Images: images,
      Thumb: thumb
    });
  }

  generateRemoveImage (id) {
    return () => {
      this.removeImage(id);
    };
  }

  removeDroppedThumbImage (id) {
    let droppedThumbImages = _.filter(this.state.droppedThumbImages, droppedThumbImage => droppedThumbImage !== id);
    this.setState({
      droppedThumbImages
    });
  }

  generateRemoveDroppedThumbImage (id) {
    return () => {
      this.removeDroppedThumbImage(id);
    };
  }

  removeDroppedImage (id) {
    let droppedImages = _.filter(this.state.droppedImages, droppedImage => droppedImage !== id);
    this.setState({
      droppedImages
    });
  }

  generateRemoveDroppedImage (id) {
    return () => {
      this.removeDroppedImage(id);
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

  renderMedia (src: string, type: string) {
    return (type !== undefined && type.includes('mp3') || src.includes('mp3'))
          ? <ReactAudioPlayer src={src} />
          : <Thumbnail src={src} />;
  }

  // h
  renderThumb () {
    let renderImages = () => {
      return (this.state.droppedThumbImages.length > 0)
        ? (
          <Col xs={12} sm={6} md={6} lg={3}>
            {
              (this.props.isEdit)
                ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveDroppedThumbImage(this.state.droppedThumbImages[0])}>&times;</Button>)
                : null
            }
            {this.renderMedia(this.state.droppedThumbImages[0].preview, this.state.droppedThumbImages[0].type)}
          </Col>
        )
        : (this.state.Thumb)
          ? (
            <Col xs={12} sm={12} md={12} lg={6} lgPush={3} lgPull={3}>
              {
                (this.props.isEdit)
                  ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveImage(this.state.Thumb)}>&times;</Button>)
                  : null
              }
              {this.renderMedia(`${this.props.app.assetUrl}${this.props.data.Path}/${this.state.Thumb}`)}
            </Col>
          )
          : null;
    };

    let renderDropZone = () => {
      return (this.props.isEdit)
          ? (
            <Row>
              {(this.state.droppedThumbImages.length === 0)
                ? (
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <DropZone onDrop={this.onThumbDrop}>
                      <div>Drop new feature media here</div>
                    </DropZone>
                  </Col>
                )
                : null
              }
            </Row>
          )
          : null;
    };

    return (
      <Panel header="Feature Media">
        <Grid fluid>
          {renderDropZone()}
          <Row>
            {renderImages()}
          </Row>
        </Grid>
      </Panel>
    );
  }

  renderImages () {
    return (
      <Panel header="Other Media">
        <Grid fluid>
          {
            (this.props.isEdit)
              ? (
                <Row>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <DropZone onDrop={this.onDrop}>
                      <div>Drop new media here</div>
                    </DropZone>
                  </Col>
                </Row>
              )
              : null
          }
          <Row>
            {this.state.droppedImages.map(image => (
              <Col xs={12} sm={6} md={6} lg={3}>
                {
                  (this.props.isEdit)
                    ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveDroppedImage(image)}>&times;</Button>)
                    : null
                }
                {this.renderMedia(image.preview, image.type)}
              </Col>
            ))}
          </Row>
          <Row>
            {(this.state.Images !== undefined && this.state.Images !== null)
              ? this.state.Images.map(image => (
                <Col xs={12} sm={6} md={6} lg={3}>
                  {
                    (this.props.isEdit)
                      ? (<Button bsStyle="danger" className="close" onClick={this.generateRemoveImage(image)}>&times;</Button>)
                      : null
                  }
                  {this.renderMedia(`${this.props.app.assetUrl}${this.props.data.Path}/${image}`)}
                </Col>
              ))
              : null
            }
          </Row>
        </Grid>
      </Panel>
    );
  }

  renderAdminButtons () {
    return (this.props.app.isAdmin)
      ? (
        <Navbar fixedTop style={{top: '50px'}}>
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
        {this.renderThumb()}
        {this.renderImages()}
      </div>
    );
  }

  // h
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
    showHeader: appActions.showHeaderAsync,
    loadAsync: productActions.loadProductAsync,
    saveProductImagesAsync: productActions.saveProductImagesAsync,
    saveAsync: productActions.saveProductAsync,
    editOn: productActions.editProductOn,
    editOff: productActions.editProductOff
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
