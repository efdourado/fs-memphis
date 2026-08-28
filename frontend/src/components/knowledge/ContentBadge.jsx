import { contentLabels } from '../../data/knowledgePrototype';

const ContentBadge = ({ status = 'prototype', compact = false }) => {
  const config = contentLabels[status] || {
    label: status,
    className: 'is-unknown',
  };

  return (
    <span
      className={`knowledge-badge ${config.className}${compact ? ' knowledge-badge--compact' : ''}`}
      data-content-status={status}
    >
      <span className="knowledge-badge__dot" aria-hidden="true" />
      {config.label}
    </span>
  );
};

export default ContentBadge;
