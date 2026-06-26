import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
} );

export default apiClient;
