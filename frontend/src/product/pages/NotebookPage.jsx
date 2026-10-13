import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import { sessions, sessionFor, workFor } from '../listening/edition';
import { KeepIdea, useNotebook } from '../listening/NotebookContext';
import { exportNotebook } from '../listening/notebook';
import { connectionFor, choiceFor } from '../listening/connections';

export default function NotebookPage() {
  usePageTitle('Your listening notebook');
  const { notebook, note, saveDiscovery, removeDiscovery, storageError } = useNotebook();
  const notes = sessions.filter(session => notebook.notes[session.slug]?.trim());
  const completed = sessions.filter(session => notebook.progress[session.slug] === 3);
  const [showExport, setShowExport] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [removed, setRemoved] = useState(null);
  const exportText = exportNotebook(notebook);
  const copy = async () => {
    try { await navigator.clipboard.writeText(exportText); setCopyStatus('Copied. Your notebook is ready to paste.'); }
    catch { setCopyStatus('Select and copy the text below to take your notebook with you.'); }
  };
  return <div className="p-page m-notebook">
    <header className="m-notebook-header"><p className="m-kicker">Your taste, taking shape</p><h1>Your listening<br /><em>notebook.</em></h1><p className="p-lede">The ideas you want to hold on to. The details only you noticed.</p><div className="p-btns"><span className="p-pill">{notebook.saved.length} {notebook.saved.length === 1 ? 'idea' : 'ideas'} kept</span><span className="p-pill">{notebook.discoveries.length} {notebook.discoveries.length === 1 ? 'connection' : 'connections'} kept</span><span className="p-pill p-pill--quiet">{completed.length} of 3 sessions completed</span></div><p className="p-small">Stored in this browser. No account needed. Export a copy to take it with you.</p>{(notebook.saved.length > 0 || notes.length > 0 || notebook.discoveries.length > 0) && <button className="p-btn" onClick={() => setShowExport(value => !value)}>Export your notebook ↓</button>}{storageError && <p className="p-error" role="alert">Browser storage is unavailable. Export before leaving to keep your work.</p>}</header>
    {showExport && <section className="p-card p-pad p-stack p-stack--wide">
      <h2 className="p-md">Take your notebook with you</h2>
      <div className="p-btns"><a className="p-btn m-primary" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(exportText)}`} download="my-memphis-notebook.md">Download notebook ↓</a><button className="p-btn" onClick={copy}>Copy text</button></div>
      <label htmlFor="notebook-export" className="p-small">Your notebook, ready to copy</label>
      <textarea className="p-input" id="notebook-export" readOnly value={exportText} rows="8" />
      {copyStatus && <p role="status" className="p-small">{copyStatus}</p>}
    </section>}
    <section className="p-sec">
      <div className="p-rowhead"><h2 className="p-lg">Connections you heard</h2><Link className="p-link" to="/connections">Visit the listening table ↗</Link></div>
      {removed && <div className="m-notebook-undo"><p role="status">Discovery removed.</p><button className="p-text-btn" onClick={() => { saveDiscovery(removed); setRemoved(null); }}>Undo</button></div>}
      {notebook.discoveries.length ? <div className="m-notebook-grid">{notebook.discoveries.map(discovery => {
        const connection = connectionFor(discovery.id);
        const choice = choiceFor(discovery.id, discovery.choiceId);
        return <article className="m-notebook-card" key={discovery.id}><p className="m-kicker">{connection.theme} · The listening table</p><h3>{choice.takeaway}</h3><p className="p-small">You chose: {choice.label}</p><p>{choice.prompt}</p>{discovery.note && <blockquote className="m-discovery-note">{discovery.note}</blockquote>}<p className="p-mono">{connection.sides.map(side => sessionFor(side.slug).title).join(' ↔ ')}</p><Link className="p-link" to={`/connections/${connection.id}`}>Replay or edit this discovery ↗</Link><button className="p-text-btn" onClick={() => { setRemoved(discovery); removeDiscovery(discovery.id); }}>Remove discovery</button></article>;
      })}</div> : <div className="m-notebook-invitation"><p>Two songs can show you something that one song can’t. Hear a pairing, choose what draws you in, and bring it back here.</p><Link className="p-btn" to="/connections/make-space">Hear your first connection ↗</Link></div>}
    </section>
    <section className="p-sec"><div className="p-rowhead"><h2 className="p-lg">Ideas to make your own</h2><span>From listening to doing</span></div>{notebook.saved.length ? <div className="m-notebook-grid">{notebook.saved.map(id => { const [slug, index] = id.split(':'); const work = workFor(slug); const idea = work.tryIt[index]; return <article className="m-notebook-card" key={id}><p className="m-kicker">{work.artist}</p><h3>{idea.title}</h3><p>{idea.body}</p><Link className="p-link" to={`/listen/${slug}?step=2`}>From {work.title} ↗</Link><KeepIdea slug={slug} index={Number(index)} /></article>; })}</div> : <div className="m-empty"><span aria-hidden="true">✳</span><h3>A good idea deserves a second listen.</h3><p>Start a listening session and keep a technique. Your collection begins with one small discovery.</p><Link className="p-btn m-primary" to="/listen/dreams">Find your first idea ↗</Link></div>}</section>
    {notes.length > 0 && <section className="p-sec"><h2 className="p-lg">In your own words</h2>{notes.map(session => <article className="m-notebook-card" key={session.slug}><Link className="p-link" to={`/listen/${session.slug}?step=2`}>{session.title} ↗</Link><p className="m-note-text">{notebook.notes[session.slug]}</p><button className="p-text-btn" onClick={() => note(session.slug, '')}>Remove note</button></article>)}</section>}
    <section className="p-sec"><h2 className="p-lg">Your listening trail</h2><div className="m-trail">{sessions.map(session => <Link key={session.slug} to={`/listen/${session.slug}`}><span className="m-trail__status">{notebook.progress[session.slug] === 3 ? '✓' : '○'}</span><span>{session.title}<small>{session.artist}</small></span><span className="p-mono">{notebook.progress[session.slug] === 3 ? 'Revisit' : notebook.progress[session.slug] > 0 ? 'Continue' : 'Begin'} ↗</span></Link>)}</div></section>
  </div>;
}
