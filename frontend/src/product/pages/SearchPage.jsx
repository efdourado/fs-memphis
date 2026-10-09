import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, errorMessage } from '../api';
import { usePageTitle } from '../hooks';
import SongRow from '../components/SongRow';
import { SearchIcon } from '../shell/Icons';

const SUGGESTIONS = ['Max Martin', 'Finneas', 'Kate Bush', '1980s', 'disco'];

export default function SearchPage() {
  usePageTitle('Search');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [text, setText] = useState(query);
  const [state, setState] = useState({ results: null, error: '' });
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query) inputRef.current?.focus();
  }, [query]);

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
    <div className="m-page m-page--narrow">
      <h1 className="m-title">Search</h1>
      <form className="m-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <SearchIcon size={20} />
        <input
          ref={inputRef}
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Songs, artists, producers, genres"
          aria-label="Search the collection"
        />
      </form>

      {!query && (
        <div className="m-block">
          <p className="m-muted">Try one of these</p>
          <div className="m-chips">
            {SUGGESTIONS.map((s) => <button type="button" key={s} className="m-chip-button" onClick={() => setText(s)}>{s}</button>)}
          </div>
        </div>
      )}

      {error && <p className="m-state m-state--error" role="alert">{error}</p>}

      <div aria-live="polite">
        {empty && (
          <div className="m-state">
            <p>Nothing in the collection matches “{query}” yet.</p>
            <p className="m-muted">Memphis starts small on purpose: ten songs researched in depth.</p>
          </div>
        )}

        {results?.people.length > 0 && (
          <section className="m-block" aria-labelledby="people-results">
            <h2 id="people-results" className="m-subhead">People</h2>
            <ul className="m-chips">
              {results.people.map((person) => (
                <li key={person.slug}><Link className="m-chip-button" to={`/people/${person.slug}`}>{person.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {results?.works.length > 0 && (
          <section className="m-block" aria-labelledby="song-results">
            <h2 id="song-results" className="m-subhead">Songs</h2>
            <ul className="m-list">
              {results.works.map((work) => <SongRow key={work.slug} work={work} note={work.summary} />)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
