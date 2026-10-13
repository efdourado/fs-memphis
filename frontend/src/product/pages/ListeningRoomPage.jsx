import { useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import { sessionFor, workFor } from '../listening/edition';
import { KeepIdea, useNotebook } from '../listening/NotebookContext';
import SoundLab from '../listening/SoundLab';
import ConnectionLinks from '../listening/ConnectionLinks';
import NotFoundPage from './NotFoundPage';

function ArrangementExplorer({ work, session }) {
  const [section, setSection] = useState(session.sections[0]);
  const labels = ['Absent', 'Quiet', 'Present', 'Placement unknown'];
  return <section className="m-explorer">
    <div className="p-rowhead"><h3>Step inside the arrangement.</h3><span className="p-mono">Our listening map · by ear</span></div>
    <p className="p-small">Choose a section. See what stays, what leaves, and what changes the room.</p>
    <div className="m-section-picker" aria-label="Arrangement section">{work.map.sections.map((name, i) => <button key={i} aria-pressed={section === i} onClick={() => setSection(i)}><span>{String(i + 1).padStart(2, '0')}</span>{name}</button>)}</div>
    <div className="m-layers">{work.map.layers.map(layer => <div className={`m-layer m-layer--${layer.cells[section]}`} key={layer.name}><span>{layer.name}</span><span className="m-layer__bar" aria-hidden="true"><i /></span><small>{labels[layer.cells[section]]}</small></div>)}</div>
    <p className="p-mono">A visual reading, not isolated audio. “Placement unknown” stays unknown. <Link className="p-link" to={`/songs/${work.slug}#map`}>See the full map and sources ↗</Link></p>
  </section>;
}

function Room({ session }) {
  const work = workFor(session.slug);
  const { notebook, progress, note, storageError } = useNotebook();
  const [params, setParams] = useSearchParams();
  const resumeAt = notebook.progress[session.slug] < 3 ? notebook.progress[session.slug] || 0 : 0;
  const step = Math.min(2, Math.max(0, Number(params.get('step') ?? resumeAt) || 0)) | 0;
  const [answer, setAnswer] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);
  const heading = useRef(null);
  usePageTitle(`${session.title} — Listening room`);
  const next = sessionFor(session.next);
  const navigateStep = value => {
    setParams({ step: value });
    progress(session.slug, value);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setShareError(false); }
    catch { setShareError(true); }
  };
  const finished = notebook.progress[session.slug] === 3;
  return <div className="p-page m-room" style={{ '--session-color': session.color }}>
    <div className="m-room-top"><Link className="p-small" to="/">← The listening club</Link><button className="p-text-btn" onClick={share}>{copied ? 'Link copied ✓' : 'Share this room ↗'}</button></div>
    {shareError && <p role="status" className="p-small">Copy the address from your browser to share this room.</p>}
    <header className="m-room-header"><div className={`m-mini-record m-record--${session.slug}`} aria-hidden="true"><span /></div><div><p className="m-kicker">{session.artist} · {session.year} · {session.duration}</p><h1>{session.title}</h1><p>{session.idea}</p></div><Link to={`/songs/${session.slug}`} className="p-link">The full story ↗</Link></header>
    <nav className="m-room-steps" aria-label="Listening session">{['Listen closer', 'Pull it apart', 'Make it yours'].map((label, i) => <button key={label} aria-current={step === i ? 'step' : undefined} onClick={() => navigateStep(i)}><span>{notebook.progress[session.slug] > i ? '✓' : `0${i + 1}`}</span>{label}</button>)}</nav>
    <div className="m-room-content">
      <div className="m-room-heading" tabIndex="-1" ref={heading}><p className="m-kicker">0{step + 1} / 03 — {['Notice', 'Explore', 'Keep'][step]}</p><h2>{['You know the song. Change what you listen for.', 'The arrangement is the instrument.', 'A discovery becomes part of your taste.'][step]}</h2></div>
      {step === 0 && <>
        <div className="m-prompt"><span className="m-prompt-icon" aria-hidden="true">◎</span><div><p className="m-kicker">Your listening assignment</p><p>{session.focus}</p></div></div>
        <div className="m-listen-links"><p>Open the original in your music app, then come back here.</p><div className="p-btns">{work.listen.map(link => <a className="p-btn" key={link.service} href={link.url} target="_blank" rel="noreferrer">{link.service} ↗</a>)}</div><span className="p-mono">Search links · no account needed here · playback stays in your music app</span></div>
        <section className="m-question"><h3>{session.question}</h3><p className="p-small">Go with your ears. This is a prompt, not a score.</p><div className="m-answers">{session.options.map((option, i) => <button key={option} aria-pressed={answer === i} onClick={() => setAnswer(i)}><span>{String.fromCharCode(65 + i)}</span>{option}<span>{answer === i ? '✓' : '↗'}</span></button>)}</div>{answer !== null && <div className="m-reveal" role="status"><p className="m-kicker">{answer === session.answer ? 'That’s what we hear, too.' : 'Here’s another way to hear it.'}</p><p>{session.reveal}</p><Link className="p-link" to={`/songs/${session.slug}#why`}>Follow the idea ↗</Link></div>}</section>
      </>}
      {step === 1 && <><ArrangementExplorer work={work} session={session} /><SoundLab session={session} /></>}
      {step === 2 && <>
        <section className="m-ideas"><p className="p-small">Take one of these constraints into your own music—or your next listen.</p>{work.tryIt.map((idea, index) => <div key={idea.title}><span className="p-mono">0{index + 1}</span><div><h3>{idea.title}</h3><p>{idea.body}</p></div><KeepIdea slug={session.slug} index={index} /></div>)}</section>
        <section className="m-note"><label htmlFor="listening-note">What will you hear differently next time?</label><textarea id="listening-note" className="p-input" rows="4" maxLength={2000} placeholder="A sound, a feeling, something you want to try…" value={notebook.notes[session.slug] || ''} onChange={event => note(session.slug, event.target.value)} /><p className="p-mono" role="status">{storageError ? 'Browser storage is unavailable. Copy your note before leaving.' : 'Saved on this device as you write. Just for you.'}</p></section>
        <button className="p-btn m-primary" onClick={() => progress(session.slug, 3)} disabled={finished}>{finished ? '✓ Session complete' : 'Finish this session'}</button>
        {finished && <div className="m-completed" role="status"><p className="m-kicker">One song, heard differently.</p><h3>Keep following the thread.</h3><p>{session.bridge}</p><div className="p-btns"><Link className="p-btn m-primary" to={`/listen/${next.slug}`}>Next: {next.title} ↗</Link><Link className="p-btn" to="/notebook">Your notebook</Link></div></div>}
        <ConnectionLinks slug={session.slug} compact />
      </>}
      {storageError && step !== 2 && <p role="alert" className="p-error">Progress is only kept for this visit because browser storage is unavailable.</p>}
      <div className="m-room-bottom"><span className="p-small">{session.title} · A Memphis listening session</span><div className="p-btns">{step > 0 && <button className="p-btn" onClick={() => navigateStep(step - 1)}>← Back</button>}{step < 2 && <button className="p-btn m-primary" onClick={() => navigateStep(step + 1)}>{step === 0 ? 'Explore the arrangement' : 'Keep something from it'} →</button>}</div></div>
    </div>
  </div>;
}
export default function ListeningRoomPage() {
  const { slug } = useParams();
  const session = sessionFor(slug);
  return session ? <Room key={slug} session={session} /> : <NotFoundPage />;
}
