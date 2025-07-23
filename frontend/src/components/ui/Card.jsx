import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import fallbackImage from '/fb.jpg';

const Card = ({ item, type, displayArtistName = true }) => {
  if (!item) return null;

  const isArtistCard = type === 'artist';

  const displayTitle = isArtistCard ? item.name : (item.title || item.name);
  const imageUrl = isArtistCard ? item.profilePic : (item.coverImage || item.image);
  const detailPath = `/${type}/${item._id}`;

  let subtitle = '';
  switch (type) {
    case 'artist':
      subtitle = 'Artist';
      break;
    case 'album':
      const artistName = item.artist?.name || 'Unknown';
      const albumType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Album';
      subtitle = displayArtistName ? `${albumType} • ${artistName}` : albumType;
      break;
    case 'playlist':
      subtitle = `Playlist • ${item.owner?.name || 'Unknown'}`;
      break;
    case 'song':
       subtitle = displayArtistName ? `Single • ${item.artist?.name || 'Unknown'}` : 'Single';
      break;
    default:
      subtitle = '';
  }

  return (
    <div className={`card ${isArtistCard ? 'card--artist' : ''}`}>
      <Link to={detailPath} className="card__link">
        <div className="card__image-container">
          <img
            className="card__image"
            src={imageUrl || fallbackImage}
            alt={displayTitle}
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>
        <div className="card__info">
          <h3 className="card__title" title={displayTitle}>
            {displayTitle}
          </h3>
          <p className="card__subtitle" title={subtitle}>
            {subtitle}
          </p>
        </div>
      </Link>
    </div>
); };

Card.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    image: PropTypes.string,
    profilePic: PropTypes.string,
    type: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string,
    }),
    owner: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
  displayArtistName: PropTypes.bool,
};

export default Card;