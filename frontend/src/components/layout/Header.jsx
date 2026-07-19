import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, faBars, faPlus, faSearch, faChevronDown, faRightFromBracket, faUserCircle, faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import ThemePicker from "./ThemePicker";
import fallbackImage from '/fb.jpg';

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchFormRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    const defaultHeight = "68px";
    const scrolledHeight = "60px";

    const currentHeight = isScrolled ? scrolledHeight : defaultHeight;
    document.documentElement.style.setProperty('--current-header-height', currentHeight);
  }, [isScrolled]);

  useEffect(() => {
    const handleClickOutsideUserMenu = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
    } };
    document.addEventListener("mousedown", handleClickOutsideUserMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideUserMenu);
  }, []);

  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (
        searchActive &&
        searchFormRef.current &&
        !searchFormRef.current.contains(event.target) &&
        !event.target.closest('.search-trigger-btn')
      ) {
        setSearchActive(false);
    } };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, [searchActive]);

  const handleSearchToggle = () => {
    setSearchActive(prev => {
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return !prev;
  }); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchActive(false);
  } };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  if (loadingAuth && !currentUser) {
    return (
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">

          <div className="header-left">
            <Link to="/" className="header-logo">
              <img src="/memphis-logo-grey.png" alt="Echo Logo" className="logo-img" />
              <span className="logo-name">
                Memphis
              </span>
            </Link>
          </div>

          <div className="header-right">
            <ThemePicker />
          </div>
        </div>
      </header>
  ); }

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        
        <div className="header-left">
          {typeof toggleSidebar === 'function' && (
            <button
              className="btn-icon-only btn-ghost mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} className="btn-icon-graphic" />
            </button>
          )}

          <Link to="/" className="header-logo">
            <img src="/memphis-logo-grey.png" alt="Memphis Logo" className="logo-img" />
            <span className="logo-name">
              Memphis
            </span>
          </Link>
        </div>

        <div className="header-right">
          <form
            ref={searchFormRef}
            onSubmit={handleSearchSubmit}
            className={`search-form ${searchActive ? "active" : ""} ${searchQuery ? "has-query" : ""}`}
          >
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search songs, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search input"
            />
            <button
              type="button"
              className="search-trigger-btn"
              onClick={handleSearchToggle}
              aria-label="Toggle search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          {isAuthenticated && currentUser && (
            <Link to="/today" className="login-btn create-btn">
              <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
              <span className="btn-label"> Reflect</span>
            </Link>
          )}

          {isAuthenticated && currentUser && (
            <button
              className="btn-icon-only btn-ghost notifications-btn"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="btn-icon-graphic" />
            </button>
          )}

          <ThemePicker />

          {isAuthenticated && currentUser ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="user-avatar-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-label="User menu"
              >
                <img
                  src={currentUser.profilePic || fallbackImage}
                  alt="User Avatar"
                  className="avatar-image"
                  onError={handleImageError}
                />
                <FontAwesomeIcon icon={faChevronDown} className={`chevron ${showUserMenu ? 'open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-info">
                     <img
                      src={currentUser.profilePic || fallbackImage}
                      alt=""
                      className="avatar-image large"
                      onError={handleImageError}
                    />
                    <div className="user-details">
                      <span className="user-name">Hello, {currentUser.name || "User"}!</span>
                      <span className="user-email">{currentUser.email || "No email"}</span>
                    </div>
                  </div>
          
                  <div className="menu-divider"></div>

                  <button className="menu-item">
                    <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Profile
                  </button>

                  {currentUser.isAdmin && (
                    <Link className="menu-item" to="/admin" onClick={() => setShowUserMenu(false)}>
                      <FontAwesomeIcon icon={faGaugeHigh} className="fa-icon" /> Admin Studio
                    </Link>
                  )}

                  <div className="menu-divider"></div>

                  <button className="menu-item logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon" /> Log Out
                  </button>

                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="login-btn">
                <span className="btn-label">Log In</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
); };

export default Header;
