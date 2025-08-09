import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeList from './components/EmployeeList';
import { me } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await me();
        setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return <div className="container py-5">Checking session...</div>;

  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser} />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={user ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
