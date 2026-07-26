import { Heart, X, Info, Compass, Sparkles, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'About', to: '/about', icon: Info },
  { label: 'How It Works', to: '/how-it-works', icon: Compass },
  { label: 'Success Stories', to: '/success-stories', icon: Sparkles },
  { label: 'Contact', to: '/contact', icon: Mail },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-pink-50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </span>
            <span className="font-display font-bold text-primary-900">More</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          {LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
