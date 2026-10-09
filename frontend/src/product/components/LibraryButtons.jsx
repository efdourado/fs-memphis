import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { useLibrary } from '../LibraryContext';

export function SaveButton({ slug, compact = false }) {
  const { saved, toggleSave } = useLibrary();
  const isSaved = saved.has(slug);
  return (
    <button
      type="button"
      className={`p-pill${isSaved ? ' p-pill--solid' : ''}${compact ? ' p-pill--icon' : ''}`}
      onClick={() => toggleSave(slug)}
      aria-pressed={isSaved}
      aria-label={compact ? (isSaved ? 'Remove from library' : 'Save to library') : undefined}
    >
      <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmark} />
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
      className={`login-btn p-follow${isFollowing ? ' always-hover' : ''}`}
      onClick={() => toggleFollow(slug)}
      aria-pressed={isFollowing}
      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} ${name}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
