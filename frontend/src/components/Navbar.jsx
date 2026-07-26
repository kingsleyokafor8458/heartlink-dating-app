import { useState } from 'react'
import { Heart, Menu, Search, User, MessageCircle, Sparkles, Compass } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavBadges } from '../context/useNavBadges'
import Sidebar from './Sidebar'

const APP_LINKS = [
  { label: 'Discover', to: '/browse', icon: Compass },
  { label: 'Matches', to: '/matches', icon: Heart },
  { label: 'Chat', to: '/messages', icon: MessageCircle, badgeKey: 'unreadMessages' },
  { label: 'Likes', to: '/likes', icon: Sparkles, badgeKey: 'pendingLikes' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { unreadMessages, pendingLikes } = useNavBadges()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const badgeValues = { unreadMessages, pendingLikes }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate(`/browse?query=${encodeURIComponent(searchQuery)}`)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-pink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        <Link to={user ? '/browse' : '/'} className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </span>
          <span className="font-display font-bold text-xl text-primary-900 hidden sm:inline">
            Heart<span className="text-primary-500">Link</span>
          </span>
        </Link>

        {user ? (
          <nav className="hidden md:flex items-center gap-1">
            {APP_LINKS.map(({ label, to, icon: Icon, badgeKey }) => {
              const active = location.pathname === to
              const badge = badgeKey ? badgeValues[badgeKey] : 0
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                location.pathname === '/' ? 'text-primary-500 border-primary-500' : 'text-gray-600 border-transparent hover:text-primary-500'
              }`}
            >
              Home
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setSearchOpen(false)}
                    placeholder="Search by name..."
                    className="w-48 px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                aria-label="Your profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  location.pathname === '/profile' ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500 hover:bg-primary-100'
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={logout}
                className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors"
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

          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="More"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile app nav */}
      {user && (
        <nav className="md:hidden flex items-center justify-around border-t border-pink-50 py-2">
          {APP_LINKS.map(({ label, to, icon: Icon, badgeKey }) => {
            const active = location.pathname === to
            const badge = badgeKey ? badgeValues[badgeKey] : 0
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-0.5 text-xs font-medium ${
                  active ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {badge > 0 && (
                  <span className="absolute -top-1 right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  )
}
