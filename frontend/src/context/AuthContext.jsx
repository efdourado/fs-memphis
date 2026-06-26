import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const loginUser = (email, password) => apiClient.post('/auth/login', { email, password });
const registerUser = (name, email, password) => apiClient.post('/auth/register', { name, email, password });
const fetchCurrentUser = () => apiClient.get('/auth/me');
const AUTH_TOKEN_KEY = 'authToken';

const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);

const storeToken = (authToken, remember = true) => {
  const primaryStorage = remember ? localStorage : sessionStorage;
  const secondaryStorage = remember ? sessionStorage : localStorage;

  primaryStorage.setItem(AUTH_TOKEN_KEY, authToken);
  secondaryStorage.removeItem(AUTH_TOKEN_KEY);
};

const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const { data } = await fetchCurrentUser();
          setCurrentUser(data);
        } catch (error) {
          console.error("Failed to fetch user with token:", error);
          clearStoredToken();
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const updateCurrentUser = (newUserData) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  const login = async (email, password, { remember = false } = {}) => {
    try {
      const { data } = await loginUser(email, password);
      if (data?.token) {
        storeToken(data.token, remember);
        setToken(data.token);
        setCurrentUser(data);
        return data;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error.response?.data || new Error('Login failed');
  } };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser(name, email, password);
      if (data?.token) {
        storeToken(data.token, true);
        setToken(data.token);
        setCurrentUser(data);
        return data;
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error.response?.data || new Error('Registration failed');
  } };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    clearStoredToken();
    navigate('/auth');
  };

  const loginWithToken = (authToken, { remember = true } = {}) => {
    storeToken(authToken, remember);
    setToken(authToken);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loadingAuth: loading,
    updateCurrentUser,
    loginWithToken,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
); };
