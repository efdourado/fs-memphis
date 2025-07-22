import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../../../components/ui/ErrorMessage';
import Form from '../../../components/ui/Form'; 
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AdminForm = ({ id, config, onSaved, onCancel }) => {
  const [formData, setFormData] = useState(config.initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [relatedData, setRelatedData] = useState({});

  const isEditing = Boolean(id);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const promises = [];

        if (isEditing) {
          promises.push(config.api.fetchById(id));
        }

        if (config.relations) {
          Object.values(config.relations).forEach(relation => {
            promises.push(relation.fetch());
        }); }

        const responses = await Promise.all(promises);
        let currentFormData = config.initialState;

        if (isEditing) {
          const { data: itemData } = responses.shift();
          currentFormData = config.processDataForForm(itemData);
        }
        
        setFormData(currentFormData);

        if (config.relations) {
          const newRelatedData = {};
          Object.keys(config.relations).forEach((key, index) => {
            newRelatedData[key] = responses[index].data;
          });
          setRelatedData(newRelatedData);
        }
      } catch (err) {
        setError('Failed to load form data. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
    } };
    
    loadInitialData();
  }, [id, config, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;
    
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [outerKey]: {
                ...prev[outerKey],
                [innerKey]: type === 'checkbox' ? checked : value
            }
        }));
    } else if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const submissionData = config.processDataForSubmit(formData);

    try {
      if (isEditing) {
        await config.api.update(id, submissionData);
      } else {
        await config.api.create(submissionData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save item');
    } finally {
      setSaving(false);
  } };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <div className="form-grid">
        {config.fields.map(field => {
          if (field.condition && !field.condition(formData)) {
            return null;
          }

          const value = field.name.includes('.')
            ? field.name.split('.').reduce((o, i) => o?.[i], formData)
            : formData[field.name];

          const { name, label, type, component = 'input', optionsKey, description, options: fieldOptions, ...rest } = field;
          
          if (component === 'input') {
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name}>{label}</label>
                <input type={type} id={name} value={value || ''} name={name} onChange={handleChange} spellCheck="false" {...rest} />
              </div>
          ); }
          
          if (component === 'textarea') {
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name}>{label}</label>
                <textarea id={name} name={name} value={value || ''} onChange={handleChange} {...rest} />
              </div>
          ); }
          
          if (component === 'select') {
            const options = optionsKey ? relatedData[optionsKey] || [] : fieldOptions || [];
            return (
              <div key={name} className={`form-group ${field.span || ''} ${field.className || ''}`}>
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={value || (rest.multiple ? [] : '')} onChange={handleChange} {...rest}>
                  {!rest.multiple && <option value="" disabled>Select {label}</option>}
                  {options.map(option => (
                    <option key={option._id} value={option._id}>{option.name || option.name || option.title}</option>
                  ))}
                </select>
              </div>
          ); }
          
          if (component === 'checkbox') {
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name} className="checkbox-label">{label}</label>
                <div className="checkbox-container">
                  <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor={name} className="checkbox-label">{description}</label>
                </div>
              </div>
          ); }
          
          return null;
        })}
      </div>
      <div className="form-actions">
        <button type="submit" className="login-btn" disabled={saving}>
          {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create')}
        </button>
      </div>
    </Form>
); };

AdminForm.propTypes = {
  id: PropTypes.string,
  config: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdminForm;