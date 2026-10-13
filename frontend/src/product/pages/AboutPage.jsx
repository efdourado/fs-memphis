import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import Status, { STATUS_INFO } from '../components/Status';

const ROADMAP = [
  { when: 'Now', title: 'A song becomes an experience', body: 'Three guided listening rooms, interactive arrangements, an original sound sketch, and your own notebook. Start without an account.' },
  { when: 'Next', title: 'Follow the craft into Unheard', body: 'Pair familiar songs with independent artists using a shared technique. First-hand stories, with the artist’s permission.' },
  { when: 'Later', title: 'A living listening club', body: 'New curated editions, artist-led sessions, and optional notebook sync. Each addition should give you another reason to listen.' },
];

export default function AboutPage() {
  usePageTitle('About');
  return (
    <div className="p-page p-page--read">
      <header className="p-sec">
        <h1 className="p-xl">Hear how it’s made.</h1>
        <p className="p-lede">
          Memphis opens up songs. For each one you get the story of how it was recorded, a map of what plays
          when, and things to try yourself. It’s for people who love a song and want to hear more in it, and
          for people who make music and want to borrow from the best.
        </p>
        <p className="p-lede">The music stays wherever you listen. Memphis links out.</p>
      </header>

      <section className="p-sec">
        <h2 className="p-md">Where it’s going</h2>
        <div className="p-grid3">
          {ROADMAP.map((step, index) => (
            <div key={step.when} className="p-card p-pad p-stack">
              <span className={`p-pill${index ? ' p-pill--quiet' : ''}`}>{step.when}</span>
              <h3 className="p-md">{step.title}</h3>
              <p className="p-small">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="p-sec">
        <h2 className="p-md">How to read a page</h2>
        <ul className="p-list">
          {['verified', 'editorial', 'computed', 'awaiting'].map((key) => (
            <li key={key}><Status status={key} /><div>{STATUS_INFO[key].description}</div></li>
          ))}
        </ul>
        <p className="p-small">Facts come from published sources, linked at the foot of each page. The maps are drawn by ear and say so.</p>
      </section>

      <section className="p-sec">
        <h2 className="p-md">Two rooms</h2>
        <div className="p-grid2">
          <div className="p-card p-pad p-stack"><h3 className="p-md">Songs</h3><p className="p-small">Songs everyone knows, where the making is well documented.</p><Link className="p-btn" to="/">Enter the listening club</Link></div>
          <div className="p-card p-pad p-stack"><h3 className="p-md">Unheard</h3><p className="p-small">Songs nobody is promoting, told by the people who made them. No numbers anywhere.</p><Link className="p-btn" to="/unheard">Send a song</Link></div>
        </div>
      </section>

      <section className="p-sec" id="archive">
        <h2 className="p-md">The first Memphis</h2>
        <p className="p-small" style={{ maxWidth: '38rem' }}>
          Memphis began as a music player with playlists, themes and a lot of experiments. All of it is still here.
        </p>
        <Link className="p-btn p-btn--quiet p-btn--small" to="/design-archive" style={{ width: 'fit-content' }}>Open the Design Archive</Link>
      </section>
    </div>
  );
}
