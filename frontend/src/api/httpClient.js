import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  if (token) {
    config.headers.Authorization = token;
  }
  const email = localStorage.getItem('gym_email');
  if (email) {
    config.headers['X-User-Email'] = email;
  }
  return config;
});

export default httpClient;


