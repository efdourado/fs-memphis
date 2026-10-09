import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { api, errorMessage } from '../api';
import { usePageTitle } from '../hooks';
import { PersonCard, Row, SongCard } from '../components/Cards';

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
    <div className="p-page">
      <h1 className="p-page-title">Search</h1>
      <form className="p-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <FontAwesomeIcon icon={faSearch} />
        <input
          ref={inputRef}
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Songs, artists, producers..."
          aria-label="Search"
        />
      </form>

      {!query && (
        <div className="p-chips p-suggestions">
          {SUGGESTIONS.map((s) => <button type="button" key={s} className="p-pill" onClick={() => setText(s)}>{s}</button>)}
        </div>
      )}

      {error && <p className="p-empty" role="alert">{error}</p>}

      <div aria-live="polite">
        {empty && <p className="p-empty">Nothing for “{query}” yet. Memphis is starting small — ten songs, done properly.</p>}
        {results?.works.length > 0 && (
          <Row title="Songs">{results.works.map((work) => <SongCard key={work.slug} work={work} />)}</Row>
        )}
        {results?.people.length > 0 && (
          <Row title="People">{results.people.map((person) => <PersonCard key={person.slug} person={person} subtitle="See their songs" />)}</Row>
        )}
      </div>
    </div>
  );
}
