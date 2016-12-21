import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Grid, Col, Row, Thumbnail, Button } from 'react-bootstrap';

type IProps = {
  ready: boolean,
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    ready: React.PropTypes.bool.isRequired
  };

  render () {
    return (
      <div>
        <PageHeader>Products</PageHeader>
        <Grid>
          <Row>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/0FF09A43-A978-48A2-BC01-08DA1E90AAC0/thumb.png">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/1DEB168A-BFA7-4F1C-A4C1-CB5D152F9216/thumb.png">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/02CA4768-5CEE-487A-8CA3-F711D5FF494A/thumb.jpg">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/9433FDF4-410F-45AD-8ADC-2DF57271005D/thumb.png">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/BBC926AA-B421-40E3-8DF9-C344C0CF64F1/thumb.png">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Thumbnail src="/assets/projects/C8AC019E-2C0A-4978-8CC4-F9690807BF93/thumb.png">
                <h3>Thumbnail label</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>&nbsp;
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ready: state.app.isReady
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
