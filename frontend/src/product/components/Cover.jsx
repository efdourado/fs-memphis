import fallbackImage from '/fb.jpg';

// Memphis does not host artwork it has no licence for. Songs get the original
// generated vinyl artwork; people get the dragon.
export const coverUrl = (slug) => `/api/demo/cover/${slug}.svg`;

const showDragon = (event) => { event.target.src = fallbackImage; };

export default function Cover({ slug, title, variant = '' }) {
  return (
    <img
      className={`p-cov${variant ? ` p-cov--${variant}` : ''}`}
      src={coverUrl(slug)}
      alt={title ? `Artwork for ${title}` : ''}
      loading="lazy"
      onError={showDragon}
    />
  );
}

export function Face({ variant = 'round' }) {
  return <img className={`p-cov p-cov--${variant}`} src={fallbackImage} alt="" loading="lazy" />;
}
