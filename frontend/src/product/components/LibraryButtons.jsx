import { useLibrary } from '../LibraryContext';

export function SaveButton({ slug }) {
  const { saved, toggleSave } = useLibrary();
  const isSaved = saved.has(slug);
  return (
    <button
      type="button"
      className={`p-btn${isSaved ? ' p-btn--quiet' : ' p-btn--fill'}`}
      onClick={() => toggleSave(slug)}
      aria-pressed={isSaved}
    >
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}

export function FollowButton({ slug, name }) {
  const { following, toggleFollow } = useLibrary();
  const isFollowing = following.has(slug);
  return (
    <button
      type="button"
      className={`p-btn p-btn--small${isFollowing ? ' p-btn--quiet' : ''}`}
      onClick={() => toggleFollow(slug)}
      aria-pressed={isFollowing}
      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} ${name}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
