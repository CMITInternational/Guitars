import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navbar, ButtonGroup, PageHeader, Grid, Row, Col, Button, Image } from 'react-bootstrap';
import appActions from '../App/Actions';
import type IApp from '../App/IApp';
import AppPropTypes from '../App/PropTypes';
import contactUsActions from './Actions';
import type IContactUs from './IContactUs';
import ContactUsPropTypes from './PropTypes';
import FontAwesome from 'react-fontawesome';
import 'font-awesome-webpack';
import { Form, ValidatedInput } from '../../components/ValidatedInput';

type IProps = {
  app: IApp,
  sending: string,
  ready: boolean,
  isEdit: boolean,
  data: IContactUs,
  showHeader: Function,
  loadAsync: Function,
  sendAsync: Function,
  setSending: Function,
  editOn: Function,
  editOff: Function,
  saveContactAsync: Function
}

class ContactUs extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    sending: React.PropTypes.string.isRequired,
    ready: React.PropTypes.bool.isRequired,
    isEdit: React.PropTypes.bool.isRequired,
    data: React.PropTypes.shape(ContactUsPropTypes).isRequired,
    showHeader: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired,
    sendAsync: React.PropTypes.func.isRequired,
    setSending: React.PropTypes.func.isRequired,
    editOn: React.PropTypes.func.isRequired,
    editOff: React.PropTypes.func.isRequired,
    saveContactAsync: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      Name: '',
      Email: '',
      Message: ''
    };

    this.renderAddress = this.renderAddress.bind(this);
    this.renderBusinessHours = this.renderBusinessHours.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.renderSendingButtonText = this.renderSendingButtonText.bind(this);
    this.renderSendingButtonStyle = this.renderSendingButtonStyle.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.renderAdminButtons = this.renderAdminButtons.bind(this);
    this.onSave = this.onSave.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentWillMount () {
    this.props.showHeader({
      willShowHeader: true,
      hasAdminHeader: false
    });
  }

  componentDidMount () {
    this.props.setSending('ready');
    this.props.loadAsync();
  }

  updateName (evt) {
    this.setState({
      Name: evt.target.value
    });
  }

  updateEmail (evt) {
    this.setState({
      Email: evt.target.value
    });
  }

  updateMessage (evt) {
    this.setState({
      Message: evt.target.value
    });
  }

  sendMessage (values) {
    this.props.sendAsync({
      From: values.email,
      Subject: `Request from ${values.name}`,
      Message: values.message
    });
  }

  renderAddress () {
    return this.props.data.Address !== undefined
      ? this.props.data.Address.map(line => (
        <Row key={line}>
          <Col lg={12} md={12} sm={12} xs={12}>
            {line}
          </Col>
        </Row>
      ))
      : null;
  }

  renderBusinessHours () {
    return this.props.data.BusinessHours !== undefined
      ? this.props.data.BusinessHours.map(hour => (
        <Row key={hour.Day}>
          <Col lg={12} md={12} sm={12} xs={12}>
            {hour.Day}: {hour.Hours}
          </Col>
        </Row>
      ))
      : null;
  }

  renderSendingButtonText () {
    let buttonText = 'Send Message';

    switch (this.props.sending) {
      case 'sending': { buttonText = 'Sending...'; break; }
      case 'done': { buttonText = 'Done'; break; }
      case 'failed': { buttonText = 'Error!'; }
    }

    return buttonText;
  }

  renderSendingButtonStyle () {
    let buttonStyle = 'primary';

    switch (this.props.sending) {
      case 'failed':
        buttonStyle = 'danger';
    }

    return buttonStyle;
  }

  cancelEdit () {
    this.props.editOff();
    this.props.loadAsync();
  }

  onSave (values) {
    let data = Object.assign({}, this.props.data,
      {
        Header1: values.Header1,
        Header2: values.Header2,
        Address: values.Address.split('\n'),
        BusinessHours: values.BusinessHours.split('\n').map(b => {
          let bSplit = b.split(': ');
          return {
            Day: bSplit[0],
            Hours: bSplit[1]
          };
        })
      }
    );

    this.props.saveContactAsync(data)
      .then(() => {
        this.props.editOff();
      });
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

  renderHeader () {
    return (
      <div>
        {this.renderAdminButtons()}
        <PageHeader>
          <div className="section-header">
            <h1 className="section-title">Contact Us</h1>
            <p className="section-description lead">
              {(this.props.isEdit)
                ? (
                  <ValidatedInput
                    name="Header1"
                    type="text"
                    defaultValue={this.props.data.Header1}
                  />
                )
                : this.props.data.Header1}
            </p>
            <p className="section-description">
              {
                (this.props.isEdit)
                  ? (
                    <ValidatedInput
                      name="Header2"
                      componentClass="textarea"
                      defaultValue={this.props.data.Header2}
                    />
                  )
                  : this.props.data.Header2
              }
            </p>
            {(this.props.isEdit)
              ? (
                <div>
                  <ValidatedInput
                    name="Address"
                    label="Address"
                    componentClass="textarea"
                    defaultValue={this.props.data.Address.join('\n')}
                  />
                  <ValidatedInput
                    name="Phone"
                    label="Phone"
                    componentClass="textarea"
                    defaultValue={this.props.data.Phone}
                  />
                  <ValidatedInput
                    name="Email"
                    label="Email"
                    componentClass="textarea"
                    defaultValue={this.props.data.Email}
                  />
                  <ValidatedInput
                    name="BusinessHours"
                    label="BusinessHours"
                    componentClass="textarea"
                    defaultValue={this.props.data.BusinessHours.map(b => `${b.Day}: ${b.Hours}`).join('\n')}
                  />
                </div>
              )
              : null
            }
          </div>
        </PageHeader>
      </div>
    );
  }

  render () {
    return this.props.ready
      ? (
        <div>
          {
            (this.props.isEdit)
              ? (
                <Form onValidSubmit={this.onSave}>
                  {this.renderHeader()}
                </Form>
              )
              : this.renderHeader()
          }
          <Grid fluid>
            <Row>
              <Col lg={6} md={6} sm={12} xs={12}>
                <Form onValidSubmit={this.sendMessage}>
                  <ValidatedInput
                    name="name"
                    validate="required"
                    label="Name"
                    type="text"
                  />
                  <ValidatedInput
                    name="email"
                    validate="required"
                    label="Email"
                    type="text"
                  />
                  <ValidatedInput
                    name="message"
                    validate="required"
                    label="Message"
                    componentClass="textarea"
                  />
                  <Button
                    disabled={this.props.sending !== 'ready'}
                    type="submit"
                    bsStyle={this.renderSendingButtonStyle()}>
                    <FontAwesome name="location-arrow" />{this.renderSendingButtonText()}
                  </Button>
                </Form>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                {this.renderAddress()}
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <FontAwesome name="phone" />&nbsp;{this.props.data.Phone}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <FontAwesome name="envelope" />&nbsp;{this.props.data.Email}
                  </Col>
                </Row>
                {this.renderBusinessHours()}
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="map">
                      <Image style={{width: '90%'}} src={`${this.props.app.assetUrl}assets/contact/${this.props.data.Map}`} />
                      <a className="spot" style={{top: this.props.data.Spot.Top, left: this.props.data.Spot.Left}} href={`${this.props.data.GoogleMap}`} target="_blank"><span /></a>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </div>
      )
      : (
        <div>Loading...</div>
      );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  sending: state.contactus.sending,
  data: state.contactus.data,
  ready: state.contactus.isReady,
  isEdit: state.contactus.isEditing
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeaderAsync,
    loadAsync: contactUsActions.loadContactAsync,
    sendAsync: contactUsActions.sendMessageAsync,
    setSending: contactUsActions.setSending,
    editOn: contactUsActions.editOn,
    editOff: contactUsActions.editOff,
    saveContactAsync: contactUsActions.saveContactAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
