import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { comparisonPrototype } from '../../data/knowledgePrototype';

const ComparisonPage = () => (
  <KnowledgeFrame
    className="knowledge-comparison-page"
    eyebrow="Comparison lab · visual hypothesis"
    title={comparisonPrototype.title}
    description={comparisonPrototype.intro}
    breadcrumbs={[{ label: 'Comparison lab', to: '/atlas' }, { label: 'Breakthrough' }]}
    heroAside={(
      <div className="comparison-hero-mark" role="img" aria-label="Side-by-side comparison mark">
        <div><span>ACT</span><strong>A</strong></div>
        <i>≠</i>
        <div><span>ACT</span><strong>B</strong></div>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#comparison-factors">Compare the factors</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/stories/pop-youth">Read the cultural context</Link>
      </>
    )}
  >
    <aside className="comparison-caveat">
      <ContentBadge status="editorial" />
      <div>
        <p className="knowledge-kicker">Before the numbers</p>
        <h2>Visibility is never explained by one variable.</h2>
      </div>
      <p>These scores only demonstrate the interface. A real comparison needs declared criteria, sources, uncertainty and more than one plausible reading.</p>
    </aside>

    <section className="comparison-actors" aria-label="Prototype acts under comparison">
      <article className="comparison-actor comparison-actor--left">
        <span>Act A / prototype</span>
        <strong>A</strong>
        <h2>Immediate identity</h2>
        <p>A hypothetical act with a more continuous public narrative and a direct audience entry point.</p>
      </article>
      <div className="comparison-actors__versus">versus</div>
      <article className="comparison-actor comparison-actor--right">
        <span>Act B / prototype</span>
        <strong>B</strong>
        <h2>Diffuse identity</h2>
        <p>A hypothetical act with creative distinction but less continuity across timing, positioning and circulation.</p>
      </article>
    </section>

    <section className="comparison-factors" id="comparison-factors" aria-labelledby="comparison-factors-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Factor board</p>
          <h2 id="comparison-factors-title">Compare dimensions, not worth.</h2>
        </div>
        <ContentBadge status="prototype" />
      </header>

      <div className="comparison-factor-list">
        <div className="comparison-factor-list__labels" aria-hidden="true">
          <span>Act A</span>
          <span>Act B</span>
        </div>
        {comparisonPrototype.factors.map((factor, index) => (
          <article className="comparison-factor" key={factor.name}>
            <div className="comparison-factor__heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{factor.name}</h3>
                <p>{factor.note}</p>
              </div>
            </div>
            <div className="comparison-factor__measure">
              <div className="comparison-factor__bar comparison-factor__bar--left">
                <span style={{ '--factor-score': `${factor.left}%` }} />
                <strong>{factor.left}</strong>
              </div>
              <div className="comparison-factor__bar comparison-factor__bar--right">
                <span style={{ '--factor-score': `${factor.right}%` }} />
                <strong>{factor.right}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="comparison-readings" aria-labelledby="comparison-readings-title">
      <header>
        <p className="knowledge-kicker">Three valid readings</p>
        <h2 id="comparison-readings-title">The same board can support different questions.</h2>
      </header>
      <div>
        <article>
          <span>01</span>
          <ContentBadge status="editorial" compact />
          <h3>Positioning</h3>
          <p>Did listeners have a clear first idea of who each act was?</p>
        </article>
        <article>
          <span>02</span>
          <ContentBadge status="editorial" compact />
          <h3>Circulation</h3>
          <p>Which channels, moments and gatekeepers were available to each release?</p>
        </article>
        <article>
          <span>03</span>
          <ContentBadge status="editorial" compact />
          <h3>Creative history</h3>
          <p>Did one narrative become easier to continue without being artistically better?</p>
        </article>
      </div>
    </section>

    <section className="comparison-method" aria-labelledby="comparison-method-title">
      <div>
        <p className="knowledge-kicker">Publication method</p>
        <h2 id="comparison-method-title">What a real comparison must disclose.</h2>
      </div>
      <ol>
        <li><span>01</span>Named, comparable entities</li>
        <li><span>02</span>Time period and market boundary</li>
        <li><span>03</span>Sources behind every factor</li>
        <li><span>04</span>How each measure was calculated</li>
        <li><span>05</span>Counterexamples and uncertainty</li>
      </ol>
      <ContentBadge status="awaiting" />
    </section>

    <aside className="knowledge-next-step">
      <div>
        <p className="knowledge-kicker">Another lens</p>
        <h2>Follow a real creative role across works.</h2>
        <p>A credit map can show continuity without pretending to explain success.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/people/benny-blanco">Open the people map</Link>
    </aside>
  </KnowledgeFrame>
);

export default ComparisonPage;
