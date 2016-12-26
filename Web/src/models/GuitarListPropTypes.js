import React from 'react';
import GuitarPropTypes from './GuitarPropTypes';

const GuitarListPropTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape(GuitarPropTypes)).isRequired,
  isReady: React.PropTypes.bool.isRequired
};

export default GuitarListPropTypes;
