export const STATUS_INFO = {
  verified: { label: 'Fact', description: 'Backed by the source linked next to it.' },
  editorial: { label: 'Our take', description: 'How we hear it. An opinion, not a fact.' },
  computed: { label: 'Worked out', description: 'Calculated from other facts on the page.' },
  demo: { label: 'Example', description: 'Shown to explain the layout. Not real data.' },
  awaiting: { label: 'Not documented', description: 'We’d rather leave it open than guess.' },
};

// A small tag that stays next to the line it describes.
export default function Status({ status, source, label }) {
  const info = STATUS_INFO[status] || { label: status, description: '' };
  return (
    <span className={`p-tag p-tag--${status}`} title={info.description}>
      {label || info.label}
      {source && status === 'verified' && (
        <>
          {' · '}
          {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.publisher || source.title}</a> : source.publisher}
        </>
      )}
    </span>
  );
}
