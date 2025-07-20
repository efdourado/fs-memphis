import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import Card from '../../../components/ui/Card';

const Carousel = ({ title, items, type }) => {
  const [showFade, setShowFade] = useState(true);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const isAtEnd = Math.ceil(el.scrollLeft) + el.clientWidth >= el.scrollWidth;
      setShowFade(!isAtEnd);
  } };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      
      const timer = setTimeout(() => handleScroll(), 100);

      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        clearTimeout(timer);
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
  }; } }, [items]);

  return (
    <section className="carousel">
      <div className="carousel__header">
        <h2 className="carousel__title">{title}</h2>
      </div>
 
      <div className={`carousel__items-container ${showFade ? '' : 'hide-fade'}`}>
        <div
          ref={scrollContainerRef}
          className="carousel__items"
        >
          {items.map((item) => (
            <Card key={item._id} item={item} type={type} />
          ))}
        </div>
      </div>
    </section>
); };

Carousel.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
};

export default Carousel;