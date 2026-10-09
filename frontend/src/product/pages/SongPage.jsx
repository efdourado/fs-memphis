import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { api, errorMessage } from '../api';
import { formatDate, usePageTitle, useResource, yearOf } from '../hooks';
import AttentionChart from '../components/AttentionChart';
import { Avatar } from '../components/Cover';
import Cover from '../components/Cover';
import { SongCard } from '../components/Cards';
import { FollowButton, SaveButton } from '../components/LibraryButtons';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';

const TABS = [
  { id: 'change', label: 'What changed' },
  { id: 'why', label: 'Why' },
  { id: 'listen', label: 'Listen for' },
  { id: 'people', label: 'Who made it' },
  { id: 'next', label: 'Where next' },
];

const KIND = {
  release: 'Release', chart: 'Charts', screen: 'On screen', social: 'Social',
  award: 'Award', performance: 'Live', news: 'News',
};

function Section({ id, title, lead, children }) {
  return (
    <section id={id} className="p-section" aria-labelledby={`${id}-title`}>
      <div className="carousel__header">
        <h2 id={`${id}-title`} className="carousel__title">{title}</h2>
      </div>
      {lead && <p className="p-section__lead">{lead}</p>}
      {children}
    </section>
  );
}

function Note({ note, sources }) {
  return (
    <li className="p-note">
      <div className="p-note__head">
        <strong>{note.label}</strong>
        <Status status={note.status} source={sources[note.sourceId]} />
      </div>
      <p>{note.body}</p>
    </li>
  );
}

function ListenMenu({ links }) {
  return (
    <details className="p-listen">
      <summary className="p-pill">
        <FontAwesomeIcon icon={faHeadphones} /> Listen
      </summary>
      <ul>
        {links.map((link) => (
          <li key={link.service}>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.service} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function QuestionBox({ work }) {
  const { isAuthenticated } = useAuth();
  const { requireAccount } = useLibrary();
  const [text, setText] = useState('');
  const [state, setState] = useState({ saving: false, error: '', saved: false });

  const submit = async (event) => {
    event.preventDefault();
    if (!requireAccount()) return;
    setState({ saving: true, error: '', saved: false });
    try {
      await api.addQuestion(work.slug, text);
      setText('');
      setState({ saving: false, error: '', saved: true });
    } catch (error) {
      setState({ saving: false, error: errorMessage(error), saved: false });
    }
  };

  return (
    <form className="p-question" onSubmit={submit}>
      <label htmlFor="question">Got a question about this song?</label>
      <textarea
        id="question"
        rows={3}
        maxLength={280}
        placeholder={work.question}
        value={text}
        onChange={(event) => { setText(event.target.value); setState((s) => ({ ...s, saved: false })); }}
      />
      <div className="p-question__footer">
        <span aria-live="polite">
          {state.error || (state.saved ? <>Kept in <Link to="/you">your library</Link>.</> : 'We’ll keep it in your library.')}
        </span>
        <button type="submit" className="p-pill p-pill--solid" disabled={state.saving || (isAuthenticated && !text.trim())}>
          {isAuthenticated ? 'Keep it' : 'Log in to keep it'}
        </button>
      </div>
    </form>
  );
}

export default function SongPage() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const { data: work, loading, error, status, reload } = useResource(() => api.work(slug), [slug]);
  usePageTitle(work?.title);

  useEffect(() => {
    if (work && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [work, hash]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} notFound={status === 404} />;

  const sources = Object.fromEntries(work.sources.map((s) => [s.id, s]));
  const { reading } = work;

  return (
    <article className="p-page p-song">
      <header className="p-song__header">
        <Cover slug={work.slug} title={work.title} size="xl" />
        <div className="p-song__details">
          <p className="p-eyebrow">Song</p>
          <h1 className="p-song__title">{work.title}</h1>
          <p className="p-song__by">
            By {work.artistSlugs[0] ? <Link to={`/people/${work.artistSlugs[0]}`}>{work.artist}</Link> : work.artist}
          </p>
          <p className="p-song__meta">
            {yearOf(work.released)}
            {work.album && <><span className="meta-divider">•</span>{work.album}</>}
            {work.genres[0] && <><span className="meta-divider">•</span>{work.genres.join(', ')}</>}
          </p>
          <p className="p-song__summary">{work.summary}</p>
          <div className="p-actions">
            <SaveButton slug={work.slug} />
            <ListenMenu links={work.listen} />
            {work.compareSuggestions[0] && (
              <Link className="p-pill" to={`/compare?a=${work.slug}&b=${work.compareSuggestions[0].slug}`}>Compare</Link>
            )}
          </div>
        </div>
      </header>

      {work.question && (
        <p className="p-big-question">“{work.question}”</p>
      )}

      <nav className="p-tabs" aria-label="On this page">
        {TABS.map((tab) => (
          <a key={tab.id} href={`#${tab.id}`} className="hero-tab-button">{tab.label}</a>
        ))}
      </nav>

      <Section id="change" title="What changed">
        <div className="p-panel">
          <div className="p-panel__head">
            <span>How much attention it got, over time</span>
            <Status status="demo" />
          </div>
          <AttentionChart
            points={work.attention.points}
            events={work.events}
            label={`${reading.label}. ${reading.explanation}`}
          />
          <div className="p-reading">
            <strong>{reading.label}</strong>
            <Status status="computed" />
            <p>{reading.explanation}</p>
          </div>
          <p className="p-fine">Demo curve — real listening data is on the way. <Link to="/about#method">How we read it</Link></p>
        </div>
        {work.facts.length > 0 && (
          <ul className="p-notes">
            {work.facts.map((fact) => <Note key={fact.label} note={fact} sources={sources} />)}
          </ul>
        )}
      </Section>

      <Section id="why" title="Why it might have happened" lead="Timing isn’t proof — but it’s a good lead.">
        <ol className="p-timeline">
          {work.events.map((event, index) => (
            <li key={`${event.date}-${event.title}`}>
              <span className="p-timeline__pin">{index + 1}</span>
              <div>
                <p className="p-timeline__meta">{formatDate(event.date)} • {KIND[event.kind]}</p>
                <h3>{event.title}</h3>
                {event.body && <p>{event.body}</p>}
                <Status status={event.status} source={sources[event.sourceId]} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="listen" title="Listen for" lead="Put it on and try this.">
        <ol className="p-guide">
          {work.guide.map((step, index) => (
            <li key={step.label}>
              <span className="p-guide__step">{index + 1}</span>
              <div>
                <strong>{step.label}</strong>
                <p>{step.body}</p>
                <Status status={step.status} source={sources[step.sourceId]} />
              </div>
            </li>
          ))}
        </ol>
        <h3 className="p-subhead">Under the hood</h3>
        <ul className="p-notes">
          {work.observations.map((note) => <Note key={note.label} note={note} sources={sources} />)}
        </ul>
      </Section>

      <Section id="people" title="Who made it">
        <ul className="p-credits">
          {work.credits.map((c) => (
            <li key={c.personSlug}>
              <Link to={`/people/${c.personSlug}`} className="p-credits__person">
                <Avatar name={c.name} size="sm" />
                <span>
                  <strong>{c.name}</strong>
                  <span>{c.roles.join(', ')}</span>
                </span>
              </Link>
              <FollowButton slug={c.personSlug} name={c.name} />
            </li>
          ))}
        </ul>
        <p className="p-fine">Credits: <Status status="verified" source={sources.wiki} /></p>
      </Section>

      <Section id="next" title="Where next">
        {work.connectionsResolved.length > 0 && (
          <div className="p-connections">
            {work.connectionsResolved.map((connection) => (
              <div key={connection.work.slug} className="p-connection">
                <SongCard work={connection.work} />
                <p>{connection.reason}</p>
                <Status status={connection.status} />
              </div>
            ))}
          </div>
        )}
        {work.compareSuggestions.length > 0 && (
          <div className="p-compare-links">
            <span>Put it side by side with</span>
            {work.compareSuggestions.map((other) => (
              <Link key={other.slug} className="p-pill" to={`/compare?a=${work.slug}&b=${other.slug}`}>{other.title}</Link>
            ))}
          </div>
        )}
        <QuestionBox work={work} />
      </Section>

      <footer className="p-sources">
        <h3 className="p-subhead">Sources</h3>
        <ol>
          {work.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
              <span> — {source.publisher}, checked {formatDate(source.accessed)}</span>
            </li>
          ))}
        </ol>
      </footer>
    </article>
  );
}
