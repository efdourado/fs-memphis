import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../api';
import { formatDate, usePageTitle, useResource } from '../hooks';
import Cover, { Face } from '../components/Cover';
import { ErrorState, Loading } from '../components/States';
import { useLibrary } from '../LibraryContext';

export default function UpdatesPage() {
  usePageTitle('What’s new');
  const { isAuthenticated } = useAuth();
  const { setUnseen } = useLibrary();
  const { data, loading, error, reload } = useResource(() => api.updates(), [isAuthenticated]);

  // Opening the page counts as seeing what is new.
  useEffect(() => {
    if (!isAuthenticated || !data?.unseen) return;
    api.markUpdatesSeen().then(() => setUnseen(0)).catch(() => {});
  }, [isAuthenticated, data, setUnseen]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="p-page p-page--read" style={{ gap: 28 }}>
      <h1 className="p-lg">What’s new</h1>
      <ul className="p-rows">
        {data.items.map((update) => (
          <li key={update.key}>
            <Link to={update.link}>
              {update.workSlugs[0] ? <Cover slug={update.workSlugs[0]} variant="thumb" /> : <Face variant="thumb" />}
              <span>
                <span>{update.title}{update.isNew && <span className="p-dot" />}</span>
                <span>{update.body}</span>
                <span className="p-mono">{formatDate(update.date)}{update.relevant ? ' · on your shelf' : ''}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
