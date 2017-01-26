import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Row, Col, Button, Image } from 'react-bootstrap';
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
  data: IContactUs,
  showHeader: Function,
  loadAsync: Function,
  sendAsync: Function,
  setSending: Function
}

class ContactUs extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    sending: React.PropTypes.string.isRequired,
    ready: React.PropTypes.bool.isRequired,
    data: React.PropTypes.shape(ContactUsPropTypes).isRequired,
    showHeader: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired,
    sendAsync: React.PropTypes.func.isRequired,
    setSending: React.PropTypes.func.isRequired
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
  }

  componentWillMount () {
    this.props.showHeader(true);
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

  render () {
    return this.props.ready
      ? (
        <div>
          <PageHeader>
            <div className="section-header">
              <h1 className="section-title">Contact Us</h1>
            </div>
          </PageHeader>
          <Grid fluid>
            <Row>
              <Col lg={6} md={6} sm={6} xs={6}>
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
              <Col lg={5} lgOffset={1} md={5} mdOffset={1} sm={6} smOffset={1} xs={6} xsOffset={1}>
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
                <div className="map">
                  <Image responsive src={`${this.props.app.assetUrl}assets/contact/${this.props.data.Map}`} />
                  <a className="spot" style={{top: this.props.data.Spot.Top}} href={`${this.props.data.GoogleMap}`} target="_blank"><span /></a>
                </div>
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
  ready: state.contactus.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    loadAsync: contactUsActions.loadContactAsync,
    sendAsync: contactUsActions.sendMessageAsync,
    setSending: contactUsActions.setSending
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
