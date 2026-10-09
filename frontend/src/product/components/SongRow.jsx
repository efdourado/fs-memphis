import { Link } from 'react-router-dom';
import { yearOf } from '../hooks';
import Cover from './Cover';

// A track-list row, like the lists under the original featured collections.
export default function SongRow({ work, note, children }) {
  return (
    <li className="p-song-row">
      <Link to={`/songs/${work.slug}`} className="p-song-row__link">
        <Cover slug={work.slug} title={work.title} size="sm" />
        <span className="p-song-row__text">
          <strong>{work.title}</strong>
          <span>{work.artist} • {yearOf(work.released)}</span>
          {note && <span className="p-song-row__note">{note}</span>}
        </span>
      </Link>
      {children}
    </li>
  );
}
