import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { genrePrototype } from '../../data/knowledgePrototype';

const GenreDetailPage = () => (
  <KnowledgeFrame
    className="knowledge-genre-page"
    eyebrow="Genre atlas · an open boundary"
    title={genrePrototype.title}
    description={genrePrototype.subtitle}
    breadcrumbs={[{ label: 'Genres', to: '/atlas' }, { label: genrePrototype.title }]}
    heroAside={(
      <div className="genre-coordinate-mark" role="img" aria-label="Abstract coordinate map for Pop">
        <span className="genre-coordinate-mark__axis genre-coordinate-mark__axis--x" aria-hidden="true" />
        <span className="genre-coordinate-mark__axis genre-coordinate-mark__axis--y" aria-hidden="true" />
        <span className="genre-coordinate-mark__point genre-coordinate-mark__point--one">Mass</span>
        <span className="genre-coordinate-mark__point genre-coordinate-mark__point--two">Niche</span>
        <span className="genre-coordinate-mark__point genre-coordinate-mark__point--three">Craft</span>
        <strong>POP</strong>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#genre-paths">Map the borders</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/stories/pop-youth">Read a cultural story</Link>
      </>
    )}
  >
    <aside className="genre-principle">
      <ContentBadge status="editorial" />
      <p><strong>A genre is a route, not a box.</strong> It can describe history, community, industry language and shared musical features at the same time.</p>
    </aside>

    <section className="genre-coordinates" aria-labelledby="genre-coordinates-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Working coordinates</p>
          <h2 id="genre-coordinates-title">Four ways to enter the conversation.</h2>
        </div>
        <p>These coordinates are editorial orientation, not universal definitions.</p>
      </header>

      <div className="genre-coordinate-grid">
        {genrePrototype.coordinates.map((coordinate, index) => (
          <article key={coordinate.label}>
            <span>{String(index + 1).padStart(2, '0')} / {coordinate.label}</span>
            <h3>{coordinate.value}</h3>
            <ContentBadge status="editorial" compact />
          </article>
        ))}
      </div>
    </section>

    <section className="genre-paths" id="genre-paths" aria-labelledby="genre-paths-title">
      <header>
        <p className="knowledge-kicker">Border map</p>
        <h2 id="genre-paths-title">Move by a shared idea.</h2>
        <p>Every bridge says what connects the two places, so discovery never feels random.</p>
      </header>

      <div className="genre-path-list">
        {genrePrototype.paths.map((path, index) => (
          <div className="genre-path" key={`${path.from}-${path.to}`}>
            <span className="genre-path__index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{path.from}</strong>
            <div className="genre-path__bridge">
              <span aria-hidden="true" />
              <small>{path.bridge}</small>
              <span aria-hidden="true" />
            </div>
            <strong>{path.to}</strong>
            <ContentBadge status="editorial" compact />
          </div>
        ))}
      </div>
    </section>

    <section className="genre-distinction" aria-labelledby="genre-distinction-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Language matters</p>
          <h2 id="genre-distinction-title">Related words can answer different questions.</h2>
        </div>
        <ContentBadge status="editorial" />
      </header>

      <div className="genre-distinction__grid">
        {genrePrototype.distinctions.map((item) => (
          <article key={item.term}>
            <span>{item.kind}</span>
            <h3>{item.term}</h3>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
      <p className="genre-distinction__note">
        “Classical” and “instrumental” are not interchangeable: one can point to a historical field while the other usually describes how a work is performed.
      </p>
    </section>

    <section className="genre-questions" aria-labelledby="genre-questions-title">
      <header>
        <p className="knowledge-kicker">Questions, not commandments</p>
        <h2 id="genre-questions-title">What should we ask next?</h2>
      </header>
      <ol>
        {genrePrototype.questions.map((question, index) => (
          <li key={question}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{question}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="genre-entry-grid" aria-label="Explore Pop from different entry points">
      <Link to="/atlas/song/die-young" className="genre-entry-card">
        <span>Work</span>
        <h3>See one pop song from the inside.</h3>
        <p>Structure, credits, sound and sources.</p>
        <strong>Open the dossier ↗</strong>
      </Link>
      <Link to="/stories/pop-youth" className="genre-entry-card">
        <span>Context</span>
        <h3>Place the sound beside its cultural moment.</h3>
        <p>A long-form editorial reading.</p>
        <strong>Read the story ↗</strong>
      </Link>
      <Link to="/picks" className="genre-entry-card">
        <span>Discovery</span>
        <h3>Move beyond the familiar label.</h3>
        <p>A route into adjacent scenes.</p>
        <strong>Follow the trail ↗</strong>
      </Link>
    </section>
  </KnowledgeFrame>
);

export default GenreDetailPage;
