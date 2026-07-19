import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSessions } from '../services/listeningService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const JournalPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchSessions().then(({ data }) => setSessions(data)).catch(() => setError('Could not load your journal.')).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <main className="listening-page">
      <header className="listening-page__header"><p className="listening-page__eyebrow">Journal</p><h1>Your listening moments.</h1><p>Private by default. Written by you.</p></header>
      {error && <ErrorMessage message={error} />}
      {sessions.length === 0 ? <div className="listening-empty"><p>No moments yet.</p><Link to="/today">Start with today</Link></div> : (
        <div className="journal-list">{sessions.map((session) => (
          <Link className="journal-card" key={session._id} to={`/session/${session._id}`}>
            <time>{new Date(session.occurredAt).toLocaleString()}</time>
            <h2>{session.activity || session.reference?.title || 'Listening moment'}</h2>
            <p>{session.note || `${session.moodBefore?.join(', ') || '—'} → ${session.moodAfter?.join(', ') || '—'}`}</p>
            <span>{session.durationMinutes} min · {session.source}</span>
          </Link>
        ))}</div>
      )}
    </main>
  );
};

export default JournalPage;
