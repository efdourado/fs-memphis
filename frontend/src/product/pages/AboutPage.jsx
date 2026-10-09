import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import Status, { STATUS_INFO } from '../components/Status';

export default function AboutPage() {
  usePageTitle('How Memphis works');
  return (
    <article className="p-page p-page--narrow p-prose">
      <h1 className="p-page-title">How Memphis works</h1>
      <p className="p-prose__lead">
        You bring a song you love. We show what happened around it, what’s going on inside it,
        and who made it — so the next listen hits different. The music stays wherever you already listen.
      </p>

      <h2>Every line wears a tag</h2>
      <ul className="p-legend">
        {Object.entries(STATUS_INFO).map(([key, info]) => (
          <li key={key}><Status status={key} /><span>{info.description}</span></li>
        ))}
      </ul>

      <h2 id="method">How we read the curves</h2>
      <p>The curves are demo data for now. The label under each one is worked out from the curve itself:</p>
      <ul className="p-bullets">
        <li><strong>Comeback</strong> — the peak lands ten or more years after release.</li>
        <li><strong>Built to last</strong> — it still holds most of its peak.</li>
        <li><strong>Quick spike</strong> — it rose fast and faded fast.</li>
        <li><strong>Cooling off</strong> — somewhere in between.</li>
      </ul>
      <p>We never mash views, streams and chart spots into one magic number.</p>

      <h2>What we won’t do</h2>
      <ul className="p-bullets">
        <li>Host music or cover art we don’t have the rights to.</li>
        <li>Pretend we know why a song blew up.</li>
        <li>Fill gaps with guesses.</li>
        <li>Profile you. Your library is yours to download or delete.</li>
      </ul>

      <p>
        The first version of Memphis — player, playlists and all — lives on in the{' '}
        <Link to="/design-archive">Design Archive</Link>.
      </p>
    </article>
  );
}
