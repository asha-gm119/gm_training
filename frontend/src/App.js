import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import PrivateRoute from "./components/PrivateRoute";
import { me, logout } from "./services/api";
import Alerts from "./components/Alerts";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Initial auth check
    me()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Listen for token removal in other tabs
    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        setUser(null);
        setAlerts([]);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setUser(null);
    setAlerts([]);
  };

  if (loading) {
    return <div className="text-center mt-5">Checking authentication...</div>;
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} onLogout={handleLogout} alerts={alerts} />
      <div className="container mt-3">
        <Alerts user={user} alerts={alerts} setAlerts={setAlerts} />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <PrivateRoute>
              <AddUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
