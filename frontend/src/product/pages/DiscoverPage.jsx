import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import SongRow from '../components/SongRow';
import { STATUS_INFO } from '../components/Status';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';
import { SearchIcon } from '../shell/Icons';

const JOURNEYS = [
  {
    to: '/compare?a=running-up-that-hill&b=dreams',
    kicker: 'Compare',
    title: 'Two old songs, two different returns',
    body: 'One came back through a TV series, the other through a skateboarding video.',
  },
  {
    to: '/compare?a=bad-guy&b=birds-of-a-feather',
    kicker: 'Compare',
    title: 'Same writers, five years apart',
    body: 'Billie Eilish and Finneas, from a whisper to an open chorus.',
  },
  {
    to: '/people/max-martin',
    kicker: 'Follow a person',
    title: 'One writer across two decades of No. 1s',
    body: 'From Britney Spears in 1998 to The Weeknd in 2019.',
  },
];

export default function DiscoverPage() {
  usePageTitle('');
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const works = useResource(() => api.works(), []);
  const updates = useResource(() => api.updates(), []);

  const submit = (event) => {
    event.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="m-page">
      <section className="m-hero">
        <h1 className="m-display">Understand what you’re hearing.</h1>
        <p className="m-lede">
          Pick a song. See what changed around it, what you can hear inside it and who connects it
          to the rest of your music. Every claim says where it comes from.
        </p>
        <form className="m-search" role="search" onSubmit={submit}>
          <SearchIcon size={20} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="A song, an artist, a producer…"
            aria-label="Search the collection"
          />
        </form>
      </section>

      <section className="m-block" aria-labelledby="start-title">
        <header className="m-block__header">
          <h2 id="start-title">Start with a question</h2>
          <p className="m-muted">Ten songs, each researched for one complete journey.</p>
        </header>
        {works.loading && <Loading />}
        {works.error && <ErrorState message={works.error} onRetry={works.reload} />}
        {works.data && (
          <ul className="m-list m-list--grid">
            {works.data.map((work) => (
              <SongRow key={work.slug} work={work} note={work.question} />
            ))}
          </ul>
        )}
      </section>

      <section className="m-block" aria-labelledby="journeys-title">
        <header className="m-block__header">
          <h2 id="journeys-title">Follow a connection</h2>
        </header>
        <div className="m-cards">
          {JOURNEYS.map((journey) => (
            <Link key={journey.to} to={journey.to} className="m-card">
              <span className="m-kicker">{journey.kicker}</span>
              <strong>{journey.title}</strong>
              <span className="m-muted">{journey.body}</span>
            </Link>
          ))}
        </div>
      </section>

      {updates.data?.items?.length > 0 && (
        <section className="m-block" aria-labelledby="new-title">
          <header className="m-block__header m-block__header--row">
            <h2 id="new-title">New in Memphis</h2>
            <Link to="/updates">All updates</Link>
          </header>
          <ul className="m-feed">
            {updates.data.items.slice(0, 3).map((update) => (
              <li key={update.key}>
                <Link to={update.link}>
                  <time className="m-muted" dateTime={update.date}>{formatDate(update.date)}</time>
                  <strong>{update.title}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="m-block m-legend" aria-labelledby="legend-title">
        <header className="m-block__header m-block__header--row">
          <h2 id="legend-title">How to read Memphis</h2>
          <Link to="/about">Method</Link>
        </header>
        <ul>
          {Object.entries(STATUS_INFO).map(([key, info]) => (
            <li key={key}><Status status={key} /><span className="m-muted">{info.description}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
