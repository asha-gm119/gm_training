import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true 
});

export const register = (payload) => axiosInstance.post('/auth/register', payload).then(r => r.data);
export const login = (payload) => axiosInstance.post('/auth/login', payload).then(r => r.data);
export const logout = () => axiosInstance.post('/auth/logout').then(r => r.data);
export const me = () => axiosInstance.get('/auth/me').then(r => r.data);


export const fetchEmployees = () => axiosInstance.get('/employees').then(r => r.data);
export const createEmployee = (data) => axiosInstance.post('/employees', data).then(r => r.data);
export const updateEmployee = (id, data) => axiosInstance.put(`/employees/${id}`, data).then(r => r.data);
export const deleteEmployee = (id) => axiosInstance.delete(`/employees/${id}`).then(r => r.data);

export default axiosInstance;
