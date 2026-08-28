import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { picksPrototype } from '../../data/knowledgePrototype';

const trailLinks = [
  { to: '/atlas/song/die-young', action: 'Open the starting work' },
  { to: '/people/benny-blanco', action: 'Follow the creative credit' },
  { to: '/genres/pop', action: 'Cross through a shared technique' },
  { to: '/stories/pop-youth', action: 'Read the cultural question' },
  { to: '/today', action: 'Save the route to My Memphis' },
];

const MemphisPicksPage = () => (
  <KnowledgeFrame
    className="knowledge-picks-page"
    eyebrow="Memphis Picks · Trail 001"
    title={<>A route,<br />not a playlist.</>}
    description="Five explained steps from something familiar toward a wider musical world. You choose where the listening happens."
    breadcrumbs={[{ label: 'Memphis Picks' }]}
    heroAside={(
      <div className="picks-route-mark" role="img" aria-label="Five-step Memphis discovery trail">
        {[1, 2, 3, 4, 5].map((step) => (
          <span className={`picks-route-mark__step picks-route-mark__step--${step}`} key={step}>{step}</span>
        ))}
        <i aria-hidden="true" />
        <strong>01—05</strong>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#picks-trail">Begin the trail</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/today">Save to My Memphis</Link>
      </>
    )}
  >
    <aside className="picks-principle">
      <div>
        <ContentBadge status="editorial" />
        <p className="knowledge-kicker">Why this exists</p>
      </div>
      <h2>Recommendation should teach you how the connection was made.</h2>
      <p>Memphis Picks favors creative relationships, techniques and context over hype, autoplay and invisible similarity scores.</p>
    </aside>

    <section className="picks-trail" id="picks-trail" aria-labelledby="picks-trail-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Trail 001 · Beyond the familiar</p>
          <h2 id="picks-trail-title">Follow the reason between each stop.</h2>
        </div>
        <p>Prototype modules stand in for future verified works and external listening destinations.</p>
      </header>

      <ol className="picks-trail__list">
        {picksPrototype.map((pick, index) => (
          <li className="picks-stop" key={pick.step}>
            <div className="picks-stop__number">{pick.step}</div>
            <div className="picks-stop__body">
              <div className="picks-stop__meta">
                <span>{pick.tag}</span>
                <ContentBadge status={index === 4 ? 'prototype' : 'editorial'} compact />
              </div>
              <h3>{pick.title}</h3>
              <p>{pick.body}</p>
              <Link to={trailLinks[index].to}>{trailLinks[index].action} ↗</Link>
            </div>
            {index < picksPrototype.length - 1 && (
              <div className="picks-stop__connector" aria-hidden="true">
                <span />
                <small>because</small>
                <span />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>

    <section className="picks-reason-board" aria-labelledby="picks-reason-title">
      <header>
        <ContentBadge status="editorial" />
        <p className="knowledge-kicker">The curator's note</p>
        <h2 id="picks-reason-title">Why these five steps?</h2>
      </header>
      <div className="picks-reason-board__grid">
        <article>
          <span>01</span>
          <h3>Recognition creates an anchor.</h3>
          <p>Starting with a known structure leaves more attention for credits, production and context.</p>
        </article>
        <article>
          <span>02</span>
          <h3>A person creates continuity.</h3>
          <p>One collaborator can connect works that a genre label would keep apart.</p>
        </article>
        <article>
          <span>03</span>
          <h3>A question changes the return.</h3>
          <p>When you revisit the first song, you carry a new way to hear it.</p>
        </article>
      </div>
    </section>

    <section className="picks-external" aria-labelledby="picks-external-title">
      <div className="picks-external__mark" aria-hidden="true">↗</div>
      <div>
        <p className="knowledge-kicker">External listening</p>
        <h2 id="picks-external-title">Memphis holds the knowledge, not the audio.</h2>
        <p>Future verified links can send people to the artist's chosen or licensed destination without copying the work into Memphis.</p>
      </div>
      <ContentBadge status="prototype" />
    </section>

    <section className="picks-standards" aria-labelledby="picks-standards-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Editorial standards</p>
          <h2 id="picks-standards-title">What earns a place in a trail?</h2>
        </div>
      </header>
      <ul>
        <li><span>01</span><p>A reason deeper than popularity.</p></li>
        <li><span>02</span><p>A visible bridge to the previous stop.</p></li>
        <li><span>03</span><p>Credits and context checked before publication.</p></li>
        <li><span>04</span><p>Room for correction, disagreement and another route.</p></li>
      </ul>
    </section>
  </KnowledgeFrame>
);

export default MemphisPicksPage;
