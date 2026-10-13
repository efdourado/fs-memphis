import { Link } from 'react-router-dom';
import Cover, { Face } from './Cover';

// A song on a shelf. The line under the title is the one idea you'll learn.
export function SongTile({ work, note, big = false }) {
  return (
    <Link to={`/songs/${work.slug}`} className={`p-tile${big ? ' p-tile--big' : ''}`}>
      <Cover slug={work.slug} />
      <p>{work.title}</p>
      <span>{note ?? (work.hook || work.artist)}</span>
    </Link>
  );
}

export function PersonTile({ person, note }) {
  return (
    <Link to={`/people/${person.slug}`} className="p-tile">
      <Face />
      <p>{person.name}</p>
      {note && <span>{note}</span>}
    </Link>
  );
}

export function Shelf({ title, aside, children }) {
  return (
    <section className="p-sec">
      <div className="p-rowhead">
        <h2 className="p-md">{title}</h2>
        {aside}
      </div>
      <div className="p-shelf">{children}</div>
    </section>
  );
}
