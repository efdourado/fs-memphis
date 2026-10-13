import { useParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource } from '../hooks';
import { Face } from '../components/Cover';
import { FollowButton } from '../components/LibraryButtons';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';
import { PersonTile, Shelf, SongTile } from '../components/Tiles';

export default function PersonPage() {
  const { slug } = useParams();
  const { data: person, loading, error, status, reload } = useResource(() => api.person(slug), [slug]);
  usePageTitle(person?.name);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} notFound={status === 404} />;

  const roles = [...new Set(person.credits.flatMap((c) => c.roles))];
  const count = person.credits.length;

  return (
    <div className="p-page">
      <header className="p-songtop">
        <Face />
        <div className="p-stack">
          <p className="p-muted">{roles.slice(0, 4).join(' · ')}</p>
          <h1 className="p-xl">{person.name}</h1>
          {person.alsoKnownAs.length > 0 && <p className="p-small">Credited as {person.alsoKnownAs.join(', ')}</p>}
          <dl className="p-figs" style={{ width: '100%', maxWidth: 360 }}>
            <div><dt>{count === 1 ? 'song on the shelf' : 'songs on the shelf'}</dt><dd>{count}</dd></div>
            <div><dt>people worked with</dt><dd>{person.collaborators.length}</dd></div>
          </dl>
          <FollowButton slug={person.slug} name={person.name} />
        </div>
      </header>

      <Shelf title="Songs" aside={<Status status="computed" label="From the song credits" />}>
        {person.credits.map(({ work, roles: workRoles }) => (
          <SongTile key={work.slug} work={work} note={workRoles.join(', ')} big />
        ))}
      </Shelf>

      {person.collaborators.length > 0 && (
        <Shelf title="Worked with">
          {person.collaborators.map((c) => <PersonTile key={c.slug} person={c} note={c.works.join(', ')} />)}
        </Shelf>
      )}

      <p className="p-notice">No biography yet. Everything on this page comes from the credits of songs on the shelf.</p>
    </div>
  );
}
