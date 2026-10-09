import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource, yearOf } from '../hooks';
import AttentionChart from '../components/AttentionChart';
import Cover from '../components/Cover';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';

function Picker({ works, name, value, other, onChange }) {
  return (
    <label className="p-select">
      <span className="sr-only">{name === 'a' ? 'First song' : 'Second song'}</span>
      <select value={value || ''} onChange={(event) => onChange(name, event.target.value)}>
        <option value="" disabled>Pick a song</option>
        {works.map((w) => (
          <option key={w.slug} value={w.slug} disabled={w.slug === other}>{w.title} — {w.artist}</option>
        ))}
      </select>
    </label>
  );
}

const Cell = ({ note }) => (note ? (
  <div className="p-compare__cell">
    <p>{note.body}</p>
    <Status status={note.status} />
  </div>
) : <div className="p-compare__cell p-dim">—</div>);

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const a = params.get('a');
  const b = params.get('b');
  const works = useResource(() => api.works(), []);
  const ready = a && b && a !== b;
  const result = useResource(() => (ready ? api.compare(a, b) : Promise.resolve(null)), [a, b]);
  const data = result.data;
  usePageTitle(data ? `${data.a.title} vs ${data.b.title}` : 'Compare');

  const choose = (name, slug) => {
    const next = { a, b, [name]: slug };
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));
  };

  return (
    <div className="p-page">
      <h1 className="p-page-title">Side by side</h1>

      {works.data && (
        <div className="p-compare__pickers">
          <Picker works={works.data} name="a" value={a} other={b} onChange={choose} />
          <span className="p-vs">vs</span>
          <Picker works={works.data} name="b" value={b} other={a} onChange={choose} />
        </div>
      )}

      {!ready && <p className="p-empty">Pick two songs.</p>}
      {ready && result.loading && <Loading />}
      {ready && result.error && <ErrorState message={result.error} onRetry={result.reload} />}

      {data && (
        <>
          <div className="p-compare__grid p-compare__heads">
            {[data.a, data.b].map((work) => (
              <Link key={work.slug} to={`/songs/${work.slug}`} className="p-compare__head">
                <Cover slug={work.slug} title={work.title} size="lg" />
                <strong>{work.title}</strong>
                <span>{work.artist} • {yearOf(work.released)}</span>
              </Link>
            ))}
          </div>

          <dl className="p-compare__rows">
            {data.dimensions.map((dimension) => (
              <div key={dimension.label} className="p-compare__row">
                <dt>{dimension.label}</dt>
                <dd className="p-compare__grid">
                  <Cell note={dimension.a} />
                  <Cell note={dimension.b} />
                </dd>
              </div>
            ))}
            <div className="p-compare__row">
              <dt>Shared people</dt>
              <dd>
                {data.sharedPeople.length ? (
                  <div className="p-chips">
                    {data.sharedPeople.map((p) => <Link key={p.slug} className="p-pill" to={`/people/${p.slug}`}>{p.name}</Link>)}
                  </div>
                ) : <p className="p-dim">Nobody is credited on both.</p>}
              </dd>
            </div>
          </dl>

          <section className="p-section">
            <div className="carousel__header">
              <h2 className="carousel__title">Attention over time</h2>
              <Status status="demo" />
            </div>
            <div className="p-compare__grid">
              {[['a', data.a], ['b', data.b]].map(([key, work]) => (
                <div key={key} className="p-panel">
                  <strong>{work.title}</strong>
                  <AttentionChart compact points={data.attention[key].points} label={`${work.title}: ${data.attention[key].reading.label}`} />
                  <p className="p-reading__small"><strong>{data.attention[key].reading.label}</strong></p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
