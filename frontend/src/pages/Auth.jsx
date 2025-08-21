import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../state/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function Auth() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'AIRLINE' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await login(loginForm.email, loginForm.password)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      if (user?.role !== 'ADMIN') {
        setError('Sign up requires admin login')
        return
      }
      await axios.post('/api/users', signupForm)
      setSuccess('User created successfully')
      setSignupForm({ name: '', email: '', password: '', role: 'AIRLINE' })
    } catch (e) {
      setError(e?.response?.data?.error || 'Sign up failed')
    }
  }

  return (
    <div className={`auth-page ${isSignUp ? 'signup-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleLogin} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="email" placeholder="Email" value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})} required />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})} required />
            </div>
            {error && !isSignUp && <p className="error-text">{error}</p>}
            <input type="submit" value="Login" className="btn solid" />
          </form>

          <form onSubmit={handleSignup} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Full Name" value={signupForm.name} onChange={e=>setSignupForm({...signupForm, name: e.target.value})} required />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" value={signupForm.email} onChange={e=>setSignupForm({...signupForm, email: e.target.value})} required />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" value={signupForm.password} onChange={e=>setSignupForm({...signupForm, password: e.target.value})} required />
            </div>
            <div className="input-field">
              <i className="fas fa-id-badge"></i>
              <select value={signupForm.role} onChange={e=>setSignupForm({...signupForm, role: e.target.value})}>
                <option value="AIRLINE">AIRLINE Staff</option>
                <option value="BAGGAGE">BAGGAGE Staff</option>
              </select>
            </div>
            {user?.role !== 'ADMIN' && <p className="hint-text">Sign up requires admin login</p>}
            {error && isSignUp && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            <input type="submit" value="Create Account" className="btn" disabled={user?.role !== 'ADMIN'} />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Create staff accounts (admin only) and manage airport operations.</p>
            <button className="btn transparent" onClick={() => setIsSignUp(true)}>Sign up</button>
          </div>
          <img src="https://cdn.jsdelivr.net/gh/alfredofranz/cdn-assets/illustrations/plane-takeoff.svg" className="image" alt="airplane" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Already have an account? Login to continue.</p>
            <button className="btn transparent" onClick={() => setIsSignUp(false)}>Sign in</button>
          </div>
          <img src="https://cdn.jsdelivr.net/gh/alfredofranz/cdn-assets/illustrations/airport-tower.svg" className="image" alt="airport tower" />
        </div>
      </div>
    </div>
  )
}

