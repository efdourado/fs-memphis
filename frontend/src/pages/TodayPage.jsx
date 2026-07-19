import { useState } from 'react';
import { Link } from 'react-router-dom';
import ListeningSessionForm from '../components/listening/ListeningSessionForm';
import ErrorMessage from '../components/ui/ErrorMessage';
import { createSession } from '../services/listeningService';

const TodayPage = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);

  const submit = async (data) => {
    try {
      setSaving(true);
      setError('');
      const response = await createSession(data);
      setSaved(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.errors?.[0]?.msg || 'Could not save this moment.');
    } finally { setSaving(false); }
  };

  return (
    <main className="listening-page listening-page--narrow">
      <header className="listening-page__header">
        <p className="listening-page__eyebrow">Today</p>
        <h1>Notice what listening changes.</h1>
        <p>The music stays where you found it. Memphis keeps the moment.</p>
      </header>
      {error && <ErrorMessage message={error} />}
      {saved ? (
        <section className="listening-success">
          <p>Moment saved.</p>
          <Link to={`/session/${saved._id}`}>View reflection</Link>
          <button onClick={() => setSaved(null)}>Record another</button>
        </section>
      ) : <ListeningSessionForm onSubmit={submit} saving={saving} />}
    </main>
  );
};

export default TodayPage;
