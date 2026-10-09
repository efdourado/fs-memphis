export const STATUS_INFO = {
  verified: { label: 'Fact', description: 'Backed by the source linked next to it.' },
  editorial: { label: 'Our take', description: 'How we hear it. An opinion, not a fact.' },
  computed: { label: 'Calculated', description: 'Worked out from the data on this page.' },
  demo: { label: 'Demo', description: 'Example data while we wire up the real thing.' },
  awaiting: { label: 'No source yet', description: "We'd rather leave it blank than guess." },
};

export default function Status({ status, source }) {
  const info = STATUS_INFO[status] || { label: status, description: '' };
  return (
    <span className={`p-status p-status--${status}`} title={info.description}>
      <span className="p-status__dot" aria-hidden="true" />
      {info.label}
      {source && status === 'verified' && (
        source.url
          ? <a href={source.url} target="_blank" rel="noreferrer">{source.publisher || source.title}</a>
          : <span>{source.publisher || source.title}</span>
      )}
    </span>
  );
}
