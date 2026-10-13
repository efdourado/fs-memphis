import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api';
import { formatDate, usePageTitle, useResource, yearOf } from '../hooks';
import Cover, { Face } from '../components/Cover';
import { FollowButton, SaveButton } from '../components/LibraryButtons';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';
import { SongTile } from '../components/Tiles';

const CELL_WORDS = ['silent', 'quiet', 'playing', 'somewhere'];

function Block({ id, title, aside, children }) {
  return (
    <section id={id} className="p-block" aria-labelledby={`${id}-title`}>
      <header>
        <h2 id={`${id}-title`} className="p-md">{title}</h2>
        {aside}
      </header>
      {children}
    </section>
  );
}

// Which tag describes a whole block: the one all its lines share, if they do.
const sharedStatus = (items) => {
  const statuses = new Set(items.map((item) => item.status));
  return statuses.size === 1 ? [...statuses][0] : null;
};

function Steps({ items, sources }) {
  const common = sharedStatus(items);
  return (
    <ol className="p-steps">
      {items.map((item, index) => (
        <li key={item.label}>
          <span className="p-num">{index + 1}</span>
          <div>
            <h5>{item.label}</h5>
            <p>{item.body}</p>
            {!common && <Status status={item.status} source={sources[item.sourceId]} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ArrangementMap({ map, title }) {
  const summary = map.layers
    .map((layer) => `${layer.name}: ${layer.cells.map((cell, i) => (cell ? `${map.sections[i]} ${CELL_WORDS[cell]}` : null)).filter(Boolean).join(', ') || 'silent'}`)
    .join('. ');
  const unknown = map.layers.some((layer) => layer.cells.includes(3));
  return (
    <div className="p-mapbox">
      <div className="p-mapscroll">
        <div className="p-map" style={{ '--cols': map.sections.length }} role="img" aria-label={`What plays when in ${title}. ${summary}`}>
          <span />
          {map.sections.map((section, index) => <span key={`${section}-${index}`} className="p-map__head">{section}</span>)}
          {map.layers.map((layer) => (
            [
              <span key={layer.name} className="p-map__name"><i className={`is-${layer.status}`} />{layer.name}</span>,
              ...layer.cells.map((cell, index) => <span key={`${layer.name}-${index}`} className={`p-cell p-cell--${cell}`} />),
            ]
          ))}
        </div>
      </div>
      <div className="p-legend">
        <span><span className="p-cell p-cell--2" />playing</span>
        <span><span className="p-cell p-cell--1" />quiet</span>
        {unknown && <span><span className="p-cell p-cell--3" />on the record, placement not documented</span>}
        <Status status="verified" label="instrument is documented" />
        <Status status="editorial" label="placed by ear" />
      </div>
    </div>
  );
}

function Lines({ items, sources }) {
  return (
    <ul className="p-list">
      {items.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <div>
            <span>{item.body}</span>
            <Status status={item.status} source={sources[item.sourceId]} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function People({ credits }) {
  return (
    <ul className="p-people">
      {credits.map((c) => (
        <li key={c.personSlug}>
          <Link to={`/people/${c.personSlug}`}>
            <Face variant="face" />
            <span>
              <span>{c.name}</span>
              <span>{c.roles.join(', ')}</span>
            </span>
          </Link>
          <FollowButton slug={c.personSlug} name={c.name} />
        </li>
      ))}
    </ul>
  );
}

function ListenMenu({ links }) {
  return (
    <details className="p-listen">
      <summary className="p-btn">Listen</summary>
      <ul>
        {links.map((link) => (
          <li key={link.service}><a href={link.url} target="_blank" rel="noreferrer">Find it on {link.service}</a></li>
        ))}
      </ul>
    </details>
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
  const full = work.depth === 'full';
  const compareWith = work.compareSuggestions[0];
  const artistSlug = work.artistSlugs[0];

  return (
    <article className="p-page p-page--read p-song">
      <header className="p-songtop">
        <Cover slug={work.slug} title={work.title} />
        <div className="p-stack">
          <p className="p-muted">
            {artistSlug ? <Link to={`/people/${artistSlug}`} className="p-link">{work.artist}</Link> : work.artist}
            {' · '}{yearOf(work.released)}{work.album && ` · ${work.album}`}
          </p>
          <h1 className="p-xl">{work.title}</h1>
          <p className="p-stand">{work.idea || work.summary}</p>
          <div className="p-btns">
            <SaveButton slug={work.slug} />
            <ListenMenu links={work.listen} />
            {compareWith && <Link className="p-btn" to={`/compare?a=${work.slug}&b=${compareWith.slug}`}>Compare</Link>}
          </div>
        </div>
      </header>

      {full && (
        <dl className="p-figs">
          {work.figures.map((figure) => (
            <div key={figure.label}><dt>{figure.label}</dt><dd>{figure.value}</dd></div>
          ))}
        </dl>
      )}

      {!full && (
        <p className="p-notice">
          This page is still short. The making-of, the map and the things to try are being researched.
          <Link to="/songs/dreams" className="p-link">See a finished page: Dreams</Link>
        </p>
      )}

      {full && (
        <>
          <Block id="made" title="How it was made" aside={sharedStatus(work.making) && <Status status={sharedStatus(work.making)} source={sources.wiki} />}>
            <Steps items={work.making} sources={sources} />
            {work.glossary.length > 0 && (
              <div className="p-gloss">
                <p className="p-mono">plain words</p>
                <dl>
                  {work.glossary.map((entry) => (
                    <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.body}</dd></div>
                  ))}
                </dl>
              </div>
            )}
          </Block>

          <Block id="map" title="What plays when" aside={<Status status="editorial" label="Map by ear · our take" />}>
            <p className="p-small" style={{ maxWidth: '40rem' }}>Read it left to right while the song plays. {work.map.note}</p>
            <ArrangementMap map={work.map} title={work.title} />
            <Lines items={work.moments} sources={sources} />
          </Block>

          <Block id="why" title="Why it works" aside={<Status status="editorial" />}>
            <div className="p-prose">{work.why.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </Block>

          <Block id="try" title="Try it" aside={<Status status="editorial" label="For your own music" />}>
            <ol className="p-try">
              {work.tryIt.map((item, index) => (
                <li key={item.title}>
                  <span className="p-num">{index + 1}</span>
                  <div><h5>{item.title}</h5><p>{item.body}</p></div>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="versions" title="Versions">
            <Lines items={work.versions} sources={sources} />
          </Block>
        </>
      )}

      {!full && (
        <>
          {work.events.length > 0 && (
            <Block id="story" title="What happened">
              <ul className="p-list">
                {work.events.map((event) => (
                  <li key={`${event.date}-${event.title}`}>
                    <span>{formatDate(event.date)}</span>
                    <div>
                      <span style={{ color: 'var(--ink)' }}>{event.title}</span>
                      {event.body && <span>{event.body}</span>}
                      <Status status={event.status} source={sources[event.sourceId]} />
                    </div>
                  </li>
                ))}
              </ul>
            </Block>
          )}
          <Block id="listen" title="Listen for">
            <Lines items={[...work.guide, ...work.observations]} sources={sources} />
          </Block>
        </>
      )}

      <Block id="people" title="Who made it" aside={<Status status="verified" source={sources.wiki} />}>
        <People credits={work.credits} />
        {work.recorded && <p className="p-small">{work.recorded}</p>}
      </Block>

      {work.connectionsResolved.length > 0 && (
        <Block id="next" title="Hear the same idea elsewhere">
          <div className="p-shelf">
            {work.connectionsResolved.map((connection) => (
              <SongTile key={connection.work.slug} work={connection.work} note={connection.reason} big />
            ))}
          </div>
        </Block>
      )}

      <footer className="p-sources">
        {work.sources.map((source) => (
          <p key={source.id} className="p-mono">
            <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>, {source.publisher}, checked {formatDate(source.accessed)}
          </p>
        ))}
      </footer>
    </article>
  );
}
