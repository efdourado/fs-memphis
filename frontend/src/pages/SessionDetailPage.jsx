import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListeningSessionForm from '../components/listening/ListeningSessionForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { deleteSession, fetchSession, updateSession } from '../services/listeningService';

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchSession(id).then(({ data }) => setSession(data)).catch(() => setError('Could not load this moment.')); }, [id]);
  const update = async (data) => { setSaving(true); try { const response = await updateSession(id, data); setSession(response.data); setEditing(false); } catch { setError('Could not update this moment.'); } finally { setSaving(false); } };
  const remove = async () => { if (!window.confirm('Delete this listening moment?')) return; await deleteSession(id); navigate('/journal'); };

  if (error && !session) return <ErrorMessage message={error} />;
  if (!session) return <LoadingSpinner fullScreen />;

  if (editing) return <main className="listening-page listening-page--narrow"><ListeningSessionForm initialData={session} onSubmit={update} saving={saving} submitLabel="Save changes" /></main>;

  return (
    <main className="listening-page listening-page--narrow">
      <Link to="/journal" className="listening-back">← Journal</Link>
      <article className="session-detail">
        <header><p className="listening-page__eyebrow">{new Date(session.occurredAt).toLocaleString()}</p><h1>{session.activity || 'Listening moment'}</h1><p>{session.durationMinutes} minutes · {session.source} · private</p></header>
        <div className="session-detail__moods"><div><span>Before</span><strong>{session.moodBefore?.join(', ') || '—'}</strong></div><div><span>After</span><strong>{session.moodAfter?.join(', ') || '—'}</strong></div></div>
        {session.note && <blockquote>{session.note}</blockquote>}
        {(session.reference?.title || session.reference?.url) && <div className="session-reference"><span>Reference</span>{session.reference.url ? <a href={session.reference.url} target="_blank" rel="noreferrer">{session.reference.title || session.reference.url}</a> : <strong>{session.reference.title}</strong>}<p>{session.reference.creator}</p></div>}
        <footer><button className="login-btn" onClick={() => setEditing(true)}>Edit</button><button className="session-delete" onClick={remove}>Delete</button></footer>
      </article>
    </main>
  );
};

export default SessionDetailPage;
