import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

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
		const res = await api.client.post('/auth/login', { email, password });
		const { token: jwt, user: profile } = res.data;
		setUser(profile);
		setToken(jwt);
		localStorage.setItem('auth', JSON.stringify({ user: profile, token: jwt }));
		return profile;
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