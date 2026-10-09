import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, errorMessage } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import { PersonCard, Row, SongCard } from '../components/Cards';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';

function Account() {
  const { currentUser, logout } = useAuth();
  const [busy, setBusy] = useState(false);
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
    if (!window.confirm('Delete your account and everything you saved? This can’t be undone.')) return;
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
    <section className="p-section">
      <div className="carousel__header"><h2 className="carousel__title">Your data</h2></div>
      <p className="p-section__lead">Memphis only keeps what you save. Take it with you or wipe it, anytime. Signed in as {currentUser.email}.</p>
      <div className="p-actions">
        <button type="button" className="p-pill" onClick={download} disabled={busy}>Download my data</button>
        <button type="button" className="p-pill p-pill--danger" onClick={remove} disabled={busy}>Delete account</button>
      </div>
      {error && <p className="p-error" role="alert">{error}</p>}
    </section>
  );
}

export default function YouPage() {
  usePageTitle('Your library');
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-page p-page--narrow">
        <h1 className="p-page-title">Your library</h1>
        <div className="p-invite">
          <p>Keep the songs you love, follow the people who made them, and save the questions you want answered.</p>
          <Link className="cta-button secondary-cta p-invite__cta" to="/auth" state={{ from: { pathname: '/you' } }}>Join Us</Link>
        </div>
      </div>
    );
  }

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
    <div className="p-page">
      <h1 className="p-page-title">{name ? `${name.split(' ')[0]}’s library` : 'Your library'}</h1>

      {loading && !data && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && (
        <>
          {data.saved.length ? (
            <Row title="Saved songs">
              {data.saved.map((work) => <SongCard key={work.slug} work={work} subtitle={`Saved ${formatDate(work.savedAt)}`} />)}
            </Row>
          ) : (
            <section className="p-section">
              <div className="carousel__header"><h2 className="carousel__title">Saved songs</h2></div>
              <p className="p-empty">Nothing yet. <Link to="/">Find a song</Link> and hit Save.</p>
            </section>
          )}

          {data.following.length ? (
            <Row title="Following">
              {data.following.map((person) => <PersonCard key={person.slug} person={person} subtitle={`Since ${formatDate(person.followedAt)}`} />)}
            </Row>
          ) : (
            <section className="p-section">
              <div className="carousel__header"><h2 className="carousel__title">Following</h2></div>
              <p className="p-empty">Follow anyone from a song’s credits.</p>
            </section>
          )}

          {data.fromFollowed.length > 0 && (
            <Row title="More from people you follow">
              {data.fromFollowed.map(({ work, people }) => (
                <SongCard key={work.slug} work={work} subtitle={people.map((p) => p.name).join(', ')} />
              ))}
            </Row>
          )}

          <section className="p-section">
            <div className="carousel__header"><h2 className="carousel__title">Your questions</h2></div>
            {data.questions.length ? (
              <ul className="p-questions">
                {data.questions.map((q) => (
                  <li key={q._id}>
                    <p>“{q.text}”</p>
                    <span>
                      <Link to={`/songs/${q.work.slug}`}>{q.work.title}</Link> • {formatDate(q.createdAt)} •{' '}
                      <button type="button" className="p-link-button" onClick={() => removeQuestion(q._id)}>Remove</button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-empty">Ask something on any song page and it’ll wait for you here.</p>
            )}
          </section>
        </>
      )}

      <Account />
    </div>
  );
}
