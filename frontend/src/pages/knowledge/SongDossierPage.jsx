import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { featuredSong } from '../../data/knowledgePrototype';

const dossierSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'story', label: 'Story' },
  { id: 'sound', label: 'Sound' },
  { id: 'credits', label: 'Credits' },
  { id: 'connections', label: 'Connections' },
  { id: 'sources', label: 'Sources' },
];

const SongDossierPage = () => (
  <KnowledgeFrame
    className="dossier-page"
    eyebrow={featuredSong.eyebrow}
    title={featuredSong.title}
    description={featuredSong.statement}
    breadcrumbs={[{ label: 'Works', to: '/atlas' }, { label: featuredSong.title }]}
    heroAside={(
      <div className="dossier-cover" role="img" aria-label="Typographic prototype cover for Die Young">
        <span className="dossier-cover__index">M / 001</span>
        <strong>D / Y</strong>
        <span>{featuredSong.artist} · {featuredSong.year}</span>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#overview">Read the dossier</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/picks">Continue through a trail</Link>
      </>
    )}
  >
    <aside className="dossier-disclaimer">
      <ContentBadge status="prototype" />
      <p>{featuredSong.disclaimer}</p>
    </aside>

    <nav className="dossier-nav" aria-label="Song dossier sections">
      {dossierSections.map((section, index) => (
        <a href={`#${section.id}`} key={section.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {section.label}
        </a>
      ))}
    </nav>

    <article className="dossier-content">
      <section className="dossier-section dossier-overview" id="overview" aria-labelledby="dossier-overview-title">
        <header className="knowledge-section-heading">
          <div>
            <p className="knowledge-kicker">01 · Overview</p>
            <h2 id="dossier-overview-title">A work before it is a file.</h2>
          </div>
          <p>Fast coordinates are useful only when their source and certainty remain visible.</p>
        </header>

        <div className="dossier-facts">
          {featuredSong.quickFacts.map((fact) => (
            <div className="dossier-fact" key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
              <ContentBadge status={fact.status} compact />
            </div>
          ))}
        </div>

        <blockquote className="dossier-thesis">
          <span>Editorial thesis</span>
          <p>{featuredSong.thesis}</p>
          <ContentBadge status="editorial" compact />
        </blockquote>
      </section>

      <aside className="dossier-listen-slot" aria-labelledby="dossier-listen-title">
        <span className="dossier-listen-slot__mark" aria-hidden="true">↗</span>
        <div>
          <p className="knowledge-kicker">Listen at the source</p>
          <h2 id="dossier-listen-title">The knowledge lives here. The recording does not have to.</h2>
          <p>Verified artist, label or licensed destinations will appear here instead of copied audio.</p>
        </div>
        <div className="dossier-listen-slot__destination" aria-disabled="true">
          <ContentBadge status="awaiting" compact />
          <strong>External link pending</strong>
        </div>
      </aside>

      <section className="dossier-section dossier-story" id="story" aria-labelledby="dossier-story-title">
        <div className="dossier-story__number" aria-hidden="true">02</div>
        <div className="dossier-story__copy">
          <p className="knowledge-kicker">Story</p>
          <h2 id="dossier-story-title">What was happening around the song?</h2>
          <p>
            A Memphis story does not reduce a release to trivia. It places the work beside its
            creative process, circulation and cultural moment, then clearly marks where interpretation begins.
          </p>
          <Link to="/stories/pop-youth">Read: Pop, youth and the feeling of an endless night →</Link>
        </div>
        <aside className="dossier-story__question">
          <ContentBadge status="editorial" compact />
          <span>Question to carry</span>
          <strong>How can a production make three minutes feel like an endless night?</strong>
        </aside>
      </section>

      <section className="dossier-section dossier-sound" id="sound" aria-labelledby="dossier-sound-title">
        <header className="knowledge-section-heading">
          <div>
            <p className="knowledge-kicker">03 · Sound</p>
            <h2 id="dossier-sound-title">See the form. Then hear it differently.</h2>
          </div>
          <p>The timeline is a reading aid, not an embedded player.</p>
        </header>

        <div className="dossier-structure" role="img" aria-label="Prototype structure: intro, verse, pre-chorus, chorus, verse, bridge and final section">
          {featuredSong.structure.map((section, index) => (
            <div
              className={`dossier-structure__part is-${section.tone}`}
              style={{ '--section-width': `${section.width}%` }}
              key={`${section.part}-${index}`}
            >
              <span>{section.part}</span>
            </div>
          ))}
        </div>

        <div className="dossier-sound-notes">
          {featuredSong.soundNotes.map((note, index) => (
            <article key={note.title} className="dossier-sound-note">
              <span className="dossier-sound-note__number">{String(index + 1).padStart(2, '0')}</span>
              <ContentBadge status={note.status} compact />
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dossier-section dossier-credits" id="credits" aria-labelledby="dossier-credits-title">
        <header className="knowledge-section-heading">
          <div>
            <p className="knowledge-kicker">04 · Full credits</p>
            <h2 id="dossier-credits-title">Every name is another door.</h2>
          </div>
          <p>Roles stay explicit. Missing names stay visibly missing until a reliable source fills them.</p>
        </header>

        <div className="dossier-credit-list">
          {featuredSong.credits.map((credit, index) => {
            const hasPrototypePage = credit.slug === 'benny-blanco';
            const content = (
              <>
                <span className="dossier-credit__index">{String(index + 1).padStart(2, '0')}</span>
                <strong>{credit.name}</strong>
                <span>{credit.role}</span>
                <ContentBadge status={credit.status} compact />
                <i aria-hidden="true">{hasPrototypePage ? '↗' : 'Reserved'}</i>
              </>
            );

            return hasPrototypePage ? (
              <Link className="dossier-credit" to={`/people/${credit.slug}`} key={`${credit.name}-${credit.role}`}>
                {content}
              </Link>
            ) : (
              <div className="dossier-credit is-reserved" aria-disabled="true" key={`${credit.name}-${credit.role}`}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="dossier-section dossier-connections" id="connections" aria-labelledby="dossier-connections-title">
        <header className="knowledge-section-heading">
          <div>
            <p className="knowledge-kicker">05 · Connections</p>
            <h2 id="dossier-connections-title">Four reasons to keep going.</h2>
          </div>
          <p>The reason is part of the recommendation—not hidden behind an algorithm.</p>
        </header>

        <div className="dossier-connection-grid">
          {featuredSong.connections.map((connection) => (
            <Link className="dossier-connection" to={connection.to} key={connection.title}>
              <div>
                <span>{connection.kicker}</span>
                <ContentBadge status={connection.status} compact />
              </div>
              <h3>{connection.title}</h3>
              <p>{connection.reason}</p>
              <strong>Open connection ↗</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="dossier-section dossier-sources" id="sources" aria-labelledby="dossier-sources-title">
        <header className="knowledge-section-heading">
          <div>
            <p className="knowledge-kicker">06 · Source ledger</p>
            <h2 id="dossier-sources-title">The page shows what it still owes.</h2>
          </div>
          <Link to="/sources">Open the public source ledger →</Link>
        </header>

        <ol className="dossier-source-list">
          {featuredSong.sources.map((source, index) => (
            <li key={source.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{source.title}</h3>
                <p>{source.note}</p>
              </div>
              <ContentBadge status={source.status} compact />
            </li>
          ))}
        </ol>
      </section>
    </article>

    <aside className="knowledge-next-step">
      <div>
        <p className="knowledge-kicker">Next route</p>
        <h2>Follow the credit, not the chart.</h2>
        <p>See how a collaborator connects works, techniques and creative eras.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/people/benny-blanco">
        Open Benny Blanco's map
      </Link>
    </aside>
  </KnowledgeFrame>
);

export default SongDossierPage;
