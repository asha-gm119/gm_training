import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import "../styles/Authform.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Airline",
  });

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        if (!user || user.role !== 'ADMIN') {
          alert('Sign up requires an ADMIN to be logged in.');
          return;
        }
        const roleMap = { Admin: 'ADMIN', Airline: 'AIRLINE', Baggage: 'BAGGAGE' };
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: roleMap[formData.role] || 'AIRLINE'
        };
        await axios.post(`/api/users`, payload);
        alert("User registered successfully!");
        setIsSignUp(false);
        setFormData({ ...formData, password: "" });
      } else {
        const response = await axios.post(`/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.data.token);
        login({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
      <div className="form sign-in">
        <h2>SkyTrack Airport Management</h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#888", marginTop: "10px" }}>
          Manage flights, baggage, and airline operations seamlessly.
        </p>
        <label>
          <span>Email</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <p className="forgot-pass">Forgot password?</p>
        <button type="button" className="submit" onClick={handleSubmit}>Sign In</button>
      </div>

      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>New here? Sign up to get started!</h3>
          </div>
          <div className="img__text m--in">
            <h3>Already have an account? Sign in to continue.</h3>
          </div>
          <div className="img__btn" onClick={toggleForm}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        <div className="form sign-up">
          <h2>Create your Account</h2>
          <label>
            <span>Name</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <label>
            <span>Role</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="Airline">Airline</option>
              <option value="Baggage">Baggage</option>
            </select>
          </label>
          <button type="button" className="submit" onClick={handleSubmit}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

