import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const loginUser = (email, password) => apiClient.post('/auth/login', { email, password });
const registerUser = (name, email, password) => apiClient.post('/auth/register', { name, email, password });
const fetchCurrentUser = () => apiClient.get('/auth/me');

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const { data } = await fetchCurrentUser();
          setCurrentUser(data);
        } catch (error) {
          console.error("Failed to fetch user with token:", error);
          localStorage.removeItem('authToken');
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

  const login = async (email, password) => {
    try {
      const { data } = await loginUser(email, password);
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
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
        localStorage.setItem('authToken', data.token);
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
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const loginWithToken = (token) => {
    localStorage.setItem('authToken', token);
    setToken(token);
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