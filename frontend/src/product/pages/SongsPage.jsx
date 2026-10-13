import { Link } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource } from '../hooks';
import { ErrorState, Loading } from '../components/States';
import { PersonTile, Shelf, SongTile } from '../components/Tiles';

export default function SongsPage() {
  usePageTitle('');
  const works = useResource(() => api.works(), []);
  const people = useResource(() => api.people(), []);

  const all = works.data || [];
  const known = all.filter((work) => work.room !== 'unheard');
  const full = known.filter((work) => work.depth === 'full');
  const short = known.filter((work) => work.depth !== 'full');
  const unheard = all.filter((work) => work.room === 'unheard');
  const start = full.find((work) => work.slug === 'dreams') || full[0];

  return (
    <div className="p-page">
      <section className="p-hero">
        <h1 className="p-xl">Hear how it’s made.</h1>
        <p className="p-lede">Pick a song. See what’s in it, who put it there and how they did it.</p>
        <div className="p-btns">
          {start && <Link className="p-btn p-btn--fill" to={`/songs/${start.slug}`}>Start with {start.title}</Link>}
          <Link className="p-btn" to="/updates">What’s new</Link>
        </div>
      </section>

      {works.loading && <Loading />}
      {works.error && <ErrorState message={works.error} onRetry={works.reload} />}

      {works.data && (
        <>
          <Shelf title="Opened up" aside={<span>{full.length} songs, all the way down</span>}>
            {full.map((work) => <SongTile key={work.slug} work={work} big />)}
          </Shelf>

          <section className="p-sec">
            <div className="p-rowhead">
              <h2 className="p-md">Unheard</h2>
              <Link to="/unheard">How it works</Link>
            </div>
            {unheard.length > 0 ? (
              <div className="p-shelf">{unheard.map((work) => <SongTile key={work.slug} work={work} big />)}</div>
            ) : (
              <div className="p-card p-pad p-stack">
                <p className="p-stand">Songs nobody is promoting, chosen for how they’re made. No charts, no play counts.</p>
                <p className="p-small">The room is open and still empty. If you made a song, tell us how you did it.</p>
                <Link className="p-btn" to="/unheard">Send a song</Link>
              </div>
            )}
          </section>

          <Shelf title="Next on the shelf" aside={<span>Short pages for now</span>}>
            {short.map((work) => <SongTile key={work.slug} work={work} />)}
          </Shelf>

          {people.data?.length > 0 && (
            <Shelf title="The people behind them">
              {people.data.slice(0, 12).map((person) => (
                <PersonTile
                  key={person.slug}
                  person={person}
                  note={person.songs > 1 ? `${person.songs} songs here` : person.roles.slice(0, 2).join(', ')}
                />
              ))}
            </Shelf>
          )}
        </>
      )}
    </div>
  );
}
