import { useParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource } from '../hooks';
import { PersonCard, Row, SongCard } from '../components/Cards';
import { Avatar } from '../components/Cover';
import { FollowButton } from '../components/LibraryButtons';
import { ErrorState, Loading } from '../components/States';

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
      <header className="p-person">
        <Avatar name={person.name} size="xl" />
        <div>
          <p className="p-eyebrow">{roles.slice(0, 3).join(' • ')}</p>
          <h1 className="p-song__title">{person.name}</h1>
          {person.alsoKnownAs.length > 0 && <p className="p-song__meta">Credited as {person.alsoKnownAs.join(', ')}</p>}
          <p className="p-song__summary">
            On {count} {count === 1 ? 'song' : 'songs'} in Memphis. Follow to hear when there’s more.
          </p>
          <div className="p-actions">
            <FollowButton slug={person.slug} name={person.name} />
          </div>
        </div>
      </header>

      <Row title="Songs">
        {person.credits.map(({ work, roles: workRoles }) => (
          <SongCard key={work.slug} work={work} subtitle={`${work.artist} • ${workRoles.join(', ')}`} />
        ))}
      </Row>

      {person.collaborators.length > 0 && (
        <Row title="Worked with">
          {person.collaborators.map((c) => (
            <PersonCard key={c.slug} person={c} subtitle={c.works.join(', ')} />
          ))}
        </Row>
      )}

      <p className="p-fine p-page-note">
        Everything here comes from the song credits. We haven’t written a bio for {person.name} yet — we’d rather wait for good sources.
      </p>
    </div>
  );
}
