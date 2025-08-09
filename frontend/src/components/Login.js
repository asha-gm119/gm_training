import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login({ username, password });
      setUser(res.user);
      navigate('/');
    } catch (error) {
      setErr(error?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Login</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
