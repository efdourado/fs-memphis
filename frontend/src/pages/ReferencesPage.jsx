import { useEffect, useState } from 'react';
import { fetchReferences } from '../services/listeningService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ReferencesPage = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { fetchReferences().then(({ data }) => setReferences(data)).catch(() => setError('Could not load your references.')).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingSpinner fullScreen />;
  return <main className="listening-page"><header className="listening-page__header"><p className="listening-page__eyebrow">References</p><h1>What accompanied the moments.</h1><p>Links only. Memphis does not copy the catalog.</p></header>{error && <ErrorMessage message={error} />}<div className="reference-grid">{references.map((reference, index) => <article className="reference-card" key={reference.externalId || reference.url || index}><span>{reference.service || 'reference'}</span><h2>{reference.title || 'Untitled'}</h2><p>{reference.creator}</p>{reference.url && <a href={reference.url} target="_blank" rel="noreferrer">Open source</a>}</article>)}</div>{!error && references.length === 0 && <div className="listening-empty">References are optional and will appear here.</div>}</main>;
};

export default ReferencesPage;
