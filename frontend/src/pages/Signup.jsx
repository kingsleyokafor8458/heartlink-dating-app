import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: 'FEMALE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup({ ...form, age: form.age ? Number(form.age) : null })
      navigate('/browse')
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
          <h1 className="font-display font-bold text-2xl text-primary-900">Join HeartLink</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account and start matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            name="password" type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={handleChange} required minLength={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <div className="flex gap-3">
            <input
              name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} min={18}
              className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <select
              name="gender" value={form.gender} onChange={handleChange}
              className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  )
}
