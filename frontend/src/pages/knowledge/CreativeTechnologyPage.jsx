import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { technologyPrototype } from '../../data/knowledgePrototype';

const CreativeTechnologyPage = () => (
  <KnowledgeFrame
    className="knowledge-technology-page"
    eyebrow="Creative technology · provenance workspace"
    title={technologyPrototype.title}
    description={technologyPrototype.intro}
    breadcrumbs={[{ label: 'Technology', to: '/atlas' }, { label: 'AI & authorship' }]}
    heroAside={(
      <div className="technology-signal" role="img" aria-label="Human decisions moving through creative tools">
        <span className="technology-signal__human">Human</span>
        <i aria-hidden="true">+</i>
        <span className="technology-signal__tool">Tool</span>
        <i aria-hidden="true">→</i>
        <strong>Work</strong>
        <small>Process before verdict</small>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#technology-tools">Inspect the framework</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/atlas/song/die-young#sound">See it inside a dossier</Link>
      </>
    )}
  >
    <aside className="technology-principle">
      <ContentBadge status="editorial" />
      <div>
        <p className="knowledge-kicker">The starting position</p>
        <h2>A tool does not answer the authorship question by itself.</h2>
      </div>
      <p>Memphis documents people, sources, transformations and decisions. It does not guess a process by looking at the finished work.</p>
    </aside>

    <section className="technology-questions" aria-labelledby="technology-questions-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Questions before classification</p>
          <h2 id="technology-questions-title">Ask what happened in the process.</h2>
        </div>
        <ContentBadge status="editorial" />
      </header>
      <ol>
        {technologyPrototype.questions.map((question, index) => (
          <li key={question}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{question}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="technology-tools" id="technology-tools" aria-labelledby="technology-tools-title">
      <header>
        <p className="knowledge-kicker">Tool spectrum</p>
        <h2 id="technology-tools-title">Different systems. The same need for clear credits.</h2>
        <p>These groups organize documentation; they do not rank artistic legitimacy.</p>
      </header>

      <div className="technology-tool-grid">
        {technologyPrototype.toolGroups.map((group, index) => (
          <article key={group.title}>
            <span className="technology-tool__index">0{index + 1}</span>
            <ContentBadge status="editorial" compact />
            <h3>{group.title}</h3>
            <p>{group.body}</p>
            <div>
              <span>Documentation signal</span>
              <strong>{group.signal}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="technology-provenance" aria-labelledby="technology-provenance-title">
      <header>
        <ContentBadge status="prototype" />
        <p className="knowledge-kicker">Provenance chain</p>
        <h2 id="technology-provenance-title">A visible route from source to work.</h2>
      </header>

      <ol className="technology-provenance__rail">
        {technologyPrototype.provenance.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
            {index < technologyPrototype.provenance.length - 1 && <i aria-hidden="true">→</i>}
          </li>
        ))}
      </ol>
    </section>

    <section className="technology-case" aria-labelledby="technology-case-title">
      <div className="technology-case__visual" aria-hidden="true">
        <span>INPUT</span>
        <span>EDIT</span>
        <span>SELECT</span>
        <strong>?</strong>
      </div>
      <div className="technology-case__copy">
        <ContentBadge status="awaiting" />
        <p className="knowledge-kicker">Future case study</p>
        <h2 id="technology-case-title">The empty state is part of the ethics.</h2>
        <p>A case will appear here only when creator statements, tool information and rights context can support it. Memphis will not label a work as AI-made from an aesthetic guess.</p>
        <Link to="/sources">Open the public source ledger →</Link>
      </div>
    </section>

    <section className="technology-rules" aria-labelledby="technology-rules-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Memphis rules</p>
          <h2 id="technology-rules-title">How this space protects nuance.</h2>
        </div>
      </header>
      <div>
        <article><span>01</span><h3>No detection theater.</h3><p>No confident origin labels without declared or verifiable evidence.</p></article>
        <article><span>02</span><h3>No tool hierarchy.</h3><p>Physical, digital and generative systems still require decisions worth documenting.</p></article>
        <article><span>03</span><h3>No erased labor.</h3><p>Performers, engineers, editors, data sources and rights holders belong in the account.</p></article>
        <article><span>04</span><h3>No final verdict.</h3><p>Readers see sources and can understand where uncertainty remains.</p></article>
      </div>
    </section>

    <aside className="knowledge-next-step">
      <div>
        <p className="knowledge-kicker">Return to the work</p>
        <h2>Apply the framework inside a song dossier.</h2>
        <p>Sound, tools and credits become one navigable creative process.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/atlas/song/die-young#sound">Open sound & process</Link>
    </aside>
  </KnowledgeFrame>
);

export default CreativeTechnologyPage;
