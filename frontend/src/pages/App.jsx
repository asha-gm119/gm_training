import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import { useAuth } from '../state/AuthContext.jsx'
import Login from './Login.jsx'
import AuthForm from './AuthForm.jsx'
import Dashboard from './Dashboard.jsx'
import FlightsPage from './FlightsPage.jsx'
import BaggagePage from './BaggagePage.jsx'
import UsersPage from './UsersPage.jsx'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

export default function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hideChrome = location.pathname === '/login'

  return (
    <>
      {!hideChrome && (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Airport Operations
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/flights">Flights</Button>
          <Button color="inherit" component={Link} to="/baggage">Baggage</Button>
          {user?.role === 'ADMIN' && (
            <Button color="inherit" component={Link} to="/users">Users</Button>
          )}
          {user ? (
            <Button color="inherit" onClick={() => { logout(); navigate('/login') }}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      )}
      <Container sx={{ mt: hideChrome ? 0 : 3, maxWidth: hideChrome ? '100% !important' : undefined, padding: hideChrome ? 0 : undefined }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flights" element={<PrivateRoute roles={['AIRLINE', 'ADMIN']}><FlightsPage /></PrivateRoute>} />
          <Route path="/baggage" element={<PrivateRoute roles={['BAGGAGE', 'ADMIN']}><BaggagePage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute roles={['ADMIN']}><UsersPage /></PrivateRoute>} />
        </Routes>
      </Container>
    </>
  )
}

