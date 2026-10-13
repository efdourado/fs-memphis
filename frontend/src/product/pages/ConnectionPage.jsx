import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import { connections, connectionFor, soundForSide } from '../listening/connections';
import { sessionFor } from '../listening/edition';
import { eventsAt } from '../listening/soundExperiments';
import { useSoundPlayer } from '../listening/useSoundPlayer';
import { useNotebook } from '../listening/NotebookContext';
import AudioHelp from '../listening/AudioHelp';
import Cover from '../components/Cover';
import NotFoundPage from './NotFoundPage';

function ListeningTable({ connection }) {
  usePageTitle(`${connection.theme} — The listening table`);
  const { notebook, saveDiscovery, storageError } = useNotebook();
  const saved = notebook.discoveries.find(item => item.id === connection.id);
  const [choiceId, setChoiceId] = useState(saved?.choiceId || null);
  const [note, setNote] = useState(saved?.note || '');
  const [revealed, setRevealed] = useState(Boolean(saved));
  const [shareStatus, setShareStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const player = useSoundPlayer();
  const revealHeading = useRef(null);
  const choice = connection.choices.find(item => item.id === choiceId);
  const unchanged = saved?.choiceId === choiceId && saved?.note === note;
  const index = connections.indexOf(connection);
  const next = connections[(index + 1) % connections.length];
  const playingSide = player.activeId ? connection.sides[player.activeId === 'A' ? 0 : 1] : null;
  const reveal = id => {
    if (id) setChoiceId(id);
    setSaveStatus(''); setRevealed(true);
    requestAnimationFrame(() => revealHeading.current?.focus({ preventScroll: true }));
  };
  const keep = () => {
    saveDiscovery({ id: connection.id, choiceId, note });
    setSaveStatus('Discovery kept in your notebook.');
  };
  const share = async () => {
    // Only the pairing travels. Choices and private notes never enter the URL.
    const url = `${window.location.origin}/connections/${connection.id}`;
    try { await navigator.clipboard.writeText(url); setShareStatus('Pairing link copied. Your note stays private.'); setManualLink(''); }
    catch { setManualLink(url); setShareStatus('Copy this pairing link. Your note stays private.'); }
  };
  return <div className="p-page m-table" style={{ '--session-color': '#d2d7b1' }}>
    <div className="m-room-top"><Link to="/" className="p-small">← Discover</Link><button className="p-text-btn" onClick={share}>Share this pairing ↗</button></div>
    {shareStatus && <div className="m-table-share"><p className="p-small" role="status">{shareStatus}</p>{manualLink && <input className="p-input" aria-label="Pairing link" readOnly value={manualLink} onFocus={event => event.target.select()} />}</div>}
    <header className="m-table-header"><p className="m-kicker">The listening table / 0{index + 1} — {connection.theme}</p><h1>{connection.title}</h1><p className="p-lede">{connection.invitation}</p></header>
    <nav className="m-table-nav" aria-label="Listening pairings">{connections.map((item, i) => <Link key={item.id} to={`/connections/${item.id}`} aria-current={item.id === connection.id ? 'page' : undefined}><span>0{i + 1}</span>{item.theme}{notebook.discoveries.some(discovery => discovery.id === item.id) && <span aria-label="Saved in notebook">✓</span>}</Link>)}</nav>
    {playingSide && <aside className="m-table-transport" aria-label="Playback controls"><span><span className="m-kicker">{player.starting ? 'Starting' : 'Playing'} sketch {player.activeId}</span><span>{sessionFor(playingSide.slug).title}</span></span><button className="p-btn" onClick={player.stop}>{player.starting ? 'Cancel audio' : '■ Stop audio'}</button></aside>}

    <section className="m-table-sounds" aria-label="Compare the two sound sketches">
      <div className="m-table-instructions"><p className="m-kicker">01 / Listen to both</p><p>Original Memphis sketches, not the recordings or stems. Each keeps its own sound and tempo.</p></div>
      <div className="m-decks">{connection.sides.map((side, i) => {
        const letter = i === 0 ? 'A' : 'B';
        const session = sessionFor(side.slug);
        const sound = soundForSide(side);
        const active = player.activeId === letter;
        const pattern = Array.from({ length: 16 }, (_, step) => eventsAt(sound.experiment, sound.settings, step).length);
        return <article className={`m-deck ${active && !player.starting ? 'is-playing' : ''}`} key={side.slug} style={{ '--deck-color': session.color }}>
          <div className="m-deck-top"><span className="m-kicker">Sketch {letter}</span><span className="p-mono">{sound.settings.bpm} BPM</span></div>
          <div className="m-deck-art" aria-hidden="true"><Cover slug={side.slug} /><span>{letter}</span><div className="m-deck-ring" /></div>
          <div className="m-deck-copy"><p className="m-kicker">An idea from {session.title}</p><h2>{side.label}</h2><p>{side.cue}</p></div>
          <div className="m-deck-pattern" aria-hidden="true">{pattern.map((count, step) => <span key={step} className={active && player.step === step ? 'is-current' : ''} style={{ height: `${12 + count * 8}px`, opacity: count ? undefined : .25 }} />)}</div>
          <button className={`p-btn ${active ? '' : 'm-primary'}`} onClick={() => player.play({ id: letter, experiment: sound.experiment, readSettings: () => sound.settings })} aria-pressed={active}>
            {active ? player.starting ? `Cancel sketch ${letter}` : `■ Stop sketch ${letter}` : `▶ Play sketch ${letter}`}
          </button>
          <p className="m-deck-credit">{session.title}<span>{session.artist} · {session.year}</span></p>
        </article>;
      })}</div>
      <div className="m-table-playback"><p role="status" className="p-small">{player.activeId ? player.starting ? `Starting sketch ${player.activeId}…` : `Playing sketch ${player.activeId}. Play the other to switch.` : 'Tap a sketch to start. Only one plays at a time.'}</p><span className="p-mono">Loops until you stop or switch.</span></div>
      {player.error && <p className="p-error" role="alert">{player.error}</p>}
      <AudioHelp />
    </section>

    <section className="m-table-choice" aria-labelledby="table-question"><p className="m-kicker">02 / Follow your ear</p><h2 id="table-question">{connection.question}</h2><p className="p-small">No right answer. Choose what interests you, or read the connection below.</p><div className="m-table-options">{connection.choices.map(item => <button key={item.id} aria-pressed={choiceId === item.id} onClick={() => reveal(item.id)}><span>{item.label}</span><span aria-hidden="true">{choiceId === item.id ? '✓' : '↗'}</span></button>)}</div>{!revealed && <button className="p-text-btn" onClick={() => reveal()}>Read our connection first ↓</button>}</section>

    {revealed && <section className="m-table-reveal" aria-labelledby="connection-heading">
      <div className="m-table-reading"><p className="m-kicker">03 / The thread between them · Our take</p><h2 id="connection-heading" ref={revealHeading} tabIndex="-1">{choice ? choice.takeaway : 'Different decisions. A shared question.'}</h2><p>{connection.reading}</p></div>
      <div className="m-table-details">{connection.sides.map((side, i) => <article key={side.slug}><p className="m-kicker">Sketch {i === 0 ? 'A' : 'B'} / {side.mark}</p><p>{side.detail}</p><Link className="p-link" to={`/listen/${side.slug}?step=1`}>Explore {sessionFor(side.slug).title} ↗</Link></article>)}</div>
      {choice && <div className="m-table-keep"><p className="m-kicker">Your next listen</p><h3>{choice.prompt}</h3><label htmlFor="connection-note">What caught your ear? <span>(optional)</span></label><textarea id="connection-note" className="p-input" rows="3" maxLength={1000} placeholder="A detail you want to come back to…" value={note} onChange={event => { setNote(event.target.value); setSaveStatus(''); }} /><div className="p-btns"><button className="p-btn m-primary" disabled={unchanged} onClick={keep}>{unchanged ? '✓ In your notebook' : saved ? 'Update your discovery' : 'Keep this discovery'}</button><Link to="/notebook" className="p-link">Open notebook ↗</Link></div><p className="p-small" role="status">{storageError ? 'Browser storage is unavailable. Copy your note or export your notebook before leaving.' : saveStatus || (unchanged ? 'Kept in this browser. Your choices and notes stay private.' : 'Keep your discovery to save this choice and note on this device.')}</p></div>}
      <details className="m-table-challenge"><summary>Make something from the connection</summary><p>{connection.challenge}</p></details>
      <div className="m-table-next"><div><p className="m-kicker">Keep following the thread</p><h3>{next.title}</h3></div><Link className="p-btn" to={`/connections/${next.id}`}>Next: {next.theme} ↗</Link></div>
    </section>}
  </div>;
}

export default function ConnectionPage() {
  const { id } = useParams();
  const connection = connectionFor(id);
  return connection ? <ListeningTable key={id} connection={connection} /> : <NotFoundPage />;
}
