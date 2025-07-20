import React from 'react';

import PropTypes from 'prop-types';

import ErrorMessage from '../../../components/ui/ErrorMessage';

const AuthForm = ({ children, title, error, onSubmit }) => {
  return (
    <div className="auth-form-section">
      <form onSubmit={onSubmit} className="auth-form">
        <div dangerouslySetInnerHTML={{ __html: title }} />
        <ErrorMessage message={error} />
        {children}
      </form>
    </div>
); };

AuthForm.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default AuthForm;