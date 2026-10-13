import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, errorMessage } from '../api';
import { usePageTitle } from '../hooks';
import { PersonTile, SongTile } from '../components/Tiles';

const SUGGESTIONS = ['Max Martin', 'Finneas', 'Kate Bush', 'disco', 'synth-pop'];

export default function SearchPage() {
  usePageTitle('Search');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [text, setText] = useState(query);
  const [state, setState] = useState({ results: null, error: '' });
  const inputRef = useRef(null);

  useEffect(() => { if (!query) inputRef.current?.focus(); }, [query]);
  useEffect(() => { setText(query); }, [query]);

  // Search as you type, a beat after the last keystroke.
  useEffect(() => {
    const trimmed = text.trim();
    const timer = setTimeout(() => {
      if (trimmed !== query) setParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [text, query, setParams]);

  useEffect(() => {
    if (!query) {
      setState({ results: null, error: '' });
      return undefined;
    }
    let active = true;
    api.search(query)
      .then((results) => active && setState({ results, error: '' }))
      .catch((error) => active && setState({ results: null, error: errorMessage(error) }));
    return () => { active = false; };
  }, [query]);

  const { results, error } = state;
  const empty = results && !results.works.length && !results.people.length;

  return (
    <div className="p-page" style={{ gap: 32 }}>
      <form className="p-searchbox" role="search" onSubmit={(event) => event.preventDefault()}>
        <svg viewBox="0 0 24 24" className="p-icon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
        <input
          id="search"
          ref={inputRef}
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="A song, an artist, a producer"
          aria-label="Search"
        />
      </form>

      {!query && (
        <div className="p-chips">
          {SUGGESTIONS.map((s) => <button type="button" key={s} className="p-btn p-btn--quiet p-btn--small" onClick={() => setText(s)}>{s}</button>)}
        </div>
      )}

      {error && <p className="p-error" role="alert">{error}</p>}

      <div aria-live="polite" style={{ display: 'grid', gap: 40 }}>
        {empty && <p className="p-notice">Nothing for “{query}” yet. The shelf is small on purpose.</p>}
        {results?.works.length > 0 && (
          <section className="p-sec">
            <h2 className="p-md">Songs</h2>
            <div className="p-grid-tiles">{results.works.map((work) => <SongTile key={work.slug} work={work} />)}</div>
          </section>
        )}
        {results?.people.length > 0 && (
          <section className="p-sec">
            <h2 className="p-md">People</h2>
            <div className="p-grid-tiles">{results.people.map((person) => <PersonTile key={person.slug} person={person} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
