import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Create axios instance with timeout (prevents infinite pending requests)
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 5000 // 5 seconds max for any request
});

// ✅ Attach token except for /auth/login and /auth/register
axiosInstance.interceptors.request.use(
  (config) => {
    const noAuthNeeded =
      config.url.includes('/auth/login') ||
      config.url.includes('/auth/register');

    if (!noAuthNeeded) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto-logout on 401 (session expired / logged in elsewhere)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error(`[API TIMEOUT] ${error.config?.url || ''}`);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.setItem("sessionExpired", "1");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ Auth endpoints
export const register = (payload) =>
  axiosInstance.post('/auth/register', payload).then(r => r.data);

export const login = async (payload) => {
  const res = await axiosInstance.post('/auth/login', payload);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  await axiosInstance.post('/auth/logout');
  localStorage.removeItem("token");
};

export const me = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await axiosInstance.get('/auth/me', { timeout: 3000 }); // Specific timeout for /me
    return res.data;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      console.error("[me()] Request timed out after 3s");
    }
    throw err;
  }
};

// ✅ Employee endpoints
export const fetchEmployees = () =>
  axiosInstance.get('/employees').then(r => r.data);

export const createEmployee = (data) =>
  axiosInstance.post('/employees', data).then(r => r.data);

export const updateEmployee = (id, data) =>
  axiosInstance.put(`/employees/${id}`, data).then(r => r.data);

export const deleteEmployee = (id) =>
  axiosInstance.delete(`/employees/${id}`).then(r => r.data);

export const testRateLimit = () =>
  axiosInstance.get('/test-rate-limit').then(r => r.data);

export default axiosInstance;
