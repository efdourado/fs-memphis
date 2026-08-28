import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { personPrototype } from '../../data/knowledgePrototype';

const PersonDetailPage = () => (
  <KnowledgeFrame
    className="knowledge-person-page"
    eyebrow="People · credit map"
    title={personPrototype.name}
    description={personPrototype.intro}
    breadcrumbs={[{ label: 'People', to: '/atlas' }, { label: personPrototype.name }]}
    heroAside={(
      <div className="person-monogram" role="img" aria-label="Typographic portrait for Benny Blanco">
        <span className="person-monogram__index">PERSON / 001</span>
        <strong>BB</strong>
        <span>{personPrototype.role}</span>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#career-map">Explore the credit map</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/atlas/song/die-young">Back to the work</Link>
      </>
    )}
  >
    <section className="person-stats" aria-label="Prototype career map statistics">
      {personPrototype.stats.map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          <ContentBadge status="prototype" compact />
        </div>
      ))}
    </section>

    <section className="person-role-section" aria-labelledby="person-roles-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Roles, not celebrity</p>
          <h2 id="person-roles-title">A career changes shape from credit to credit.</h2>
        </div>
        <p>Memphis treats every role as a navigable contribution—not a footnote below the artist name.</p>
      </header>

      <div className="person-role-cloud">
        {personPrototype.roles.map((role, index) => (
          <span className={`person-role person-role--${index + 1}`} key={role}>{role}</span>
        ))}
      </div>
    </section>

    <section className="person-career-map" id="career-map" aria-labelledby="person-career-title">
      <header>
        <ContentBadge status="editorial" />
        <p className="knowledge-kicker">Career map</p>
        <h2 id="person-career-title">Creative eras, connected by choices.</h2>
      </header>

      <ol className="person-timeline">
        {personPrototype.timeline.map((era, index) => (
          <li key={era.year}>
            <span className="person-timeline__marker">{String(index + 1).padStart(2, '0')}</span>
            <div className="person-timeline__year">{era.year}</div>
            <div className="person-timeline__copy">
              <h3>{era.title}</h3>
              <p>{era.body}</p>
            </div>
            <ContentBadge status="editorial" compact />
          </li>
        ))}
      </ol>
    </section>

    <section className="person-network" id="collaboration-map" aria-labelledby="person-network-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Collaboration network</p>
          <h2 id="person-network-title">Credits reveal the creative neighborhood.</h2>
        </div>
        <ContentBadge status="prototype" />
      </header>

      <div className="person-network__canvas" role="group" aria-labelledby="person-network-title">
        <span className="person-network__line person-network__line--one" aria-hidden="true" />
        <span className="person-network__line person-network__line--two" aria-hidden="true" />
        <span className="person-network__line person-network__line--three" aria-hidden="true" />
        <div className="person-network__node person-network__node--center">
          <strong>BB</strong>
          <span>5 roles</span>
        </div>
        <Link className="person-network__node person-network__node--work" to="/atlas/song/die-young">
          <span>Work</span>
          <strong>Die Young</strong>
        </Link>
        <Link className="person-network__node person-network__node--context" to="/stories/pop-youth">
          <span>Context</span>
          <strong>Pop / youth</strong>
        </Link>
        <Link className="person-network__node person-network__node--method" to="/technology/ai-and-art">
          <span>Method</span>
          <strong>Tools + authorship</strong>
        </Link>
        <div className="person-network__node person-network__node--pending">
          <span>Next credit</span>
          <strong>Sources pending</strong>
        </div>
      </div>

      <p className="person-network__methodology">
        <strong>Method:</strong> connections will be computed only from verified credits. Popularity and assumed friendships are not relationship data.
      </p>
    </section>

    <section className="person-work-section" aria-labelledby="person-work-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Selected doors</p>
          <h2 id="person-work-title">Continue through the body of work.</h2>
        </div>
        <p>Each card tells you why it belongs here.</p>
      </header>

      <div className="person-work-grid">
        {personPrototype.works.map((work, index) => (
          <Link className="person-work-card" to={work.to} key={`${work.title}-${index}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <ContentBadge status={index === 1 ? 'awaiting' : 'prototype'} compact />
            <h3>{work.title}</h3>
            <p>{work.artist}</p>
            <strong>{work.reason} ↗</strong>
          </Link>
        ))}
      </div>
    </section>

    <aside className="knowledge-next-step">
      <div>
        <p className="knowledge-kicker">Next route</p>
        <h2>Leave one catalog through a shared technique.</h2>
        <p>Memphis Picks builds a path from familiar work toward an adjacent scene.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/picks">Follow the trail</Link>
    </aside>
  </KnowledgeFrame>
);

export default PersonDetailPage;
