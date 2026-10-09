import { usePageTitle } from '../hooks';
import { ErrorState } from '../components/States';

export default function NotFoundPage() {
  usePageTitle('Not found');
  return (
    <div className="m-page m-page--narrow">
      <ErrorState notFound />
    </div>
  );
}
