import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { usePageTitle, useResource } from '../hooks';
import { FollowButton } from '../components/LibraryButtons';
import SongRow from '../components/SongRow';
import Status from '../components/Status';
import { ErrorState, Loading } from '../components/States';

export default function PersonPage() {
  const { slug } = useParams();
  const { data: person, loading, error, status, reload } = useResource(() => api.person(slug), [slug]);
  usePageTitle(person?.name);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} notFound={status === 404} />;

  const roles = [...new Set(person.credits.flatMap((c) => c.roles))];

  return (
    <div className="m-page m-page--narrow">
      <header className="m-person__header">
        <h1 className="m-display">{person.name}</h1>
        {person.alsoKnownAs.length > 0 && <p className="m-muted">Credited as {person.alsoKnownAs.join(', ')}</p>}
        <p className="m-lede">{roles.join(' · ')}</p>
        <div className="m-actions">
          <FollowButton slug={person.slug} name={person.name} />
        </div>
        <p className="m-small m-muted">
          Follow to hear when Memphis adds context or another work that credits {person.name}.
        </p>
      </header>

      <section className="m-block" aria-labelledby="credits-title">
        <header className="m-block__header m-block__header--row">
          <h2 id="credits-title">In the collection</h2>
          <Status status="computed" />
        </header>
        <p className="m-small m-muted">Listed from the verified credits of each song.</p>
        <ul className="m-list">
          {person.credits.map(({ work, roles: workRoles }) => (
            <SongRow key={work.slug} work={work} note={workRoles.join(', ')} />
          ))}
        </ul>
      </section>

      {person.collaborators.length > 0 && (
        <section className="m-block" aria-labelledby="collab-title">
          <header className="m-block__header m-block__header--row">
            <h2 id="collab-title">Worked with</h2>
            <Status status="computed" />
          </header>
          <ul className="m-collaborators">
            {person.collaborators.map((c) => (
              <li key={c.slug}>
                <Link to={`/people/${c.slug}`}>{c.name}</Link>
                <span className="m-muted">{c.works.join(', ')}</span>
              </li>
            ))}
          </ul>
          <p className="m-small m-muted">A shared credit shows who worked together, not that their music sounds alike.</p>
        </section>
      )}

      <section className="m-block" aria-labelledby="bio-title">
        <header className="m-block__header m-block__header--row">
          <h2 id="bio-title">Biography</h2>
          <Status status="awaiting" />
        </header>
        <p className="m-muted">Memphis has not written a sourced biography for {person.name} yet, so it shows none.</p>
      </section>
    </div>
  );
}
