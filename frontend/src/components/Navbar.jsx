import { Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-pink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </span>
          <span className="font-display font-bold text-xl text-primary-900">
            Heart<span className="text-primary-500">Link</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                location.pathname === l.to
                  ? 'text-primary-500 border-primary-500'
                  : 'text-gray-600 border-transparent hover:text-primary-500'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/browse"
                className="px-5 py-2 rounded-full text-sm font-semibold text-primary-500 border border-primary-500 hover:bg-primary-50 transition-colors"
              >
                Browse
              </Link>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-sm font-semibold text-primary-500 border border-primary-500 hover:bg-primary-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-sm shadow-primary-200 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
