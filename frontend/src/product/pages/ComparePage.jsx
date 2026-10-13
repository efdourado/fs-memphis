import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource, yearOf } from '../hooks';
import Cover from '../components/Cover';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';

function Picker({ works, name, value, other, onChange }) {
  return (
    <label>
      <span className="sr-only">{name === 'a' ? 'First song' : 'Second song'}</span>
      <select id={`compare-${name}`} className="p-input" value={value || ''} onChange={(event) => onChange(name, event.target.value)}>
        <option value="" disabled>Pick a song</option>
        {works.map((w) => <option key={w.slug} value={w.slug} disabled={w.slug === other}>{w.title} · {w.artist}</option>)}
      </select>
    </label>
  );
}

const Cell = ({ note }) => (note ? (
  <div className="p-compare__cell"><p>{note.body}</p><Status status={note.status} /></div>
) : <p className="p-muted">Not described yet</p>);

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const a = params.get('a');
  const b = params.get('b');
  const works = useResource(() => api.works(), []);
  const ready = a && b && a !== b;
  const result = useResource(() => (ready ? api.compare(a, b) : Promise.resolve(null)), [a, b]);
  const data = result.data;
  usePageTitle(data ? `${data.a.title} and ${data.b.title}` : 'Compare');

  const choose = (name, slug) => {
    const next = { a, b, [name]: slug };
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));
  };

  return (
    <div className="p-page p-page--read" style={{ gap: 32 }}>
      <h1 className="p-lg">Side by side</h1>

      {works.data && (
        <div className="p-pickers">
          <Picker works={works.data} name="a" value={a} other={b} onChange={choose} />
          <span className="p-muted">and</span>
          <Picker works={works.data} name="b" value={b} other={a} onChange={choose} />
        </div>
      )}

      {!ready && <p className="p-notice">Pick two songs.</p>}
      {ready && result.loading && <Loading />}
      {ready && result.error && <ErrorState message={result.error} onRetry={result.reload} />}

      {data && (
        <div className="p-compare">
          {[data.a, data.b].map((work) => (
            <Link key={work.slug} to={`/songs/${work.slug}`} className="p-tile" style={{ width: 'auto', maxWidth: 200 }}>
              <Cover slug={work.slug} title={work.title} />
              <p>{work.title}</p>
              <span>{work.artist} · {yearOf(work.released)}</span>
            </Link>
          ))}
          {data.dimensions.map((dimension) => [
            <p key={dimension.label} className="p-compare__label">{dimension.label}</p>,
            <Cell key={`${dimension.label}-a`} note={dimension.a} />,
            <Cell key={`${dimension.label}-b`} note={dimension.b} />,
          ])}
          <p className="p-compare__label">People on both</p>
          <div style={{ gridColumn: '1 / -1' }}>
            {data.sharedPeople.length ? (
              <div className="p-chips">
                {data.sharedPeople.map((p) => <Link key={p.slug} className="p-btn p-btn--quiet p-btn--small" to={`/people/${p.slug}`}>{p.name}</Link>)}
              </div>
            ) : <p className="p-muted">Nobody is credited on both.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
