import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AuthCallbackPage = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      loginWithToken(token);

      navigate('/', { replace: true });
    } else {

        navigate('/login?error=auth_failed', { replace: true });
    }
  }, [loginWithToken, navigate, location]);

  return <LoadingSpinner fullScreen={true} message="Finalizando autenticação..." />;
};

export default AuthCallbackPage;