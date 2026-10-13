import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import { sessions } from '../listening/edition';
import { useNotebook } from '../listening/NotebookContext';
import Cover from '../components/Cover';
import ConnectionLinks from '../listening/ConnectionLinks';

export default function SongsPage() {
  usePageTitle('A place to listen closer');
  const [selected, setSelected] = useState('dreams');
  const session = sessions.find(item => item.slug === selected);
  const { notebook } = useNotebook();
  const started = sessions.find(item => notebook.progress[item.slug] > 0 && notebook.progress[item.slug] < 3);
  return (
    <div className="p-page m-home">
      <section className="m-intro">
        <div className="m-eyebrow"><span className="m-live-dot" /> An independent listening club <span>Vol. 001 / The art of less</span></div>
        <div className="m-intro__line"><h1>A familiar song.<br />An <em>unfamiliar</em> way in.</h1><p>For the part of you that always asks,<br />“How did they do that?”<br /><span>Listen. Pull a thread. Make it yours.</span></p></div>
      </section>

      <section className="m-feature" style={{ '--session-color': session.color }} aria-label="Choose a listening session">
        <div className="m-feature__art" aria-hidden="true">
          <div className="m-orbit m-orbit--one" /><div className="m-orbit m-orbit--two" />
          <div className={`m-record m-record--${session.slug}`}><div className="m-record__label"><span>memphis</span><b>{String(sessions.indexOf(session) + 1).padStart(2, '0')}</b><span>LISTEN CLOSER</span></div></div>
          <span className="m-art-caption">A small detail can change the whole record.</span>
        </div>
        <div className="m-feature__body">
          <div className="m-eyebrow">The listening room <span>0{sessions.indexOf(session) + 1} / 03</span></div>
          <div aria-live="polite" className="m-feature__copy"><p className="m-kicker">{session.category}</p><h2>{session.idea}</h2><p className="p-lede">{session.invitation}</p><p className="m-credit">{session.title} <span>— {session.artist}, {session.year}</span></p></div>
          <div className="p-btns"><Link className="p-btn m-primary" to={`/listen/${session.slug}`}>{notebook.progress[session.slug] > 0 ? 'Return to the room' : 'Enter the listening room'} <span>↗</span></Link><span className="m-time">One song. Three discoveries.</span></div>
          <div className="m-selector" aria-label="Featured songs">{sessions.map((item, index) => <button key={item.slug} aria-pressed={selected === item.slug} onClick={() => setSelected(item.slug)}><span>0{index + 1}</span>{item.title}<span className="m-selector__arrow">↗</span></button>)}</div>
        </div>
      </section>

      {started && <Link className="m-resume" to={`/listen/${started.slug}`}><span>↳ Pick up where you left off <strong>{started.title}</strong></span><span>Continue your session →</span></Link>}

      <ConnectionLinks />

      <section className="m-paths p-sec">
        <div className="p-rowhead"><div><p className="m-kicker">Follow your curiosity</p><h2 className="p-lg">Three songs. A hundred ways to hear.</h2></div><span>Curated by ear, connected by ideas.</span></div>
        <div className="m-card-grid">{sessions.map((item, index) => <Link to={`/listen/${item.slug}`} className="m-session-card" key={item.slug} style={{ '--session-color': item.color }}><div className="m-card-art"><Cover slug={item.slug} /><span className="m-card-number">0{index + 1}</span><span className="m-card-arrow">↗</span></div><div className="m-card-copy"><p className="m-kicker">{item.category} · {item.duration}</p><h3>{item.idea}</h3><p>{item.subtitle}</p><div className="m-card-credit">{item.title}<span>{item.artist} · {item.year}</span></div></div></Link>)}</div>
      </section>

      <section className="m-home-bottom"><div><p className="m-kicker">Your taste, taking shape</p><h2>Leave with more than a song.</h2><p>Keep a technique. Write what you heard. Build a notebook of the things that move you.</p><Link to="/notebook" className="p-link">Open your notebook ({notebook.saved.length + notebook.discoveries.length}) ↗</Link></div><div><p className="m-kicker">An open invitation</p><h2>Great craft can come from anywhere.</h2><p>Unheard is our next chapter: independent songs, chosen for the ideas inside them.</p><Link to="/unheard" className="p-link">Meet Unheard ↗</Link></div></section>
    </div>
  );
}
