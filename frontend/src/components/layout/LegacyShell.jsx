import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Player from './Player';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SongModal from '../songs/SongModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { applyStoredTheme } from '../../themePresets';

// The original Memphis interface, kept whole as the Design Archive. Its routes
// render inside the chrome they were designed for.
const LegacyShell = () => {
  const { currentUser, loadingAuth } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    applyStoredTheme();
    return () => { document.body.className = ''; };
  }, []);

  useEffect(() => {
    if (!loadingAuth && currentUser) {
      const savedState = localStorage.getItem(`sidebarState_${currentUser._id}`);
      setSidebarOpen(savedState ? JSON.parse(savedState) : false);
    }
  }, [currentUser, loadingAuth]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`sidebarState_${currentUser._id}`, JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, currentUser]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="legacy-shell">
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

        <div className={`content-pusher ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Outlet />
            </Suspense>
          </main>
          <Footer companyName={'Memphis'} />
          <SongModal />
        </div>
      </div>
      <Player />
    </div>
  );
};

export default LegacyShell;
