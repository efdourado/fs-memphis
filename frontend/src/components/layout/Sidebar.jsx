import React from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faFolder, faCompass, faChevronRight, faUsers, faCog, faSignOutAlt, faCircleQuestion, faTrashCan, faCommentDots
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../context/AuthContext';

const menuLinks = [
  { to: '/', label: 'Home', icon: faHome, end: true },
  { to: '/discover', label: 'Discover', icon: faCompass },
  { to: '/artists', label: 'Artists', icon: faUsers },
  { to: '/library', label: 'Library', icon: faFolder },
];

const userLibraryLinks = [
  { to: '/library/songs', label: 'Liked Songs' },
  { to: '/library/playlists',label: 'Playlists' },
];

const otherLinks = [
  { to: '/archived', label: 'Archived', icon: faTrashCan, end: true },
  { to: '/help', label: 'Help', icon: faCircleQuestion, end: true },
  { to: '/settings', label: 'Settings', icon: faCog },
];


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  const renderNavLinks = (links) => (
    links.map(link => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}
      >
        {link.icon && <FontAwesomeIcon icon={link.icon} className="nav-icon" />}
        <span>{link.label}</span>
        <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
      </NavLink>
  )) );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">Menu</p>
          <div className="nav-links">
            {renderNavLinks(menuLinks)}
          </div>
        </div>

        {isAuthenticated && (
          <div className="nav-section">
            <p className="nav-section-title">Library</p>
            <div className="nav-links">
              {renderNavLinks(userLibraryLinks)}
            </div>
          </div>
        )}

        <div className="nav-section">
          <p className="nav-section-title">Others</p>
          <div className="nav-links">
            {renderNavLinks(otherLinks)}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated && currentUser ? (
          <button onClick={handleLogout} className="nav-link nav-link--logout" aria-label="Sign Out">
            <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
            <span>Log Out</span>
          </button>
        ) : (
          <a 
            href="mailto:ed320819@gmail.com?subject=Feedback%20for%20Echo%20App&body=hi%20there@20👋%0A%0Athis%20is%20my%20feedback%20about%20the%20app:%0A%0A" 
            className="nav-link nav-link--logout" 
            aria-label="Give us Feedback"
          >
            <FontAwesomeIcon icon={faCommentDots} className="nav-icon" />
            <span>Give us Feedback</span>
          </a>
        )}
      </div>
    </aside>
); };

export default Sidebar;