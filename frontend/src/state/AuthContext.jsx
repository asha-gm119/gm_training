import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { AUTH_LOGIN_PATH } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem('auth');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setUser(parsed.user || null);
				setToken(parsed.token || null);
			} catch (_) {}
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		api.setAuthToken(token || null);
	}, [token]);

	const login = async (email, password) => {
		try {
			const res = await api.client.post(AUTH_LOGIN_PATH, { email, password });
			const { token: jwt, user: profile } = res.data;
			const normalized = { ...profile, role: String(profile?.role || '').toUpperCase() };
			setUser(normalized);
			setToken(jwt);
			localStorage.setItem('auth', JSON.stringify({ user: normalized, token: jwt }));
			return normalized;
		} catch (err) {
			const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
			throw new Error(serverMsg || err.message || 'Login failed');
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem('auth');
	};

	const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);