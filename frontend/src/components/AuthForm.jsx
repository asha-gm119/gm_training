import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import api from "../api/client";
import { USERS_BASE_PATH } from "../config";
import "../styles/auth.css";

const AuthForm = () => {
	const navigate = useNavigate();
	const { login, user, loading } = useAuth();

	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "Airline",
	});

	const isAdmin = !!user && String(user.role).toUpperCase().includes('ADMIN');

	useEffect(() => {
		if (isAdmin) setIsSignUp(true);
	}, [isAdmin]);

	const toggleForm = () => setIsSignUp(!isSignUp);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			if (isSignUp) {
				if (loading) {
					alert('Please wait, verifying session...');
					return;
				}
				if (!isAdmin) {
					alert('Sign up requires an ADMIN to be logged in.');
					return;
				}
				const roleMap = { Airline: 'AIRLINE', Baggage: 'BAGGAGE' };
				const payload = {
					name: formData.name,
					email: formData.email,
					password: formData.password,
					role: roleMap[formData.role] || 'AIRLINE'
				};
				await api.client.post(`${USERS_BASE_PATH}`, payload);
				alert("User registered successfully!");
				setIsSignUp(false);
				setFormData({ ...formData, password: "" });
			} else {
				await login(formData.email, formData.password);
				navigate('/dashboard');
			}
		} catch (err) {
			console.error(err);
			const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err.message;
			alert("Error: " + serverMsg);
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
							<option value="Airline">Airline</option>
							<option value="Baggage">Baggage</option>
						</select>
					</label>
					<button type="button" className="submit" onClick={handleSubmit} disabled={isSignUp && !isAdmin}>Sign Up</button>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;