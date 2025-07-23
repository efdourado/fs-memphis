const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() || '0';
};

export const normalizeDataForPage = (type, data) => {
  if (!data) return null;

  switch (type) {
    case 'artist':
      return {
        pageType: 'Artist',
        title: data.name,
        description: data.artistProfile?.description,
        
        backgroundImage: data.profilePic,
        
        mainContent: {
          title: 'Popular Songs',
          type: 'songs',
          items: data.topSongs || [],
        },
        subContent: {
          title: 'Albums',
          type: 'album',
          items: data.albums || [],
        },

        stats: [
          { label: 'Followers', value: formatNumber(data.followers?.length || 0) },
        ],
        isVerified: data.artistProfile?.verified,
      };

    case 'album':
      const albumType = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Album';
      return {
        pageType: 'albumType',
        title: data.title,
        description: `${albumType} by ${data.artist?.name || 'Unknown Artist'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Songs',
          type: 'songs',
          items: data.songs || [],
        },

        subContent: null,

        stats: [
          { label: 'Released', value: new Date(data.releaseDate).getFullYear() },
          { label: 'Songs', value: data.songs?.length || 0 },
        ],
        isVerified: data.artist?.artistProfile?.verified,
      };

    case 'playlist':
      return {
        pageType: 'Playlist',
        title: data.name,
        description: data.description || `A playlist by ${data.owner?.name || 'Unknown'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Songs',
          type: 'songs',

          items: data.songs ? data.songs.map(item => item.song).filter(Boolean) : [],
        },
        subContent: null,

        stats: [
          { value: 'Playlist by', label: data.owner?.name || 'Anonymous' },
          { label: 'Songs', value: data.songs?.length || 0 },
        ],
        isVerified: false,
      };

    default:
      return null;
} };