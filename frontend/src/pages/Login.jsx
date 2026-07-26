import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/browse')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-pink-50 to-white flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-pink-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </span>
          <h1 className="font-display font-bold text-2xl text-primary-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-xs text-primary-500 font-medium">Forgot password?</Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to HeartLink?{' '}
          <Link to="/signup" className="text-primary-500 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
