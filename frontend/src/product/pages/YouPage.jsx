import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, errorMessage } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import { FollowButton, SaveButton } from '../components/LibraryButtons';
import SongRow from '../components/SongRow';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';
import { THEME_OPTIONS, applyTheme, storedTheme } from '../theme';

function ThemeChoice() {
  const [choice, setChoice] = useState(storedTheme);
  return (
    <fieldset className="m-segmented">
      <legend>Appearance</legend>
      <div className="m-segmented__options">
        {THEME_OPTIONS.map((option) => (
          <label key={option.id} className={choice === option.id ? 'is-on' : ''}>
            <input
              type="radio"
              name="theme"
              value={option.id}
              checked={choice === option.id}
              onChange={() => { applyTheme(option.id); setChoice(option.id); }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Account() {
  const { currentUser, logout } = useAuth();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const download = async () => {
    setBusy('export');
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
      setBusy('');
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete your Memphis account, saved songs, questions and journal? This cannot be undone.')) return;
    setBusy('delete');
    try {
      await api.deleteAccount();
      logout();
    } catch (requestError) {
      setError(errorMessage(requestError));
      setBusy('');
    }
  };

  return (
    <section className="m-block" aria-labelledby="account-title">
      <h2 id="account-title" className="m-subhead">Account</h2>
      <p className="m-muted">{currentUser.email}</p>
      <ThemeChoice />
      <div className="m-account">
        <p className="m-small m-muted">Memphis keeps only what you save here. You can take it with you or delete it.</p>
        <div className="m-actions">
          <button type="button" className="m-button" onClick={download} disabled={!!busy}>Download my data</button>
          <button type="button" className="m-button" onClick={logout}>Sign out</button>
          <button type="button" className="m-button m-button--danger" onClick={remove} disabled={!!busy}>Delete account</button>
        </div>
        {error && <p className="m-small m-error" role="alert">{error}</p>}
      </div>
    </section>
  );
}

function SignedOut() {
  return (
    <div className="m-page m-page--narrow">
      <h1 className="m-title">Your Memphis</h1>
      <div className="m-callout">
        <p><strong>Keep what you discover.</strong> Save songs, follow the people behind them and keep your own questions. Memphis brings back what changes.</p>
        <Link className="m-button m-button--primary" to="/signin" state={{ from: '/you' }}>Sign in or create an account</Link>
      </div>
      <section className="m-block">
        <h2 className="m-subhead">Settings</h2>
        <ThemeChoice />
      </section>
      <MoreLinks />
    </div>
  );
}

const MoreLinks = () => (
  <section className="m-block" aria-labelledby="more-title">
    <h2 id="more-title" className="m-subhead">More</h2>
    <ul className="m-link-list">
      <li><Link to="/about">About Memphis and how claims are labeled</Link></li>
      <li><Link to="/design-archive">Design Archive: the original Memphis interface</Link></li>
    </ul>
  </section>
);

export default function YouPage() {
  usePageTitle('You');
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <SignedOut />;
  return <Library name={currentUser.name} />;
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
    <div className="m-page m-page--narrow">
      <h1 className="m-title">{name ? `${name.split(' ')[0]}’s Memphis` : 'Your Memphis'}</h1>

      {loading && !data && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && (
        <>
          <section className="m-block" aria-labelledby="saved-title">
            <h2 id="saved-title" className="m-subhead">Saved songs</h2>
            {data.saved.length ? (
              <ul className="m-list">
                {data.saved.map((work) => (
                  <SongRow key={work.slug} work={work} note={`Saved ${formatDate(work.savedAt)}`}>
                    <SaveButton slug={work.slug} compact />
                  </SongRow>
                ))}
              </ul>
            ) : (
              <p className="m-state">Nothing saved yet. <Link to="/">Find a song to start with</Link>.</p>
            )}
          </section>

          <section className="m-block" aria-labelledby="following-title">
            <h2 id="following-title" className="m-subhead">Following</h2>
            {data.following.length ? (
              <ul className="m-credits">
                {data.following.map((person) => (
                  <li key={person.slug}>
                    <Link to={`/people/${person.slug}`} className="m-credits__name">{person.name}</Link>
                    <span className="m-muted">Since {formatDate(person.followedAt)}</span>
                    <FollowButton slug={person.slug} name={person.name} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-state">Follow a writer, producer or performer from any song’s credits.</p>
            )}
          </section>

          {data.fromFollowed.length > 0 && (
            <section className="m-block" aria-labelledby="from-followed-title">
              <h2 id="from-followed-title" className="m-subhead">From people you follow</h2>
              <ul className="m-list">
                {data.fromFollowed.map(({ work, people }) => (
                  <SongRow key={work.slug} work={work} note={`Credits ${people.map((p) => p.name).join(', ')}`} />
                ))}
              </ul>
            </section>
          )}

          <section className="m-block" aria-labelledby="questions-title">
            <h2 id="questions-title" className="m-subhead">Your questions</h2>
            {data.questions.length ? (
              <ul className="m-questions">
                {data.questions.map((q) => (
                  <li key={q._id}>
                    <p>{q.text}</p>
                    <p className="m-small m-muted">
                      <Link to={`/songs/${q.work.slug}`}>{q.work.title}</Link> · {formatDate(q.createdAt)}
                      {' · '}
                      <button type="button" className="m-text-button" onClick={() => removeQuestion(q._id)}>Remove</button>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-state">Questions you keep on a song page appear here, so you can return to them.</p>
            )}
          </section>
        </>
      )}

      <Account />
      <section className="m-block" aria-labelledby="journal-title">
        <h2 id="journal-title" className="m-subhead">Listening journal</h2>
        <p className="m-muted">The earlier private journal still works while Memphis decides how it fits.</p>
        <ul className="m-link-list">
          <li><Link to="/journal">Open the journal</Link></li>
        </ul>
      </section>
      <MoreLinks />
    </div>
  );
}
