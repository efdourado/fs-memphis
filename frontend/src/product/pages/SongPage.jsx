import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, errorMessage } from '../api';
import { formatDate, usePageTitle, useResource, yearOf } from '../hooks';
import AttentionChart from '../components/AttentionChart';
import Cover from '../components/Cover';
import { FollowButton, SaveButton } from '../components/LibraryButtons';
import SongRow from '../components/SongRow';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';
import { ArrowIcon } from '../shell/Icons';

const SECTIONS = [
  { id: 'change', label: 'What changed' },
  { id: 'explain', label: 'Why' },
  { id: 'hear', label: 'Listen for' },
  { id: 'connect', label: 'Connections' },
  { id: 'next', label: 'Next' },
];

const EVENT_KINDS = {
  release: 'Release',
  chart: 'Chart',
  screen: 'Screen',
  social: 'Social',
  award: 'Award',
  performance: 'Live',
  news: 'News',
};

function Section({ id, number, title, intro, children }) {
  return (
    <section id={id} className="m-section" aria-labelledby={`${id}-title`}>
      <header className="m-section__header">
        <span className="m-section__number">{number}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      {children}
    </section>
  );
}

function Note({ note, sources }) {
  return (
    <li className="m-note">
      <div className="m-note__head">
        <strong>{note.label}</strong>
        <Status status={note.status} source={sources[note.sourceId]} />
      </div>
      <p>{note.body}</p>
    </li>
  );
}

function QuestionForm({ work }) {
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
    <form className="m-question" onSubmit={submit}>
      <label htmlFor="question">Keep a question about this song</label>
      <textarea
        id="question"
        rows={3}
        maxLength={280}
        placeholder={work.question || 'What do you want to understand next?'}
        value={text}
        onChange={(event) => { setText(event.target.value); setState((s) => ({ ...s, saved: false })); }}
      />
      <div className="m-question__footer">
        <span className="m-muted" aria-live="polite">
          {state.error || (state.saved ? <>Saved to <Link to="/you">your questions</Link>.</> : `${280 - text.length} characters left`)}
        </span>
        <button type="submit" className="m-button m-button--primary" disabled={state.saving || (isAuthenticated && !text.trim())}>
          {isAuthenticated ? 'Save question' : 'Sign in to save'}
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
    if (!work || !hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [work, hash]);

  if (loading) return <Loading label="Opening the song" />;
  if (error) return <ErrorState message={error} onRetry={reload} notFound={status === 404} />;

  const sources = Object.fromEntries(work.sources.map((s) => [s.id, s]));
  const { reading } = work;
  const firstConnection = work.connectionsResolved[0];

  return (
    <article className="m-page m-song">
      <header className="m-song__header">
        <Cover slug={work.slug} title={work.title} size="lg" />
        <div className="m-song__heading">
          <h1 className="m-display">{work.title}</h1>
          <p className="m-song__meta">
            {work.artistSlugs[0] ? <Link to={`/people/${work.artistSlugs[0]}`}>{work.artist}</Link> : work.artist}
            <span aria-hidden="true"> · </span>{yearOf(work.released)}
            {work.album && <><span aria-hidden="true"> · </span>{work.album}</>}
          </p>
        </div>
        <p className="m-lede">{work.summary}</p>
        {work.question && (
          <p className="m-carry"><span>Question to carry</span>{work.question}</p>
        )}
        <div className="m-actions">
          <SaveButton slug={work.slug} />
          {work.compareSuggestions[0] && (
            <Link className="m-button" to={`/compare?a=${work.slug}&b=${work.compareSuggestions[0].slug}`}>Compare</Link>
          )}
          <details className="m-listen">
            <summary className="m-button">Listen</summary>
            <ul>
              {work.listen.map((link) => (
                <li key={link.service}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    Search on {link.service} <ArrowIcon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </header>

      <nav className="m-sections" aria-label="On this page">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>{section.label}</a>
        ))}
      </nav>

      <Section
        id="change"
        number="1"
        title="What changed?"
        intro="How attention to this recording moved over time, and what kind of pattern that is."
      >
        <div className="m-panel">
          <div className="m-panel__head">
            <span className="m-muted">{work.attention.metric}</span>
            <Status status={work.attention.status} />
          </div>
          <AttentionChart
            points={work.attention.points}
            events={work.events}
            label={`${work.attention.metric}. ${reading.label}. ${reading.explanation}`}
          />
          <div className="m-reading">
            <div className="m-reading__head">
              <strong>{reading.label}</strong>
              <Status status="computed" />
            </div>
            <p>{reading.explanation}</p>
            <p className="m-small m-muted">
              Read from the curve above, so it describes the demo data, not real listening.
              {' '}<Link to="/about#method">How this is calculated</Link>
            </p>
          </div>
          <p className="m-small m-muted">{work.attention.note}</p>
        </div>
        {work.facts.length > 0 && (
          <ul className="m-notes">
            {work.facts.map((fact) => <Note key={fact.label} note={fact} sources={sources} />)}
          </ul>
        )}
      </Section>

      <Section
        id="explain"
        number="2"
        title="What might explain it?"
        intro="Documented moments placed beside the timeline. Timing suggests a possible connection, not proof of cause."
      >
        <ol className="m-timeline">
          {work.events.map((event, index) => (
            <li key={`${event.date}-${event.title}`} className="m-timeline__item">
              <span className="m-timeline__pin">{index + 1}</span>
              <div>
                <p className="m-timeline__meta">
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                  <span aria-hidden="true"> · </span>{EVENT_KINDS[event.kind]}
                </p>
                <h3>{event.title}</h3>
                {event.body && <p>{event.body}</p>}
                <Status status={event.status} source={sources[event.sourceId]} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="hear" number="3" title="What can I hear?" intro="A short guide to try on your next listen, then what is documented about the sound.">
        <ol className="m-guide">
          {work.guide.map((step, index) => (
            <li key={step.label}>
              <span className="m-guide__step">{index + 1}</span>
              <div>
                <strong>{step.label}</strong>
                <p>{step.body}</p>
                <Status status={step.status} source={sources[step.sourceId]} />
              </div>
            </li>
          ))}
        </ol>
        <h3 className="m-subhead">About the sound</h3>
        <ul className="m-notes">
          {work.observations.map((note) => <Note key={note.label} note={note} sources={sources} />)}
        </ul>
      </Section>

      <Section id="connect" number="4" title="What connects?" intro="Who made it, and where else their work or this sound leads.">
        <h3 className="m-subhead">Credits</h3>
        <ul className="m-credits">
          {work.credits.map((c) => (
            <li key={c.personSlug}>
              <Link to={`/people/${c.personSlug}`} className="m-credits__name">{c.name}</Link>
              <span className="m-muted">{c.roles.join(', ')}</span>
              <FollowButton slug={c.personSlug} name={c.name} />
            </li>
          ))}
        </ul>
        <p className="m-small"><Status status="verified" source={sources.wiki} /></p>

        {work.connectionsResolved.length > 0 && (
          <>
            <h3 className="m-subhead">Connected songs</h3>
            <ul className="m-list">
              {work.connectionsResolved.map((connection) => (
                <SongRow key={connection.work.slug} work={connection.work} note={connection.reason}>
                  <Status status={connection.status} />
                </SongRow>
              ))}
            </ul>
          </>
        )}
      </Section>

      <Section id="next" number="5" title="What next?">
        <div className="m-next">
          {work.compareSuggestions.length > 0 && (
            <div className="m-next__block">
              <h3>Compare</h3>
              <ul className="m-link-list">
                {work.compareSuggestions.map((other) => (
                  <li key={other.slug}>
                    <Link to={`/compare?a=${work.slug}&b=${other.slug}`}>
                      With {other.title} <span className="m-muted">· {other.artist}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {firstConnection && (
            <div className="m-next__block">
              <h3>Keep exploring</h3>
              <p className="m-muted">{firstConnection.reason}</p>
              <Link className="m-button" to={`/songs/${firstConnection.work.slug}`}>Open {firstConnection.work.title}</Link>
            </div>
          )}
          <div className="m-next__block m-next__block--wide">
            <QuestionForm work={work} />
          </div>
        </div>
      </Section>

      <footer className="m-sources" id="sources">
        <h2 className="m-subhead">Sources</h2>
        <ol>
          {work.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
              <span className="m-muted"> · {source.publisher}, reviewed {formatDate(source.accessed)}</span>
            </li>
          ))}
        </ol>
        <p className="m-small m-muted">
          Found something wrong or missing? Memphis keeps gaps visible rather than filling them. <Link to="/about">How Memphis labels claims</Link>
        </p>
      </footer>
    </article>
  );
}
