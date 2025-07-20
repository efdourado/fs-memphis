import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../components/ui/Modal';

const AdminModal = ({ isOpen, onClose, title, FormComponent, formProps }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <FormComponent {...formProps} />
    </Modal>
); };

AdminModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  FormComponent: PropTypes.elementType.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default AdminModal;