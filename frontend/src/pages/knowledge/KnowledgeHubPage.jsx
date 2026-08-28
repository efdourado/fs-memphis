import { Link } from 'react-router-dom';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import ContentBadge from '../../components/knowledge/ContentBadge';
import { knowledgePillars } from '../../data/knowledgePrototype';

const journey = [
  { number: '01', label: 'Work', to: '/atlas/song/die-young' },
  { number: '02', label: 'Sound', to: '/atlas/song/die-young#sound' },
  { number: '03', label: 'Credit', to: '/atlas/song/die-young#credits' },
  { number: '04', label: 'Person', to: '/people/benny-blanco' },
  { number: '05', label: 'Context', to: '/stories/pop-youth' },
  { number: '06', label: 'Discovery', to: '/picks' },
];

const KnowledgeHubPage = () => (
  <KnowledgeFrame
    className="atlas-page"
    eyebrow="Memphis · second movement"
    title={<>Music is bigger<br />than playback.</>}
    description="An editorial atlas for understanding works, creative people, context and the connections that make listening richer."
    heroAside={(
      <div className="atlas-orbit" role="img" aria-label="Works connect to people, context and discovery">
        <span className="atlas-orbit__core">Listen</span>
        <span className="atlas-orbit__node atlas-orbit__node--work">Work</span>
        <span className="atlas-orbit__node atlas-orbit__node--people">People</span>
        <span className="atlas-orbit__node atlas-orbit__node--context">Context</span>
        <span className="atlas-orbit__node atlas-orbit__node--discover">Discover</span>
      </div>
    )}
    heroActions={(
      <>
        <Link className="knowledge-button knowledge-button--primary" to="/atlas/song/die-young">
          Open the song dossier
        </Link>
        <Link className="knowledge-button knowledge-button--quiet" to="/picks">
          Follow a curated trail
        </Link>
      </>
    )}
  >
    <section className="atlas-manifesto" aria-labelledby="atlas-manifesto-title">
      <div>
        <ContentBadge status="editorial" />
        <p className="knowledge-kicker">The new promise</p>
      </div>
      <h2 id="atlas-manifesto-title">Turn passive listening into active discovery.</h2>
      <p>
        Memphis does not need to host a song to help someone hear more inside it.
        The product lives in the credits, questions, context and routes between ideas.
      </p>
    </section>

    <section className="atlas-section" aria-labelledby="atlas-pillars-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Four entrances</p>
          <h2 id="atlas-pillars-title">Start with what makes you curious.</h2>
        </div>
        <p>No ranking. No opaque feed. Every path explains why it is here.</p>
      </header>

      <div className="atlas-pillar-grid">
        {knowledgePillars.map((pillar) => (
          <Link
            className={`atlas-pillar atlas-pillar--${pillar.accent}`}
            to={pillar.to}
            key={pillar.number}
          >
            <span className="atlas-pillar__number">{pillar.number}</span>
            <div>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </div>
            <span className="atlas-pillar__arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>

    <section className="atlas-journey" aria-labelledby="atlas-journey-title">
      <header>
        <ContentBadge status="prototype" />
        <p className="knowledge-kicker">One continuous flow</p>
        <h2 id="atlas-journey-title">One song can open an entire map.</h2>
      </header>
      <div className="atlas-journey__rail">
        {journey.map((item, index) => (
          <Link to={item.to} key={item.number} className="atlas-journey__stop">
            <span>{item.number}</span>
            <strong>{item.label}</strong>
            {index < journey.length - 1 && <i aria-hidden="true">→</i>}
          </Link>
        ))}
      </div>
    </section>

    <section className="atlas-feature-grid" aria-label="More ways to explore Memphis">
      <Link className="atlas-feature atlas-feature--story" to="/stories/pop-youth">
        <ContentBadge status="editorial" compact />
        <p className="knowledge-kicker">Long-form story</p>
        <h2>Pop, youth and the feeling of an endless night</h2>
        <span>Read the cultural question →</span>
      </Link>

      <Link className="atlas-feature atlas-feature--comparison" to="/comparisons/breakthrough">
        <ContentBadge status="editorial" compact />
        <p className="knowledge-kicker">Comparison lab</p>
        <h2>Why does one act break through?</h2>
        <span>Compare without inventing one cause →</span>
      </Link>

      <Link className="atlas-feature atlas-feature--technology" to="/technology/ai-and-art">
        <ContentBadge status="prototype" compact />
        <p className="knowledge-kicker">Creative technology</p>
        <h2>Where does the tool end and authorship begin?</h2>
        <span>Inspect the process →</span>
      </Link>

      <Link className="atlas-feature atlas-feature--personal" to="/today">
        <ContentBadge status="prototype" compact />
        <p className="knowledge-kicker">My Memphis</p>
        <h2>A listening map you control.</h2>
        <span>Open your private space →</span>
      </Link>
    </section>

    <section className="atlas-personal-space" aria-labelledby="atlas-personal-title">
      <header className="knowledge-section-heading">
        <div>
          <ContentBadge status="prototype" />
          <p className="knowledge-kicker">My Memphis · private by default</p>
          <h2 id="atlas-personal-title">A listening map you can understand and correct.</h2>
        </div>
        <p>Descriptive patterns only—never a personality, diagnosis or psychological profile.</p>
      </header>

      <div className="atlas-personal-space__grid">
        <Link className="atlas-personal-card" to="/today">
          <span>01 / Today</span>
          <h3>Begin with your own words.</h3>
          <p>Record a listening moment and the context you choose to share.</p>
          <strong>Open Today ↗</strong>
        </Link>
        <Link className="atlas-personal-card" to="/journal">
          <span>02 / Journal</span>
          <h3>Keep a musical memory.</h3>
          <p>Your notes add meaning that play counts cannot infer.</p>
          <strong>Open Journal ↗</strong>
        </Link>
        <Link className="atlas-personal-card" to="/patterns">
          <span>03 / Patterns</span>
          <h3>See descriptive tendencies.</h3>
          <p>Genres, times and revisits remain transparent and editable.</p>
          <strong>Open Patterns ↗</strong>
        </Link>
        <article className="atlas-personal-card atlas-personal-card--disabled" aria-disabled="true">
          <div>
            <span>04 / Musical proximity</span>
            <ContentBadge status="prototype" compact />
          </div>
          <h3>Compare paths with a friend.</h3>
          <p>Future mutual opt-in only. It can describe shared musical references, never emotions, personality or compatibility.</p>
          <strong>Not active · privacy design pending</strong>
        </article>
      </div>
    </section>

    <aside className="atlas-archive-callout">
      <div>
        <p className="knowledge-kicker">Built by hand. Kept with pride.</p>
        <h2>The first Memphis interface remains part of the story.</h2>
        <p>Albums, artists, music cards, Bias and every visual experiment stay available as a design archive.</p>
      </div>
      <Link className="knowledge-button knowledge-button--quiet" to="/design-archive">
        Explore the design archive
      </Link>
    </aside>
  </KnowledgeFrame>
);

export default KnowledgeHubPage;
