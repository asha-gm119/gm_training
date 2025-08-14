import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser, onLogout, alerts = [] }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    setUser(null);
    navigate('/login');
  };

  const latestAlert = alerts.length > 0 ? alerts[0].message : null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">EmployeeApp</Link>
        <div className="d-flex align-items-center">
          {latestAlert && (
            <span className="badge bg-warning text-dark me-3">
              {latestAlert}
            </span>
          )}
          {user ? (
            <>
              <Link className="nav-link text-light me-3" to="/dashboard">Dashboard</Link>
              <span className="navbar-text me-3">Signed in</span>
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
              <Link className="btn btn-outline-light" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
