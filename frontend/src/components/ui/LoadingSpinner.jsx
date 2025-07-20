import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullScreen = true, message }) => {
  return (
    <div className={fullScreen ? 'loading-screen' : 'loading-container'}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
); };

LoadingSpinner.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
};

export default LoadingSpinner;