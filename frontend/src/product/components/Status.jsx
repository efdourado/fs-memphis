export const STATUS_INFO = {
  verified: { label: 'Verified', description: 'Supported by the source named beside it.' },
  editorial: { label: 'Editorial', description: 'A Memphis listening reading, not a documented fact.' },
  computed: { label: 'Computed', description: 'Derived from other data by a method shown on the page.' },
  demo: { label: 'Demo data', description: 'Illustrative only. Not measured from a real source.' },
  awaiting: { label: 'Awaiting sources', description: 'A deliberate gap. Nothing is invented to fill it.' },
};

// A small label that stays next to the claim it describes.
export default function Status({ status, source }) {
  const info = STATUS_INFO[status] || { label: status, description: '' };
  return (
    <span className={`m-status m-status--${status}`} title={info.description}>
      <span className="m-status__dot" aria-hidden="true" />
      {info.label}
      {source && status === 'verified' && (
        <>
          <span aria-hidden="true">·</span>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer">{source.publisher || source.title}</a>
          ) : (
            <span>{source.publisher || source.title}</span>
          )}
        </>
      )}
    </span>
  );
}
