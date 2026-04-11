import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const LibraryLayout = () => (
  <div className="library-page library-layout">
    <header className="library-layout__header">
      <div className="library-layout__titles">
        <h1 className="carousel__title library-layout__title">Your library</h1>
        <p className="library-layout__subtitle">
          Playlists you own, tracks you love — organized in one place.
        </p>
      </div>
      <nav className="library-subnav" aria-label="Library sections">
        <NavLink
          end
          to="/library"
          className={({ isActive }) =>
            `library-subnav__link${isActive ? " active" : ""}`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/library/playlists"
          className={({ isActive }) =>
            `library-subnav__link${isActive ? " active" : ""}`
          }
        >
          Playlists
        </NavLink>
        <NavLink
          to="/library/songs"
          className={({ isActive }) =>
            `library-subnav__link${isActive ? " active" : ""}`
          }
        >
          Liked songs
        </NavLink>
      </nav>
    </header>
    <div className="library-layout__body">
      <Outlet />
    </div>
  </div>
);

export default LibraryLayout;
