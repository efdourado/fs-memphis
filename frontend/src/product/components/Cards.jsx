import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { yearOf } from '../hooks';
import { coverUrl } from './Cover';
import fallbackImage from '/fb.jpg';

const onImageError = (event) => { event.target.src = fallbackImage; };

// The original Memphis card, pointed at the new song and person pages.
export function SongCard({ work, subtitle }) {
  return (
    <div className="card">
      <Link to={`/songs/${work.slug}`} className="card__link">
        <div className="card__image-container">
          <img className="card__image" src={coverUrl(work.slug)} alt="" onError={onImageError} />
        </div>
        <div className="card__info">
          <h3 className="card__title" title={work.title}>{work.title}</h3>
          <p className="card__subtitle">{subtitle || `${work.artist} • ${yearOf(work.released)}`}</p>
        </div>
      </Link>
    </div>
  );
}

export function PersonCard({ person, subtitle }) {
  return (
    <div className="card card--artist">
      <Link to={`/people/${person.slug}`} className="card__link">
        <div className="card__image-container">
          <img className="card__image" src={fallbackImage} alt="" />
        </div>
        <div className="card__info">
          <h3 className="card__title" title={person.name}>{person.name}</h3>
          <p className="card__subtitle">{subtitle}</p>
        </div>
      </Link>
    </div>
  );
}

// Same scroll row and fade as the original carousel.
export function Row({ title, action, children }) {
  const ref = useRef(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setFade(Math.ceil(el.scrollLeft) + el.clientWidth < el.scrollWidth);
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [children]);

  return (
    <section className="carousel p-row">
      <div className="carousel__header">
        <h2 className="carousel__title">{title}</h2>
        {action}
      </div>
      <div className={`carousel__items-container ${fade ? '' : 'hide-fade'}`}>
        <div ref={ref} className="carousel__items">{children}</div>
      </div>
    </section>
  );
}
