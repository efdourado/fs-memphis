import { Link } from 'react-router-dom';

export const Loading = () => (
  <div className="p-state p-state--center" role="status" aria-live="polite">
    <span className="p-loader" aria-hidden="true" />
    <span>Loading…</span>
  </div>
);

export const ErrorState = ({ message, onRetry, notFound }) => (
  <div className="p-page p-page--read" role="alert">
    <div className="p-state">
      <p>{notFound ? 'That page isn’t on the shelf.' : message}</p>
      {notFound
        ? <Link className="p-btn" to="/">Back to the songs</Link>
        : onRetry && <button type="button" className="p-btn" onClick={onRetry}>Try again</button>}
    </div>
  </div>
);
