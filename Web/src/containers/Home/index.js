import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { button, Jumbotron } from 'react-bootstrap';
import appActions from '../App/Actions';
import type IApp from '../App/IApp';
import appPropTypes from '../App/PropTypes';

type IProps = {
  app: IApp,
  showHeader: Function,
  redirectToProducts: Function
}

class Home extends React.Component<void, IProps, void> {
  static propTypes = {
    app: React.PropTypes.shape(appPropTypes).isRequired,
    showHeader: React.PropTypes.func.isRequired,
    redirectToProducts: React.PropTypes.func.isRequired
  };

  constructor (props: IProps) {
    super(props);

    this.state = {
      processId: undefined,
      backImage: {
        index: 0,
        collection: [
          'assets/DSC_0141.jpg',
          'assets/DSC_0143.jpg',
          'assets/DSC_0146.jpg',
          'assets/DSC_0147.jpg',
          'assets/DSC_0148.jpg',
          'assets/DSC_0149.jpg',
          'assets/DSC_0150.jpg'
        ]
      },
      frontText: {
        index: 0,
        collection: [
          'Phillip J Buttrose Pty Ltd',
          'Phillip Buttrose - Luthier',
          '0411 228 482',
          'phillip.buttrose@iinet.net.au'
        ]
      }
    };

    this.setBackImage = this.setBackImage.bind(this);
    this.setFrontText = this.setFrontText.bind(this);
    this.swapContent = this.swapContent.bind(this);
  }

  swapContent () {
    this.setBackImage();
    this.setFrontText();
  }

  setFrontText () {
    let newFrontTextIndex = 0;
    if (this.state.frontText.index !== undefined && this.state.frontText.index !== this.state.frontText.collection.length - 1) {
      newFrontTextIndex = this.state.frontText.index + 1;
    }
    this.setState({
      frontText: Object.assign({}, this.state.frontText, {
        index: newFrontTextIndex
      })
    });
  }

  setBackImage () {
    let newBackImageIndex = 0;
    if (this.state.backImage.index !== undefined && this.state.backImage.index !== this.state.backImage.collection.length - 1) {
      newBackImageIndex = this.state.backImage.index + 1;
    }
    this.setState({
      backImage: Object.assign({}, this.state.backImage, {
        index: newBackImageIndex
      })
    });
  }

  componentWillMount () {
    this.props.showHeader({
      willShowHeader: false,
      hasAdminHeader: false
    });
    this.swapContent();
    if (this.state.processId === undefined) {
      this.setState({
        processId: setInterval(this.swapContent, 6000)
      });
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    if (this.state.processId !== undefined) {
      clearInterval(this.state.processId);
      this.setState({
        processId: undefined
      });
    }
  }

  render () {
    // let divStyle = {
    //   height: '100%',
    //   alignContent: 'center',
    //   alignItems: 'center',
    //   boxSizing: 'border-box',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   flexWrap: 'wrap',
    //   justifyContent: 'center',
    //   backgroundImage: `url(${this.props.app.assetUrl}assets/jumbotron-back.stretched2.png)`,
    //   backgroundSize: '100% 100%',
    //   backgroundRepeat: 'no-repeat',
    //   opacity: 1
    // };

    let swapBackStyle = {
      backgroundImage: `url(${this.props.app.assetUrl}${this.state.backImage.collection[this.state.backImage.index]})`
      // ,
      // height: '100%',
      // backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      // opacity: 1,
      // zIndex: -1
    };

    return (
      <div className="home-backdrop" style={swapBackStyle}>
        <div className="home-frontdrop">
          <Jumbotron>
            <div className="container">
              <div className="message-box">
                <div className="first-line">
                  <p>Australian Handcrafted Guitars</p>
                </div>
                <div className="first-line">
                  <p>{this.state.frontText.collection[this.state.frontText.index]}</p>
                </div>
                <div className="first-line">
                  <button style={{background: 'none', border: 'none'}} onClick={this.props.redirectToProducts}>Click Here To Enter</button>
                </div>
              </div>
            </div>
          </Jumbotron>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  app: state.app,
  containerWidth: ownProps.containerWidth,
  containerHeight: ownProps.containerHeight
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeaderAsync,
    redirectToProducts: appActions.redirectToProducts
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
