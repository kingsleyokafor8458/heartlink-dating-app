import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await client.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
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
          <h1 className="font-display font-bold text-2xl text-primary-900">Forgot your password?</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <p className="text-center text-sm text-gray-600">
            If that email is registered, a reset link is on its way — check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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
