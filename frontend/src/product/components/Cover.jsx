// Memphis does not host artwork it has no licence for. Each song gets a quiet
// typographic tile whose hue is derived from its slug.
const hueOf = (text) => [...text].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 360, 7);

// First and last word of the title, ignoring any parenthetical subtitle.
const initials = (title) => {
  const words = title
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const picked = words.length > 1 ? [words[0], words.at(-1)] : words;
  return picked.map((word) => word[0].toUpperCase()).join('');
};

export default function Cover({ slug, title, size = 'md' }) {
  return (
    <span className={`m-cover m-cover--${size}`} style={{ '--cover-hue': hueOf(slug) }} aria-hidden="true">
      {initials(title)}
    </span>
  );
}
