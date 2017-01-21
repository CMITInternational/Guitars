import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Row, Col, FormControl, FormGroup, Form, InputGroup, Button, Image } from 'react-bootstrap';
import appActions from '../App/Actions';
import type IApp from '../App/IApp';
import AppPropTypes from '../App/PropTypes';
import contactUsActions from './Actions';
import type IContactUs from './IContactUs';
import ContactUsPropTypes from './PropTypes';
import FontAwesome from 'react-fontawesome';
import 'font-awesome-webpack';

type IProps = {
  app: IApp,
  ready: boolean,
  data: IContactUs,
  showHeader: Function,
  loadAsync: Function
}

class ContactUs extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(AppPropTypes).isRequired,
    ready: React.PropTypes.bool.isRequired,
    data: React.PropTypes.shape(ContactUsPropTypes).isRequired,
    showHeader: React.PropTypes.func.isRequired,
    loadAsync: React.PropTypes.func.isRequired
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
  }

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
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

  renderAddress () {
    return this.props.data.Address.map(line => (
      <Row key={line}>
        <Col lg={12} md={12} sm={12} xs={12}>
          {line}
        </Col>
      </Row>
    ));
  }

  renderBusinessHours () {
    return this.props.data.BusinessHours.map(hour => (
      <Row key={hour.Day}>
        <Col lg={12} md={12} sm={12} xs={12}>
          {hour.Day}: {hour.Hours}
        </Col>
      </Row>
    ));
  }

  render () {
    return (
      <div>
        <PageHeader>
          <div className="section-header">
            <h1 className="section-title">Contact Us</h1>
          </div>
        </PageHeader>
        <Grid fluid>
          <Row>
            <Col lg={6} md={6} sm={6} xs={6}>
              <Form>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon><FontAwesome name="user" /></InputGroup.Addon>
                    <FormControl type="text" onChange={this.updateName} value={this.state.name} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon><FontAwesome name="envelope" /></InputGroup.Addon>
                    <FormControl type="text" onChange={this.updateEmail} value={this.state.email} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <FormControl
                    style={{height: '100px'}}
                    componentClass="textarea"
                    onChange={this.updateMessage}
                    value={this.state.Message}
                  />
                </FormGroup>
                <Button bsStyle="primary"><FontAwesome name="location-arrow" />Send Message</Button>
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
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  data: state.contactus.data,
  ready: state.contactus.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    loadAsync: contactUsActions.loadContactAsync
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
