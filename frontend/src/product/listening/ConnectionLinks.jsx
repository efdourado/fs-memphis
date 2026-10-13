import { Link } from 'react-router-dom';
import { connections, connectionsForSong } from './connections';
import { sessionFor } from './edition';
import { useNotebook } from './NotebookContext';

export default function ConnectionLinks({ slug, compact = false }) {
  const { notebook } = useNotebook();
  const items = slug ? connectionsForSong(slug) : connections;
  return <section className={`m-connections-entry ${compact ? 'm-connections-entry--compact' : ''}`} aria-label="The listening table">
    <div className="m-connections-entry__intro"><p className="m-kicker">The listening table · Hear the connection</p><h2>{slug ? 'Take this idea into another song.' : 'Put two ideas on the same table.'}</h2><p>Play two original sketches. Follow the contrast. Keep what catches your ear.</p></div>
    <div className="m-connection-links">{items.map((item, index) => <Link to={`/connections/${item.id}`} key={item.id}>
      <span className="m-connection-links__number" aria-hidden="true">0{index + 1}</span>
      <div><span className="m-kicker">{item.theme}{notebook.discoveries.some(discovery => discovery.id === item.id) ? ' · In your notebook' : ''}</span><h3>{item.title}</h3><p>{item.sides.map(side => sessionFor(side.slug).title).join(' ↔ ')}</p></div><span aria-hidden="true">↗</span>
    </Link>)}</div>
  </section>;
}
