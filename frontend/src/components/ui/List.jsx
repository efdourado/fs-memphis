import React, { useState } from "react";
import PropTypes from "prop-types";
import Item from "./Item";

const List = ({
  title,
  items = [],
  type,
  onItemClick,
  loading = false,
  initialItems = 10,
  showHeader = true,
  displayAll = false,
  showNumber = false,
  showImage = true,
  checkAdded,
  showAlbum = false,
  showDuration = false,
  showPlays = false,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return <div className="list-loading">Loading items...</div>;
  }
  
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return <div className="list-empty">No items available in this list.</div>;
  }

  const displayedItems = displayAll || showAll ? safeItems : safeItems.slice(0, initialItems);
  const showToggleButton = !displayAll && safeItems.length > initialItems;

  return (
    <section className="list">
      {showHeader && title && (
        <div className="list__header">
          <h2 className="list__title">{title}</h2>
        </div>
      )}

      <div className="list__container">
        {displayedItems.map((item, index) => (
          <Item
            key={item?._id || index}
            item={item}
            type={type}
            index={index}
            showImage={showImage}
            showNumber={showNumber}
            onClick={onItemClick}
            isAdded={checkAdded ? checkAdded(item) : false}
            showAlbum={showAlbum}
            showDuration={showDuration}
            showPlays={showPlays}
          />
        ))}
      </div>

      {showToggleButton && (
        <div className="list__footer">
          <button
            className="list__toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'See less' : `See all ${safeItems.length} Items`}
          </button>
        </div>
      )}
    </section>
); };

List.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  type: PropTypes.oneOf(['song', 'playlist', 'album']).isRequired,
  onItemClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
  showHeader: PropTypes.bool,
  displayAll: PropTypes.bool,
  showNumber: PropTypes.bool,
  showImage: PropTypes.bool,
  checkAdded: PropTypes.func,
  showAlbum: PropTypes.bool,
  showDuration: PropTypes.bool,
  showPlays: PropTypes.bool,
};

List.defaultProps = {
  type: 'song',
};

export default List;