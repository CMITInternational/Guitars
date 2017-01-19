import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Row, Col, FormControl, FormGroup, Form, InputGroup, Button } from 'react-bootstrap';
import appActions from '../App/Actions';
import contactUsActions from './Actions';
import type IContactUs from './IContactUs';
import ContactUsPropTypes from './PropTypes';

type IProps = {
  ready: boolean,
  data: IContactUs,
  showHeader: Function,
  loadAsync: Function
}

class ContactUs extends React.Component<void, IProps, void> {
  static propTypes = {
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
                    <InputGroup.Addon>Name</InputGroup.Addon>
                    <FormControl type="text" onChange={this.updateName} value={this.state.name} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon>@</InputGroup.Addon>
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
                <Button bsStyle="primary">Submit</Button>
              </Form>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
              <Row>
              <h2>{this.props.data.Header1}</h2>
              <h3>{this.props.data.Header2}</h3>
              {this.props.data.Phone}
              {this.props.data.Email}
              </Row>
            </Col>
          </Row>
          {this.renderBusinessHours()}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
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
