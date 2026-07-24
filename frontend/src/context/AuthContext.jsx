import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('heartlink_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (token, user) => {
    localStorage.setItem('heartlink_token', token)
    localStorage.setItem('heartlink_user', JSON.stringify(user))
    setUser(user)
  }

  const signup = async (payload) => {
    const { data } = await client.post('/auth/signup', payload)
    persist(data.token, data.user)
    return data
  }

  const login = async (payload) => {
    const { data } = await client.post('/auth/login', payload)
    persist(data.token, data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('heartlink_token')
    localStorage.removeItem('heartlink_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
