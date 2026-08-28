import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contentLabels } from '../../data/knowledgePrototype';
import ContentBadge from './ContentBadge';
import KnowledgeNav from './KnowledgeNav';

const labelDescriptions = {
  verified: 'A claim supported by a named source.',
  prototype: 'A designed space waiting for real data.',
  editorial: 'An interpretation, never disguised as fact.',
  computed: 'A relationship with a visible method.',
  awaiting: 'A deliberate gap, not invented information.',
};

const KnowledgeFrame = ({
  children,
  eyebrow,
  title,
  description,
  status = 'prototype',
  breadcrumbs = [],
  heroAside = null,
  heroActions = null,
  className = '',
  showLegend = true,
}) => {
  const { hash, pathname } = useLocation();
  const titleRef = useRef(null);
  const pageTitle = typeof title === 'string'
    ? title
    : breadcrumbs.at(-1)?.label || 'Knowledge Atlas';

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (target) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  useEffect(() => {
    document.title = `${pageTitle} · Memphis`;
    const frame = window.requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.title = 'Memphis';
    };
  }, [pageTitle, pathname]);

  return (
    <div className={`knowledge-frame ${className}`.trim()}>
      <KnowledgeNav />

      <div className="knowledge-frame__inner">
        {breadcrumbs.length > 0 && (
          <nav className="knowledge-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/atlas">Atlas</Link>
            {breadcrumbs.map((crumb) => (
              <span key={`${crumb.label}-${crumb.to || 'current'}`}>
                <span aria-hidden="true">/</span>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <header className={`knowledge-hero${heroAside ? ' knowledge-hero--split' : ''}`}>
          <div className="knowledge-hero__copy">
            <div className="knowledge-hero__eyebrow">
              {eyebrow && <span>{eyebrow}</span>}
              <ContentBadge status={status} compact />
            </div>
            <h1 ref={titleRef} tabIndex="-1">{title}</h1>
            {description && <p>{description}</p>}
            {heroActions && <div className="knowledge-hero__actions">{heroActions}</div>}
          </div>
          {heroAside && <div className="knowledge-hero__aside">{heroAside}</div>}
        </header>

        {children}

        {showLegend && (
          <footer className="knowledge-legend">
            <div>
              <p className="knowledge-kicker">How to read Memphis</p>
              <h2>Every claim shows what it is.</h2>
            </div>
            <div className="knowledge-legend__items">
              {Object.keys(contentLabels).map((key) => (
                <div className="knowledge-legend__item" key={key}>
                  <ContentBadge status={key} compact />
                  <p>{labelDescriptions[key]}</p>
                </div>
              ))}
            </div>
            <div className="knowledge-legend__footer">
              <span>Listen wherever you choose. Understand it here.</span>
              <Link to="/design-archive">Visit the original interface archive →</Link>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default KnowledgeFrame;
