import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { button } from 'react-bootstrap';
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
      backImage: {
        index: undefined,
        processId: undefined,
        collection: [
          'assets/DSC_0141.jpg',
          'assets/DSC_0143.jpg',
          'assets/DSC_0146.jpg',
          'assets/DSC_0147.jpg',
          'assets/DSC_0148.jpg',
          'assets/DSC_0149.jpg',
          'assets/DSC_0150.jpg'
        ]
      }
    };

    this.setBackImage = this.setBackImage.bind(this);
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
    this.props.showHeader(false);
  }

  componentDidMount () {
    if (this.state.backImage.processId === undefined) {
      let setBackImageProcId = setInterval(this.setBackImage, 3000);
      this.setState({
        backImage: Object.assign({}, this.state.backImage, {
          processId: setBackImageProcId
        })
      });
    }
  }

  componentWillUnmount () {
    if (this.state.backImage.processId !== undefined) {
      clearInterval(this.state.backImage.processId);
      this.setState({
        backImage: Object.assign({}, this.state.backImage, {
          processId: undefined
        })
      });
    }
  }

  render () {
    let divStyle = {
      height: '100%',
      backgroundImage: `url(${this.props.app.assetUrl}${this.state.backImage.collection[this.state.backImage.index]})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    };

    return (
      <div style={divStyle}>
        <button style={{background: 'none', border: 'none'}} onClick={this.props.redirectToProducts}>Enter</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app
});

const mapDispatchToProps = (dispatch: Function) => {
  return bindActionCreators({
    showHeader: appActions.showHeader,
    redirectToProducts: appActions.redirectToProducts
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
