import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
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

    this.renderAddress = this.renderAddress.bind(this);
    this.renderBusinessHours = this.renderBusinessHours.bind(this);
  }

  componentWillMount () {
    this.props.showHeader(true);
  }

  componentDidMount () {
    this.props.loadAsync();
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
            <Col lg={12} md={12} sm={12} xs={12}>
              <h2>{this.props.data.Header1}</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <h3>{this.props.data.Header2}</h3>
            </Col>
          </Row>
          {this.renderAddress()}
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {this.props.data.Phone}
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {this.props.data.Email}
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
