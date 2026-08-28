import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';
import { storyPrototype } from '../../data/knowledgePrototype';

const StoryDetailPage = () => (
  <KnowledgeFrame
    className="knowledge-story-page"
    eyebrow="Memphis Stories · Issue 001"
    title={storyPrototype.title}
    description={storyPrototype.deck}
    breadcrumbs={[{ label: 'Stories', to: '/atlas' }, { label: 'Pop & youth' }]}
    heroAside={(
      <div className="story-issue-mark" role="img" aria-label="Editorial story issue one">
        <span>STORY</span>
        <strong>01</strong>
        <small>Sound / culture / context</small>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#story-reading">Start reading</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/atlas/song/die-young">Open the connected song</Link>
      </>
    )}
  >
    <div className="story-reading" id="story-reading">
      <aside className="story-reading__rail">
        <p className="knowledge-kicker">In this story</p>
        <nav aria-label="Story chapters">
          {storyPrototype.chapters.map((chapter) => (
            <a href={`#story-chapter-${chapter.number}`} key={chapter.number}>
              <span>{chapter.number}</span>
              {chapter.title}
            </a>
          ))}
        </nav>
        <div className="story-reading__status">
          <ContentBadge status="editorial" compact />
          <p>This is an interpretation. Sources and counterpoints belong beside the final text.</p>
        </div>
      </aside>

      <article className="story-article">
        <header className="story-article__lead">
          <span className="story-dropcap" aria-hidden="true">M</span>
          <p>
            Music can turn a social feeling into form. Memphis starts there, then separates what can be heard,
            what creators have declared and what the editorial team is proposing as a reading.
          </p>
        </header>

        {storyPrototype.chapters.map((chapter, index) => (
          <section id={`story-chapter-${chapter.number}`} key={chapter.number} className="story-chapter">
            <header>
              <span>{chapter.number}</span>
              <div>
                <p className="knowledge-kicker">Chapter {String(index + 1).padStart(2, '0')}</p>
                <h2>{chapter.title}</h2>
              </div>
              <ContentBadge status="editorial" compact />
            </header>
            <p>{chapter.body}</p>

            {index === 0 && (
              <Link className="story-inline-connection" to="/atlas/song/die-young#sound">
                <span>Connected evidence</span>
                <strong>Open the song structure and sound notes</strong>
                <i aria-hidden="true">↗</i>
              </Link>
            )}
            {index === 1 && (
              <blockquote>
                <ContentBadge status="editorial" compact />
                <p>“Youth” must never become a shortcut for one culture, behavior or universal emotional profile.</p>
              </blockquote>
            )}
            {index === 2 && (
              <Link className="story-inline-connection" to="/genres/pop">
                <span>Broader context</span>
                <strong>See Pop as an open historical boundary</strong>
                <i aria-hidden="true">↗</i>
              </Link>
            )}
          </section>
        ))}
      </article>

      <aside className="story-source-rail">
        <p className="knowledge-kicker">Source ledger</p>
        <div>
          <span>01</span>
          <strong>Creator interviews</strong>
          <ContentBadge status="awaiting" compact />
        </div>
        <div>
          <span>02</span>
          <strong>Release context</strong>
          <ContentBadge status="awaiting" compact />
        </div>
        <div>
          <span>03</span>
          <strong>Comparable works</strong>
          <ContentBadge status="prototype" compact />
        </div>
        <Link to="/sources">Open the public source ledger →</Link>
      </aside>
    </div>

    <aside className="story-editorial-rule">
      <ContentBadge status="editorial" />
      <div>
        <p className="knowledge-kicker">Editorial rule</p>
        <h2>Context expands a work. It does not explain it away.</h2>
      </div>
      <p>Reception is multifactorial. Memphis will show evidence, competing readings and uncertainty instead of selling one clean cause.</p>
    </aside>

    <aside className="knowledge-next-step">
      <div>
        <p className="knowledge-kicker">Next route</p>
        <h2>Turn the question into a listening trail.</h2>
        <p>Move from one familiar song toward a different scene through visible, editorial bridges.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/picks">Open Memphis Picks</Link>
    </aside>
  </KnowledgeFrame>
);

export default StoryDetailPage;
