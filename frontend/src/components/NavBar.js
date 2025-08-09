import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">EmployeeApp</Link>
        <div>
          {user ? (
            <>
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
