import React from 'react';

const PropTypes = {
  Header1: React.PropTypes.string,
  Header2: React.PropTypes.string,
  Address: React.PropTypes.arrayOf(React.PropTypes.string),
  Phone: React.PropTypes.string,
  Email: React.PropTypes.string,
  BusinessHours: React.PropTypes.arrayOf(React.PropTypes.shape({
    Day: React.PropTypes.string,
    Hours: React.PropTypes.string
  })),
  Map: React.PropTypes.string,
  GoogleMap: React.PropTypes.string,
  Spot: React.PropTypes.shape({
    Top: React.PropTypes.string,
    Left: React.PropTypes.string
  })
};

export default PropTypes;
