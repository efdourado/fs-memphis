import { NavLink } from 'react-router-dom';

const primaryLinks = [
  { to: '/atlas', label: 'Atlas', end: true },
  { to: '/stories/pop-youth', label: 'Stories' },
  { to: '/genres/pop', label: 'Genres' },
  { to: '/people/benny-blanco', label: 'People' },
  { to: '/picks', label: 'Memphis Picks' },
];

const KnowledgeNav = () => (
  <header className="knowledge-nav-shell">
    <NavLink className="knowledge-nav__brand" to="/atlas" aria-label="Memphis Atlas home">
      <span className="knowledge-nav__brand-mark" aria-hidden="true">M</span>
      <span>
        <strong>Memphis</strong>
        <small>Knowledge atlas</small>
      </span>
    </NavLink>

    <nav className="knowledge-nav" aria-label="Knowledge atlas">
      {primaryLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => (
            `knowledge-nav__link${isActive ? ' is-active' : ''}`
          )}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>

    <NavLink className="knowledge-nav__personal" to="/today">
      My Memphis
      <span aria-hidden="true">↗</span>
    </NavLink>
  </header>
);

export default KnowledgeNav;
