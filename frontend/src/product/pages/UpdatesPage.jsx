import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import Cover from '../components/Cover';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';

const KINDS = {
  context: 'New context',
  listening: 'Listening note',
  collection: 'Just added',
  comparison: 'New comparison',
};

function UpdateItem({ update }) {
  const slug = update.workSlugs[0];
  return (
    <li className={`p-update${update.isNew ? ' is-new' : ''}`}>
      <Link to={update.link}>
        {slug && <Cover slug={slug} size="md" />}
        <span className="p-update__text">
          <span className="p-update__meta">
            {KINDS[update.kind]} • {formatDate(update.date)}
            {update.isNew && <span className="p-new">New</span>}
          </span>
          <strong>{update.title}</strong>
          {update.body && <span className="p-update__body">{update.body}</span>}
        </span>
      </Link>
    </li>
  );
}

export default function UpdatesPage() {
  usePageTitle('What’s new');
  const { isAuthenticated } = useAuth();
  const { setUnseen } = useLibrary();
  const { data, loading, error, reload } = useResource(() => api.updates(), [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !data?.unseen) return;
    api.markUpdatesSeen().then(() => setUnseen(0)).catch(() => {});
  }, [isAuthenticated, data, setUnseen]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const forYou = data.items.filter((item) => item.relevant);
  const rest = data.items.filter((item) => !item.relevant);

  return (
    <div className="p-page p-page--narrow">
      <h1 className="p-page-title">What’s new</h1>

      {isAuthenticated ? (
        <section className="p-section">
          <div className="carousel__header"><h2 className="carousel__title">For you</h2></div>
          {forYou.length ? (
            <ul className="p-updates">{forYou.map((u) => <UpdateItem key={u.key} update={u} />)}</ul>
          ) : (
            <p className="p-empty">Save a song or follow someone, and their news lands here.</p>
          )}
        </section>
      ) : (
        <div className="p-invite">
          <p>Save the songs you love and follow the people behind them. We’ll tell you when there’s something new.</p>
          <Link className="cta-button secondary-cta p-invite__cta" to="/auth" state={{ from: { pathname: '/updates' } }}>Join Us</Link>
        </div>
      )}

      {rest.length > 0 && (
        <section className="p-section">
          <div className="carousel__header">
            <h2 className="carousel__title">{isAuthenticated ? 'Everything else' : 'Latest'}</h2>
          </div>
          <ul className="p-updates">{rest.map((u) => <UpdateItem key={u.key} update={u} />)}</ul>
        </section>
      )}
    </div>
  );
}
