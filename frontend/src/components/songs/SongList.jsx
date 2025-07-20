import React, { useState } from "react";
import PropTypes from "prop-types";
import SongItem from "./SongItem";

const SongList = ({
  title,
  songs = [],
  onMenuClick,
  loading = false,
  initialItems = 10,
  showHeader = true,
  displayAll = false,
  showNumber = false,
  showImage = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return <div className="song-list-loading">Loading songs...</div>;
  }
  
  const safeSongs = Array.isArray(songs) ? songs : [];

  if (safeSongs.length === 0) {
    return <div className="song-list-empty">No songs available in this list.</div>;
  }

  const displayedSongs = displayAll || showAll ? safeSongs : safeSongs.slice(0, initialItems);
  const showToggleButton = !displayAll && safeSongs.length > initialItems;

  return (
    <section className="song-list">
      {showHeader && title && (
        <div className="song-list__header">
          <h2 className="song-list__title">{title}</h2>
        </div>
      )}

      <div className="song-list__container">
        {displayedSongs.map((song, index) => (
          <SongItem
            key={song?._id || index}
            song={song}
            index={index}
            showImage={showImage}
            showNumber={showNumber}
            onMenuClick={onMenuClick}
          />
        ))}
      </div>

      {showToggleButton && (
        <div className="song-list__footer">
          <button
            className="song-list__toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${safeSongs.length} Songs`}
          </button>
        </div>
      )}
    </section>
); };

SongList.propTypes = {
  title: PropTypes.string,
  songs: PropTypes.array,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
  showHeader: PropTypes.bool,
  displayAll: PropTypes.bool,
  showNumber: PropTypes.bool,
  showImage: PropTypes.bool,
};

export default SongList;