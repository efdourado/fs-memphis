import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell, faChevronDown, faChevronLeft, faCompass, faFolder, faGaugeHigh, faLandmark,
  faRightFromBracket, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import ThemePicker from '../../components/layout/ThemePicker';
import { applyStoredTheme } from '../../themePresets';
import { useLibrary } from '../LibraryContext';
import fallbackImage from '/fb.jpg';

const TABS = [
  { to: '/', label: 'Discover', icon: faCompass, end: true },
  { to: '/search', label: 'Search', icon: faSearch, mobileOnly: true },
  { to: '/updates', label: "What's new", short: 'New', icon: faBell, badge: true },
  { to: '/you', label: 'Your library', short: 'Library', icon: faFolder },
];

const isTabPath = (pathname) => TABS.some((tab) => (tab.end ? pathname === tab.to : pathname.startsWith(tab.to)));

const Badge = ({ count }) => (count > 0 ? <span className="p-badge">{count > 9 ? '9+' : count}</span> : null);

function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };
  return (
    <form className="search-form p-header-search" onSubmit={submit} role="search">
      <input
        type="text"
        className="search-input"
        placeholder="Search songs, artists, producers..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search"
      />
      <button type="submit" className="search-trigger-btn" aria-label="Search">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
}

function UserMenu() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const avatar = (className) => (
    <img
      src={currentUser.profilePic || fallbackImage}
      alt=""
      className={className}
      onError={(event) => { event.target.src = fallbackImage; }}
    />
  );

  return (
    <div className="user-menu-container" ref={ref}>
      <button
        className="user-avatar-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Your account"
      >
        {avatar('avatar-image')}
        <FontAwesomeIcon icon={faChevronDown} className={`chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            {avatar('avatar-image large')}
            <div className="user-details">
              <span className="user-name">Hey, {currentUser.name?.split(' ')[0] || 'you'}!</span>
              <span className="user-email">{currentUser.email}</span>
            </div>
          </div>
          <div className="menu-divider" />
          <Link className="menu-item" to="/you" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faFolder} className="fa-icon" /> Your library
          </Link>
          <Link className="menu-item" to="/design-archive" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faLandmark} className="fa-icon" /> Design Archive
          </Link>
          {currentUser.isAdmin && (
            <Link className="menu-item" to="/admin" onClick={() => setOpen(false)}>
              <FontAwesomeIcon icon={faGaugeHigh} className="fa-icon" /> Admin Studio
            </Link>
          )}
          <div className="menu-divider" />
          <button className="menu-item logout" onClick={() => { setOpen(false); logout(); }}>
            <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

// One navigation. On desktop it lives in the header; on phones the header
// keeps only the brand and account, and the sections move to a dock at the thumb.
export default function AppShell() {
  const { isAuthenticated } = useAuth();
  const { unseen } = useLibrary();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const onTab = isTabPath(pathname);

  useEffect(() => {
    applyStoredTheme();
    document.documentElement.setAttribute('data-shell', 'product');
    return () => document.documentElement.removeAttribute('data-shell');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <header className={`header p-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="header-logo">
              <img src="/memphis-logo-grey.png" alt="" className="logo-img" />
              <span className="logo-name">Memphis</span>
            </Link>
            <nav className="p-nav" aria-label="Main">
              {TABS.filter((tab) => !tab.mobileOnly).map((tab) => (
                <NavLink key={tab.to} to={tab.to} end={tab.end} className="p-nav__link">
                  {tab.label}
                  {tab.badge && <Badge count={unseen} />}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <SearchBox />
            <ThemePicker />
            {isAuthenticated ? <UserMenu /> : (
              <Link to="/auth" className="login-btn" state={{ from: { pathname } }}>
                <span className="btn-label">Log In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="p-main">
        <Outlet />
      </main>

      <footer className="p-footer">
        <Link to="/" className="header-logo">
          <img src="/memphis-logo-grey.png" alt="" className="logo-img" />
          <span className="logo-name">Memphis</span>
        </Link>
        <nav aria-label="More">
          <Link to="/about">How Memphis works</Link>
          <Link to="/design-archive">Design Archive</Link>
        </nav>
        <span>© {new Date().getFullYear()} Memphis</span>
      </footer>

      <nav className={`p-dock${onTab ? '' : ' p-dock--back'}`} aria-label="Main">
        {!onTab && (
          <button type="button" className="p-dock__back" onClick={goBack} aria-label="Back">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className="p-dock__tab">
            <span className="p-dock__icon">
              <FontAwesomeIcon icon={tab.icon} />
              {tab.badge && <Badge count={unseen} />}
            </span>
            {tab.short || tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
