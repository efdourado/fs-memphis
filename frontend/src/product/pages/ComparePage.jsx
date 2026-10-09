import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource, yearOf } from '../hooks';
import AttentionChart from '../components/AttentionChart';
import Cover from '../components/Cover';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';

function Picker({ works, name, value, other, onChange }) {
  return (
    <label className="m-select">
      <span className="sr-only">{name === 'a' ? 'First song' : 'Second song'}</span>
      <select value={value || ''} onChange={(event) => onChange(name, event.target.value)}>
        <option value="" disabled>Choose a song</option>
        {works.map((w) => (
          <option key={w.slug} value={w.slug} disabled={w.slug === other}>{w.title} — {w.artist}</option>
        ))}
      </select>
    </label>
  );
}

function Side({ note }) {
  if (!note) return <div className="m-compare__cell m-muted">Not described yet</div>;
  return (
    <div className="m-compare__cell">
      <p>{note.body}</p>
      <Status status={note.status} />
    </div>
  );
}

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
    <div className="m-page">
      <h1 className="m-title">Compare</h1>
      <p className="m-muted">Two songs on the same dimensions. Nothing is scored; differences are described.</p>

      {works.data && (
        <div className="m-compare__pickers">
          <Picker works={works.data} name="a" value={a} other={b} onChange={choose} />
          <span className="m-muted" aria-hidden="true">and</span>
          <Picker works={works.data} name="b" value={b} other={a} onChange={choose} />
        </div>
      )}

      {!ready && <p className="m-state">Choose two different songs to compare.</p>}
      {ready && result.loading && <Loading />}
      {ready && result.error && <ErrorState message={result.error} onRetry={result.reload} />}

      {data && (
        <>
          <div className="m-compare__grid m-compare__heads">
            {[data.a, data.b].map((work) => (
              <Link key={work.slug} to={`/songs/${work.slug}`} className="m-compare__head">
                <Cover slug={work.slug} title={work.title} />
                <span>
                  <strong>{work.title}</strong>
                  <span className="m-muted">{work.artist} · {yearOf(work.released)}</span>
                </span>
              </Link>
            ))}
          </div>

          <section className="m-block" aria-labelledby="dimensions-title">
            <h2 id="dimensions-title" className="m-subhead">Side by side</h2>
            <dl className="m-compare__rows">
              {data.dimensions.map((dimension) => (
                <div key={dimension.label} className="m-compare__row">
                  <dt>{dimension.label}</dt>
                  <dd className="m-compare__grid">
                    <Side note={dimension.a} />
                    <Side note={dimension.b} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="m-block" aria-labelledby="shared-title">
            <header className="m-block__header m-block__header--row">
              <h2 id="shared-title" className="m-subhead">Shared people</h2>
              <Status status="computed" />
            </header>
            {data.sharedPeople.length ? (
              <ul className="m-chips">
                {data.sharedPeople.map((p) => (
                  <li key={p.slug}><Link className="m-chip-button" to={`/people/${p.slug}`}>{p.name}</Link></li>
                ))}
              </ul>
            ) : (
              <p className="m-muted">No credited person appears on both songs.</p>
            )}
          </section>

          <section className="m-block" aria-labelledby="attention-title">
            <header className="m-block__header m-block__header--row">
              <h2 id="attention-title" className="m-subhead">Attention over time</h2>
              <Status status="demo" />
            </header>
            <div className="m-compare__grid">
              {[['a', data.a], ['b', data.b]].map(([key, work]) => (
                <div key={key} className="m-panel">
                  <strong>{work.title}</strong>
                  <AttentionChart
                    compact
                    points={data.attention[key].points}
                    label={`${work.title}: ${data.attention[key].reading.label}`}
                  />
                  <p><strong>{data.attention[key].reading.label}.</strong> <span className="m-muted">{data.attention[key].reading.explanation}</span></p>
                </div>
              ))}
            </div>
            <p className="m-small m-muted">Demo curves. The pattern names are computed from them and describe the illustration, not real listening.</p>
          </section>
        </>
      )}
    </div>
  );
}
