import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { api } from '../api';
import { formatDate, usePageTitle, useResource, yearOf } from '../hooks';
import { PersonCard, Row, SongCard } from '../components/Cards';
import Cover from '../components/Cover';
import { ErrorState, Loading } from '../components/States';

const JOURNEYS = [
  {
    title: 'Two songs, two comebacks',
    by: 'A Memphis journey',
    note: 'One came back through a TV show, the other through a skateboard and a bottle of juice. Decades later, both hit the charts again.',
    songs: ['running-up-that-hill', 'dreams'],
  },
  {
    title: 'Same writers, five years apart',
    by: 'A Memphis journey',
    note: 'Billie Eilish and Finneas went from a whisper to a wide-open chorus. Hear what changed — and what didn’t.',
    songs: ['bad-guy', 'birds-of-a-feather'],
  },
];

function Journey({ journey, works }) {
  const songs = journey.songs.map((slug) => works.find((w) => w.slug === slug)).filter(Boolean);
  if (songs.length < 2) return null;
  const [a, b] = songs;
  return (
    <section className="p-journey">
      <Link to={`/compare?a=${a.slug}&b=${b.slug}`} className="p-journey__info">
        <Cover slug={a.slug} title={a.title} size="xl" />
        <div className="p-journey__details">
          <h2>{journey.title}</h2>
          <p className="p-journey__by">{journey.by}</p>
          <p className="p-journey__meta">{songs.length} songs • {yearOf(a.released)} and {yearOf(b.released)}</p>
          <p className="p-journey__note">{journey.note}</p>
          <span className="p-pill p-pill--solid">Compare them</span>
        </div>
      </Link>
      <ol className="p-tracks">
        {songs.map((work, index) => (
          <li key={work.slug}>
            <Link to={`/songs/${work.slug}`}>
              <span className="p-tracks__number">{index + 1}</span>
              <span className="p-tracks__text">
                <strong>{work.title}</strong>
                <span>{work.artist}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function DiscoverPage() {
  usePageTitle('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const works = useResource(() => api.works(), []);
  const people = useResource(() => api.people(), []);
  const updates = useResource(() => api.updates(), []);

  return (
    <div className="p-page">
      <section className="music-hero p-hero" style={{ backgroundImage: 'linear-gradient(to right, var(--hero-gradient-start), var(--hero-gradient-end)), url(/fb.jpg)' }}>
        <div className="p-hero__content">
          <h1 className="title">{isAuthenticated ? 'You’re home' : 'Listen closer'}</h1>
          <p className="subtitle">
            Music, reimagined. Pick a song you love and see what’s inside it — who made it,
            why it took off, and where it leads next.
          </p>
          <div className="hero-quick-links">
            <button
              type="button"
              className="cta-button secondary-cta"
              onClick={() => navigate(isAuthenticated ? '/you' : '/auth')}
            >
              {isAuthenticated ? 'Your library' : 'Join Us'}
            </button>
            <button type="button" className="cta-button primary-cta" onClick={() => navigate('/updates')}>
              What’s New?
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ marginLeft: '10px' }} />
            </button>
          </div>
        </div>
      </section>

      {works.loading && <Loading />}
      {works.error && <ErrorState message={works.error} onRetry={works.reload} />}

      {works.data && (
        <>
          <Row title="Start with a song">
            {works.data.map((work) => <SongCard key={work.slug} work={work} />)}
          </Row>

          <Journey journey={JOURNEYS[0]} works={works.data} />

          {people.data?.length > 0 && (
            <Row title="The people behind them">
              {people.data.slice(0, 12).map((person) => (
                <PersonCard
                  key={person.slug}
                  person={person}
                  subtitle={person.songs > 1 ? `${person.songs} songs here` : person.roles[0]}
                />
              ))}
            </Row>
          )}

          <Journey journey={JOURNEYS[1]} works={works.data} />
        </>
      )}

      {updates.data?.items?.length > 0 && (
        <section className="carousel p-row">
          <div className="carousel__header">
            <h2 className="carousel__title">Fresh in Memphis</h2>
            <Link to="/updates" className="show-more-link">Show More</Link>
          </div>
          <ul className="p-news">
            {updates.data.items.slice(0, 3).map((update) => (
              <li key={update.key}>
                <Link to={update.link}>
                  <strong>{update.title}</strong>
                  <span>{formatDate(update.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
