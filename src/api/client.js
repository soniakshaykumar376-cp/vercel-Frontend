import axios from 'axios';

// Always derive the base URL from environment variable, fallback to window.location or default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  timeout: 60000, // 60s timeout to accommodate Render/cloud free-tier cold starts
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for clear debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getHealth = () => api.get('/api/health');
export const getCentres = () => api.get('/api/centres');
export const getCentreById = (id) => api.get(`/api/centres/${id}`);
export const updateCentreCounters = (id, delta, exactValue) =>
  api.post(`/api/centres/${id}/counters`, { delta, exactValue });

export const getFarmers = (params) => api.get('/api/farmers', { params });
export const registerFarmer = (data) => api.post('/api/farmers', data);
export const getFarmerById = (id) => api.get(`/api/farmers/${id}`);

export const getCentreRecommendation = (data) => api.post('/api/recommend-centre', data);
export const getDashboardStats = () => api.get('/api/dashboard/stats');
export const getWeather = (params) => api.get('/api/weather', { params });

export default api;
