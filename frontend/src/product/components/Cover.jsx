import fallbackImage from '/fb.jpg';

// Memphis does not host artwork it has no licence for. Songs use the same
// generated vinyl artwork as the original interface; the dragon covers the rest.
export const coverUrl = (slug) => `/api/demo/cover/${slug}.svg`;

const showDragon = (event) => { event.target.src = fallbackImage; };

export default function Cover({ slug, title, size = 'md' }) {
  return (
    <img
      className={`p-cover p-cover--${size}`}
      src={coverUrl(slug)}
      alt={title ? `Artwork for ${title}` : ''}
      onError={showDragon}
    />
  );
}

export function Avatar({ name, size = 'md' }) {
  return <img className={`p-avatar p-avatar--${size}`} src={fallbackImage} alt={name ? `${name}` : ''} />;
}
