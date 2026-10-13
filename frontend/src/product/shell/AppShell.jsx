import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../LibraryContext';

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="p-icon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

// Songs: a record. Unheard: a small wave. Search and Saved are what they look like.
const ICONS = {
  songs: <Icon><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.4" /></Icon>,
  unheard: <Icon><path d="M4 12c2.2-5 4.4-5 6.6 0s4.4 5 6.6 0c.9-2 1.8-3.2 2.8-3.6" /></Icon>,
  search: <Icon><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Icon>,
  saved: <Icon><path d="M7 4.5h10v15l-5-3.5-5 3.5z" /></Icon>,
  back: <Icon><path d="M14.5 5.5 8 12l6.5 6.5" /></Icon>,
};

const SECTIONS = [
  { to: '/', label: 'Songs', icon: 'songs', end: true },
  { to: '/unheard', label: 'Unheard', icon: 'unheard' },
  { to: '/search', label: 'Search', icon: 'search', dockOnly: true },
  { to: '/saved', label: 'Saved', icon: 'saved', dot: true },
];

const isSection = (pathname) => SECTIONS.some((s) => (s.end ? pathname === s.to : pathname.startsWith(s.to)));

// One navigation. Links sit in the bar on wide screens and in a dock at the
// thumb on phones, where detail pages also get a way back.
export default function AppShell() {
  const { isAuthenticated } = useAuth();
  const { unseen } = useLibrary();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const onSection = isSection(pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-shell', 'product');
    return () => document.documentElement.removeAttribute('data-shell');
  }, []);

  useEffect(() => {
    if (hash && document.getElementById(hash.slice(1))) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="p-app">
      <header className="p-bar">
        <div className="p-bar__in">
          <Link to="/" className="p-brand">
            <img src="/memphis-logo-grey.png" alt="" />
            Memphis
          </Link>
          <nav className="p-nav" aria-label="Main">
            {SECTIONS.filter((s) => !s.dockOnly).map((s) => (
              <NavLink key={s.to} to={s.to} end={s.end}>
                {s.label}
                {s.dot && unseen > 0 && <span className="p-dot" aria-label={`${unseen} new`} />}
              </NavLink>
            ))}
          </nav>
          <div className="p-bar__right">
            <Link to="/search" className="p-find" aria-label="Search">
              {ICONS.search}
              <span>Search</span>
            </Link>
            {!isAuthenticated && (
              <Link to="/auth" state={{ from: { pathname } }} className="p-btn p-btn--small">Log in</Link>
            )}
          </div>
        </div>
      </header>

      <main className="p-main">
        <Outlet />
      </main>

      <footer className="p-foot">
        <span>Memphis · hear how it’s made</span>
        <nav aria-label="More">
          <Link to="/about">About</Link>
          <Link to="/updates">What’s new</Link>
          <Link to="/about#archive">Design Archive</Link>
        </nav>
      </footer>

      <nav className={`p-dock${onSection ? '' : ' p-dock--back'}`} aria-label="Main">
        {!onSection && (
          <button type="button" className="p-dock__back" onClick={goBack} aria-label="Back">{ICONS.back}</button>
        )}
        {SECTIONS.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.end}>
            {ICONS[s.icon]}
            {s.label}
            {s.dot && unseen > 0 && <span className="p-dot" />}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
