import { useEffect, useState } from 'react';
import { fetchInsights } from '../services/listeningService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const PatternsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { fetchInsights().then(({ data }) => setInsights(data)).catch(() => setError('Could not calculate your patterns.')).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingSpinner fullScreen />;
  return <main className="listening-page"><header className="listening-page__header"><p className="listening-page__eyebrow">Patterns</p><h1>Nothing hidden in the math.</h1><p>Every insight shows the evidence behind it.</p></header>{error && <ErrorMessage message={error} />}{insights.length === 0 ? <div className="listening-empty">Record a few moments to reveal patterns.</div> : <div className="insight-grid">{insights.map((insight) => <article key={insight._id} className="insight-card"><span>{insight.type}</span><h2>{insight.summary}</h2><dl>{Object.entries(insight.evidence || {}).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{Array.isArray(value) ? value.join(' · ') : typeof value === 'object' && value ? JSON.stringify(value) : String(value)}</dd></div>)}</dl></article>)}</div>}</main>;
};

export default PatternsPage;
