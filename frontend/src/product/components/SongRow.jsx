import { Link } from 'react-router-dom';
import { yearOf } from '../hooks';
import Cover from './Cover';

export default function SongRow({ work, note, children }) {
  return (
    <li className="m-row">
      <Link to={`/songs/${work.slug}`} className="m-row__link">
        <Cover slug={work.slug} title={work.title} />
        <span className="m-row__text">
          <strong>{work.title}</strong>
          <span className="m-muted">{work.artist} · {yearOf(work.released)}</span>
          {note && <span className="m-row__note">{note}</span>}
        </span>
      </Link>
      {children}
    </li>
  );
}
