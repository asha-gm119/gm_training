import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

let authToken = null;

client.interceptors.request.use((config) => {
	if (authToken) {
		config.headers.Authorization = `Bearer ${authToken}`;
	}
	return config;
});

client.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error);
	}
);

const setAuthToken = (token) => {
	authToken = token;
};

export default { client, setAuthToken };