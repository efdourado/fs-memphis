import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';

const KINDS = {
  context: 'New context',
  listening: 'Listening note',
  collection: 'New in the collection',
  comparison: 'New comparison',
};

function UpdateItem({ update }) {
  return (
    <li className={`m-update${update.isNew ? ' is-new' : ''}`}>
      <Link to={update.link}>
        <p className="m-update__meta">
          <span>{KINDS[update.kind]}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={update.date}>{formatDate(update.date)}</time>
          {update.isNew && <span className="m-new">New</span>}
        </p>
        <strong>{update.title}</strong>
        {update.body && <span className="m-muted">{update.body}</span>}
      </Link>
    </li>
  );
}

export default function UpdatesPage() {
  usePageTitle('Updates');
  const { isAuthenticated } = useAuth();
  const { setUnseen } = useLibrary();
  const { data, loading, error, reload } = useResource(() => api.updates(), [isAuthenticated]);

  // Opening the page counts as seeing what is new; the labels stay for this visit.
  useEffect(() => {
    if (!isAuthenticated || !data?.unseen) return;
    api.markUpdatesSeen().then(() => setUnseen(0)).catch(() => {});
  }, [isAuthenticated, data, setUnseen]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const forYou = data.items.filter((item) => item.relevant);
  const rest = data.items.filter((item) => !item.relevant);

  return (
    <div className="m-page m-page--narrow">
      <h1 className="m-title">Updates</h1>
      <p className="m-muted">What changed in Memphis around the songs and people you keep. A useful week is enough; there is no streak to keep.</p>

      {isAuthenticated ? (
        <section className="m-block" aria-labelledby="for-you">
          <h2 id="for-you" className="m-subhead">For you</h2>
          {forYou.length ? (
            <ul className="m-updates">{forYou.map((u) => <UpdateItem key={u.key} update={u} />)}</ul>
          ) : (
            <p className="m-state">Save songs or follow people and their updates will appear here.</p>
          )}
        </section>
      ) : (
        <div className="m-callout">
          <p><strong>Get updates about the songs you care about.</strong> Save a song or follow a collaborator, and Memphis brings back what changes.</p>
          <Link className="m-button m-button--primary" to="/signin" state={{ from: '/updates' }}>Sign in</Link>
        </div>
      )}

      {rest.length > 0 && (
        <section className="m-block" aria-labelledby="everything">
          <h2 id="everything" className="m-subhead">{isAuthenticated ? 'Everything else' : 'Latest'}</h2>
          <ul className="m-updates">{rest.map((u) => <UpdateItem key={u.key} update={u} />)}</ul>
        </section>
      )}
    </div>
  );
}
