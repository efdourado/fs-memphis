import { useLibrary } from '../LibraryContext';
import { BookmarkIcon } from '../shell/Icons';

export function SaveButton({ slug, compact = false }) {
  const { saved, toggleSave } = useLibrary();
  const isSaved = saved.has(slug);
  return (
    <button
      type="button"
      className={`m-button${isSaved ? ' is-on' : ''}${compact ? ' m-button--icon' : ''}`}
      onClick={() => toggleSave(slug)}
      aria-pressed={isSaved}
      aria-label={compact ? (isSaved ? 'Saved' : 'Save song') : undefined}
    >
      <BookmarkIcon filled={isSaved} size={18} />
      {!compact && (isSaved ? 'Saved' : 'Save')}
    </button>
  );
}

export function FollowButton({ slug, name }) {
  const { following, toggleFollow } = useLibrary();
  const isFollowing = following.has(slug);
  return (
    <button
      type="button"
      className={`m-chip-button${isFollowing ? ' is-on' : ''}`}
      onClick={() => toggleFollow(slug)}
      aria-pressed={isFollowing}
      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} ${name}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
