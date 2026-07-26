import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import client from '../api/client'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords don\'t match')
      return
    }
    if (!token) {
      setError('This reset link is missing its token — please request a new one.')
      return
    }

    setLoading(true)
    try {
      await client.post('/auth/reset-password', { token, newPassword: password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'That reset link is invalid or has expired.')
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
          <h1 className="font-display font-bold text-2xl text-primary-900">Choose a new password</h1>
        </div>

        {done ? (
          <p className="text-center text-sm text-green-600">Password updated — redirecting you to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password" placeholder="New password (min 8 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="password" placeholder="Confirm new password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary-500 font-semibold">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
