import React from 'react';

const GuitarPropTypes = {
  Id: React.PropTypes.string.isRequired,
  Title: React.PropTypes.string.isRequired,
  SubTitle: React.PropTypes.string.isRequired,
  Description: React.PropTypes.string.isRequired,
  Date: React.PropTypes.string.isRequired,
  Client: React.PropTypes.string.isRequired,
  Category: React.PropTypes.string.isRequired,
  Classes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  Images: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  Path: React.PropTypes.string.isRequired,
  Thumb: React.PropTypes.string.isRequired
};

export default GuitarPropTypes;
