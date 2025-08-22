import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import AuthForm from './components/AuthForm.jsx'
import Dashboard from './pages/Dashboard.jsx'

const PrivateRoute = ({ children }) => {
	const { user, loading } = useAuth();
	if (loading) return null;
	return user ? children : <Navigate to="/auth" replace />;
};

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/auth" element={<AuthForm />} />
					<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
					<Route path="*" element={<Navigate to="/auth" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
