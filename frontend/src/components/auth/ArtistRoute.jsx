import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ArtistRoute = ({ children }) => {
  const { isAuthenticated, currentUser, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return <LoadingSpinner fullScreen={true} message="Verifying artist access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser?.isArtist) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ArtistRoute;