import React from 'react';
import PropTypes from 'prop-types';

const Form = ({ children, onSubmit }) => {
  return (
    <form className="form-container" onSubmit={onSubmit}>
      {children}
    </form>
); };

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;