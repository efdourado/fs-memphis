import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import Player from './components/layout/Player';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

import SongModal from './components/songs/SongModal';

import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './context/AuthContext';

import AdminPage from './pages/AdminPage/AdminPage';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import CollectionPage from './pages/CollectionPage';
import ComingSoonPage from './pages/ComingSoonPage';
import LibraryPage from './pages/LibraryPage';
import ArtistsPage from './pages/ArtistsPage';

import AuthCallbackPage from './pages/Auth/AuthCallbackPage';

const App = () => {
  const { currentUser, loadingAuth } = useAuth();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <PlayerProvider>
        <div className="app-container">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

          <div className={`content-pusher ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                <Route path="/artist/:id" element={<CollectionPage type="artist" />} />
                <Route path="/playlist/:id" element={<CollectionPage type="playlist" />} />
                <Route path="/album/:id" element={<CollectionPage type="album" />} />

                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/discover" element={<ComingSoonPage />} />
                <Route path="/archived" element={<ComingSoonPage />} />
                <Route path="/help" element={<ComingSoonPage />} />
                <Route path="/settings" element={<ComingSoonPage />} />
                <Route path="/feedback" element={<ComingSoonPage />} />

                <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
                <Route path="/library/songs" element={<ComingSoonPage />} />
                <Route path="/library/playlists" element={<ComingSoonPage />} />

                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              </Routes>
            </main>
            <Footer companyName={'Memphis'} />
            <SongModal />
          </div>
        </div>
        <Player />
    </PlayerProvider>
); };

export default App;