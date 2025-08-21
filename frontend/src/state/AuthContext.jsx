import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axios.defaults.headers.common['Authorization']
  }, [token])

  const value = useMemo(() => ({
    token,
    user,
    login: async (email, password) => {
      const { data } = await axios.post('/api/auth/login', { email, password })
      setToken(data.token)
      setUser({ name: data.name, email: data.email, role: data.role })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }))
    },
    logout: () => {
      setToken('')
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

