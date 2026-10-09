import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../LibraryContext';
import { THEME_EVENT, applyTheme, effectiveTheme, storedTheme } from '../theme';
import { BackIcon, DiscoverIcon, MoonIcon, SearchIcon, SunIcon, UpdatesIcon, YouIcon } from './Icons';

const TABS = [
  { to: '/', label: 'Discover', icon: DiscoverIcon, end: true },
  { to: '/search', label: 'Search', icon: SearchIcon },
  { to: '/updates', label: 'Updates', icon: UpdatesIcon, badge: true },
  { to: '/you', label: 'You', icon: YouIcon },
];

const isTabPath = (pathname) => TABS.some((tab) => (tab.end ? pathname === tab.to : pathname.startsWith(tab.to)));

function ThemeButton() {
  const [theme, setTheme] = useState(() => effectiveTheme());

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(effectiveTheme());
    media.addEventListener('change', onChange);
    window.addEventListener(THEME_EVENT, onChange);
    return () => {
      media.removeEventListener('change', onChange);
      window.removeEventListener(THEME_EVENT, onChange);
    };
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="m-icon-button"
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
}

const Badge = ({ count }) => (count > 0 ? (
  <span className="m-badge" aria-hidden="true">{count > 9 ? '9+' : count}</span>
) : null);

// The one navigation: links in the top bar from tablet width up, and a
// floating dock at the thumb on phones. Detail pages add a way back to the dock.
export default function AppShell() {
  const { isAuthenticated } = useAuth();
  const { unseen } = useLibrary();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const onTab = isTabPath(pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-shell', 'product');
    applyTheme(storedTheme());
    return () => document.documentElement.removeAttribute('data-shell');
  }, []);

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };

  const label = (tab) => (tab.to === '/you' && !isAuthenticated ? 'Sign in' : tab.label);

  return (
    <div className="m-app">
      <a className="m-skip" href="#main">Skip to content</a>
      <header className="m-topbar">
        <div className="m-topbar__inner">
          <Link to="/" className="m-wordmark" aria-label="Memphis, discover">Memphis</Link>
          <nav className="m-topnav" aria-label="Main">
            {TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} end={tab.end} className="m-topnav__link">
                {label(tab)}
                {tab.badge && <Badge count={unseen} />}
              </NavLink>
            ))}
          </nav>
          <ThemeButton />
        </div>
      </header>

      <main id="main" className="m-main">
        <Outlet />
      </main>

      <nav className={`m-dock${onTab ? '' : ' m-dock--back'}`} aria-label="Main">
        {!onTab && (
          <button type="button" className="m-dock__back" onClick={goBack} aria-label="Back">
            <BackIcon />
          </button>
        )}
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className="m-dock__tab">
              <span className="m-dock__icon">
                <Icon />
                {tab.badge && <Badge count={unseen} />}
              </span>
              {label(tab)}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
