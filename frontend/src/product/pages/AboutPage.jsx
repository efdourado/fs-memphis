import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import Status, { STATUS_INFO } from '../components/Status';

export default function AboutPage() {
  usePageTitle('About');
  return (
    <article className="m-page m-page--narrow m-prose">
      <h1 className="m-title">About Memphis</h1>
      <p className="m-lede">
        Memphis helps you understand what is happening around a song, what is happening inside it and how it
        connects to your musical world. Listening happens wherever you already listen.
      </p>

      <h2>Every claim says what it is</h2>
      <ul className="m-legend-list">
        {Object.entries(STATUS_INFO).map(([key, info]) => (
          <li key={key}><Status status={key} /> <span>{info.description}</span></li>
        ))}
      </ul>

      <h2 id="method">How attention is read</h2>
      <p>
        Memphis has not yet verified a trend data source it may store and display, so every attention curve is
        demo data. The pattern under each curve is computed from the curve itself:
      </p>
      <ul>
        <li><strong>Renewed attention</strong>: the highest point comes ten or more years after release and at least double the early level.</li>
        <li><strong>Sustained attention</strong>: the latest level keeps at least 60% of a peak it rose to.</li>
        <li><strong>Short spike</strong>: the latest level keeps less than 35% of the peak.</li>
        <li><strong>Settling after a peak</strong>: everything in between.</li>
      </ul>
      <p>
        Views, listeners and chart positions are never merged into one popularity score. A chart position is not a
        stream count. When real data arrives, each curve will show its source, period and coverage.
      </p>

      <h2>What Memphis does not do</h2>
      <ul>
        <li>It does not host music or artwork. Listening links lead to the service you choose.</li>
        <li>It does not claim to explain why a song became a hit. Timing suggests connections, not causes.</li>
        <li>It does not write biographies or credits it cannot source. Gaps stay visible.</li>
        <li>It does not profile you. It keeps only what you save, and you can download or delete it from <Link to="/you">You</Link>.</li>
      </ul>

      <h2>Where this is going</h2>
      <p>
        The collection starts with ten songs, researched for one complete journey each. It grows once listeners
        show that they learn something, notice it on their next listen and want to follow the next connection.
      </p>
      <p>
        The first Memphis interface, with its player, playlists and visual experiments, is kept in the{' '}
        <Link to="/design-archive">Design Archive</Link>.
      </p>
    </article>
  );
}
