import { useState } from 'react';

const sources = ['spotify', 'youtube', 'bandcamp', 'soundcloud', 'vinyl', 'radio', 'live', 'other'];
const socialContexts = ['', 'alone', 'friends', 'family', 'partner', 'crowd', 'other'];

const initialValues = {
  occurredAt: new Date().toISOString().slice(0, 16),
  durationMinutes: 30,
  source: 'other',
  activity: '',
  moodBefore: '',
  moodAfter: '',
  location: '',
  socialContext: '',
  note: '',
  reference: { title: '', creator: '', url: '', service: '', externalId: '' },
};

const toFormValues = (value = {}) => ({
  ...initialValues,
  ...value,
  occurredAt: value.occurredAt ? new Date(value.occurredAt).toISOString().slice(0, 16) : initialValues.occurredAt,
  moodBefore: Array.isArray(value.moodBefore) ? value.moodBefore.join(', ') : value.moodBefore || '',
  moodAfter: Array.isArray(value.moodAfter) ? value.moodAfter.join(', ') : value.moodAfter || '',
  reference: { ...initialValues.reference, ...(value.reference || {}) },
});

const ListeningSessionForm = ({ initialData, onSubmit, submitLabel = 'Save moment', saving = false }) => {
  const [values, setValues] = useState(() => toFormValues(initialData));

  const setField = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('reference.')) {
      const key = name.split('.')[1];
      setValues((current) => ({ ...current, reference: { ...current.reference, [key]: value } }));
      return;
    }
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const toList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
    onSubmit({
      ...values,
      durationMinutes: Number(values.durationMinutes),
      occurredAt: new Date(values.occurredAt).toISOString(),
      moodBefore: toList(values.moodBefore),
      moodAfter: toList(values.moodAfter),
      reference: { ...values.reference, service: values.reference.service || '' },
    });
  };

  return (
    <form className="listening-form" onSubmit={submit}>
      <div className="listening-form__grid">
        <label>When<input name="occurredAt" type="datetime-local" value={values.occurredAt} onChange={setField} required /></label>
        <label>Minutes<input name="durationMinutes" type="number" min="1" max="1440" value={values.durationMinutes} onChange={setField} required /></label>
        <label>Source<select name="source" value={values.source} onChange={setField}>{sources.map((source) => <option key={source}>{source}</option>)}</select></label>
        <label>Activity<input name="activity" value={values.activity} onChange={setField} placeholder="focus, walk, rest..." /></label>
        <label>Before<input name="moodBefore" value={values.moodBefore} onChange={setField} placeholder="restless, tired" /></label>
        <label>After<input name="moodAfter" value={values.moodAfter} onChange={setField} placeholder="calm, energized" /></label>
        <label>Place<input name="location" value={values.location} onChange={setField} /></label>
        <label>With<select name="socialContext" value={values.socialContext} onChange={setField}>{socialContexts.map((context) => <option key={context} value={context}>{context || 'not recorded'}</option>)}</select></label>
      </div>

      <label className="listening-form__wide">Reflection<textarea name="note" rows="5" value={values.note} onChange={setField} placeholder="What changed while you listened?" /></label>

      <fieldset className="listening-form__reference">
        <legend>Optional reference</legend>
        <div className="listening-form__grid">
          <label>Title<input name="reference.title" value={values.reference.title} onChange={setField} /></label>
          <label>Creator<input name="reference.creator" value={values.reference.creator} onChange={setField} /></label>
          <label>Link<input name="reference.url" type="url" value={values.reference.url} onChange={setField} /></label>
          <label>Service<select name="reference.service" value={values.reference.service} onChange={setField}><option value="">not recorded</option>{sources.map((source) => <option key={source}>{source}</option>)}</select></label>
        </div>
      </fieldset>

      <button className="login-btn always-hover listening-form__submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
    </form>
  );
};

export default ListeningSessionForm;
