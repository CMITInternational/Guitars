import React from 'react';

const AppPropTypes = {
  apiUrl: React.PropTypes.string.isRequired,
  assetUrl: React.PropTypes.string.isRequired,
  isReady: React.PropTypes.bool.isRequired,
  admin: React.PropTypes.string.isRequired,
  showAuth: React.PropTypes.bool.isRequired,
  isAdmin: React.PropTypes.bool.isRequired
};

export default AppPropTypes;
