import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, errorMessage } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import Cover from '../components/Cover';
import { ErrorState, Loading } from '../components/States';
import { PersonTile, Shelf, SongTile } from '../components/Tiles';
import { useLibrary } from '../LibraryContext';

function Account() {
  const { currentUser, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await api.exportData();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'memphis-data.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteAccount();
      logout();
    } catch (requestError) {
      setError(errorMessage(requestError));
      setBusy(false);
    }
  };

  return (
    <section className="p-sec">
      <h2 className="p-md">Your account</h2>
      <p className="p-small">Signed in as {currentUser.email}. Memphis only keeps what you save here.</p>
      {confirming ? (
        <div className="p-card p-pad p-stack">
          <p>Delete your account and everything you saved? This can’t be undone.</p>
          <div className="p-btns">
            <button type="button" className="p-btn p-btn--danger" onClick={remove} disabled={busy}>Yes, delete it</button>
            <button type="button" className="p-btn p-btn--quiet" onClick={() => setConfirming(false)} disabled={busy}>Keep it</button>
          </div>
        </div>
      ) : (
        <div className="p-btns">
          <button type="button" className="p-btn p-btn--quiet" onClick={download} disabled={busy}>Download my data</button>
          <button type="button" className="p-btn p-btn--quiet" onClick={logout}>Log out</button>
          <button type="button" className="p-btn p-btn--danger" onClick={() => setConfirming(true)}>Delete account</button>
        </div>
      )}
      {error && <p className="p-error" role="alert">{error}</p>}
    </section>
  );
}

function News() {
  const { setUnseen } = useLibrary();
  const { data } = useResource(() => api.updates(), []);
  const mine = (data?.items || []).filter((item) => item.relevant);
  if (!mine.length) return null;

  const seen = () => api.markUpdatesSeen().then(() => setUnseen(0)).catch(() => {});

  return (
    <section className="p-sec">
      <div className="p-rowhead"><h2 className="p-md">New for you</h2><Link to="/updates">Everything new</Link></div>
      <ul className="p-rows">
        {mine.slice(0, 4).map((update) => (
          <li key={update.key}>
            <Link to={update.link} onClick={seen}>
              {update.workSlugs[0] && <Cover slug={update.workSlugs[0]} variant="thumb" />}
              <span><span>{update.title}{update.isNew && <span className="p-dot" />}</span><span>{update.body}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Library({ name }) {
  const { saved, following } = useLibrary();
  const { data, loading, error, reload, setData } = useResource(() => api.library(), [saved.size, following.size]);

  const removeQuestion = async (id) => {
    try {
      setData(await api.removeQuestion(id));
    } catch {
      reload();
    }
  };

  return (
    <div className="p-page">
      <h1 className="p-xl">{name ? `${name.split(' ')[0]}’s shelf` : 'Your shelf'}</h1>

      {loading && !data && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && (
        <>
          <News />

          {data.saved.length ? (
            <Shelf title="Saved songs">
              {data.saved.map((work) => <SongTile key={work.slug} work={work} note={`Saved ${formatDate(work.savedAt)}`} />)}
            </Shelf>
          ) : (
            <section className="p-sec">
              <h2 className="p-md">Saved songs</h2>
              <p className="p-notice">Nothing yet. <Link className="p-link" to="/">Open a song</Link> and press Save.</p>
            </section>
          )}

          {data.following.length ? (
            <Shelf title="People you follow">
              {data.following.map((person) => <PersonTile key={person.slug} person={person} note={`Since ${formatDate(person.followedAt)}`} />)}
            </Shelf>
          ) : (
            <section className="p-sec">
              <h2 className="p-md">People you follow</h2>
              <p className="p-notice">Follow anyone from a song’s credits to see what else they made.</p>
            </section>
          )}

          {data.fromFollowed.length > 0 && (
            <Shelf title="More from them">
              {data.fromFollowed.map(({ work, people }) => (
                <SongTile key={work.slug} work={work} note={people.map((p) => p.name).join(', ')} />
              ))}
            </Shelf>
          )}

          {data.questions.length > 0 && (
            <section className="p-sec">
              <h2 className="p-md">Your notes</h2>
              <ul className="p-list p-list--plain">
                {data.questions.map((q) => (
                  <li key={q._id}>
                    <div>
                      <span style={{ color: 'var(--ink)' }}>{q.text}</span>
                      <span><Link className="p-link" to={`/songs/${q.work.slug}`}>{q.work.title}</Link> · {formatDate(q.createdAt)}</span>
                    </div>
                    <button type="button" className="p-text-btn" onClick={() => removeQuestion(q._id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <Account />
    </div>
  );
}

export default function SavedPage() {
  usePageTitle('Saved');
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-page p-page--read">
        <section className="p-hero">
          <h1 className="p-lg">Keep what you find.</h1>
          <p className="p-lede">Save songs and follow the people who made them. When there’s more from them, it shows up here.</p>
          <Link className="p-btn p-btn--fill" to="/auth" state={{ from: { pathname: '/saved' } }}>Log in or sign up</Link>
        </section>
      </div>
    );
  }

  return <Library name={currentUser.name} />;
}
