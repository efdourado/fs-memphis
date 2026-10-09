import { Link } from 'react-router-dom';

export const Loading = ({ label = 'Loading' }) => (
  <div className="m-state" role="status" aria-live="polite">
    <span className="m-loader" aria-hidden="true" />
    <span>{label}…</span>
  </div>
);

export const ErrorState = ({ message, onRetry, notFound }) => (
  <div className="m-state m-state--error" role="alert">
    <p>{notFound ? 'This page is not in the collection.' : message}</p>
    {notFound ? <Link className="m-button" to="/">Back to Discover</Link> : onRetry && (
      <button type="button" className="m-button" onClick={onRetry}>Try again</button>
    )}
  </div>
);
