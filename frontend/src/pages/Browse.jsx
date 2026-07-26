import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Heart, X, Loader2, MoreVertical, Flag, ShieldOff, SlidersHorizontal, Undo2 } from 'lucide-react'
import client from '../api/client'

export default function Browse() {
  const [searchParams] = useSearchParams()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchToast, setMatchToast] = useState(null)
  const [openMenuFor, setOpenMenuFor] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [lastSwiped, setLastSwiped] = useState(null) // profile removed by the most recent swipe, for undo
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    minAge: '',
    maxAge: '',
    city: '',
    interest: '',
  })

  useEffect(() => {
    loadFeed()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadFeed = async (activeFilters = filters) => {
    setLoading(true)
    try {
      const params = { limit: 20 }
      if (activeFilters.query) params.query = activeFilters.query
      if (activeFilters.minAge) params.minAge = activeFilters.minAge
      if (activeFilters.maxAge) params.maxAge = activeFilters.maxAge
      if (activeFilters.city) params.city = activeFilters.city
      if (activeFilters.interest) params.interest = activeFilters.interest

      const { data } = await client.get('/browse', { params })
      setProfiles(data)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (e) => {
    e.preventDefault()
    loadFeed(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    const cleared = { query: '', minAge: '', maxAge: '', city: '', interest: '' }
    setFilters(cleared)
    loadFeed(cleared)
  }

  const swipe = async (targetProfile, action) => {
    setProfiles((prev) => prev.filter((p) => p.id !== targetProfile.id))
    setLastSwiped(targetProfile)
    try {
      const { data } = await client.post('/swipe', { targetId: targetProfile.id, action })
      if (data.isMatch) {
        setMatchToast('It\'s a match! 🎉')
        setTimeout(() => setMatchToast(null), 3000)
      }
    } catch {
      // silently ignore for now
    }
  }

  const undoSwipe = async () => {
    try {
      const { data, status } = await client.post('/swipe/undo')
      if (status === 200 && data) {
        setProfiles((prev) => [data, ...prev])
      }
    } finally {
      setLastSwiped(null)
    }
  }

  const handleReport = async (targetId) => {
    const reason = window.prompt('Reason (e.g. HARASSMENT, FAKE_PROFILE, INAPPROPRIATE_PHOTOS, SPAM, OTHER):', 'OTHER')
    if (!reason) return
    await client.post('/reports', { reportedUserId: targetId, reason })
    setOpenMenuFor(null)
    window.alert('Thanks — we\'ve received your report.')
  }

  const handleBlock = async (targetId) => {
    if (!window.confirm('Block this person? You won\'t see each other again.')) return
    await client.post(`/blocks/${targetId}`)
    setProfiles((prev) => prev.filter((p) => p.id !== targetId))
    setOpenMenuFor(null)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-pink-50/40 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-primary-900">Discover</h1>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 border border-primary-200 px-4 py-2 rounded-full hover:bg-primary-50"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <form onSubmit={applyFilters} className="bg-white rounded-2xl shadow-sm p-5 mb-6 space-y-3">
            <input
              placeholder="Search by name"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
            <div className="flex gap-3">
              <input
                type="number" placeholder="Min age" value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                className="w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              />
              <input
                type="number" placeholder="Max age" value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                className="w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              />
            </div>
            <input
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
            <input
              placeholder="Interest (e.g. Hiking)"
              value={filters.interest}
              onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={clearFilters} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50">
                Clear
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600">
                Apply
              </button>
            </div>
          </form>
        )}

        {matchToast && (
          <div className="mb-6 bg-primary-500 text-white text-center py-3 rounded-xl font-semibold">
            {matchToast}
          </div>
        )}

        {lastSwiped && (
          <button
            onClick={undoSwipe}
            className="mb-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-primary-200 text-primary-500 text-sm font-semibold hover:bg-primary-50"
          >
            <Undo2 className="w-4 h-4" /> Undo last swipe on {lastSwiped.name}
          </button>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No more profiles right now — check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg shadow-pink-100/60 overflow-hidden relative">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.photoUrls?.[0] && (
                    <img src={p.photoUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>

                <button
                  onClick={() => setOpenMenuFor(openMenuFor === p.id ? null : p.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow-sm"
                  aria-label="Safety options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenuFor === p.id && (
                  <div className="absolute top-12 right-3 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-44 z-10">
                    <button onClick={() => handleReport(p.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Flag className="w-4 h-4" /> Report
                    </button>
                    <button onClick={() => handleBlock(p.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <ShieldOff className="w-4 h-4" /> Block
                    </button>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-display font-bold text-xl text-primary-900">
                    {p.name}{p.age ? `, ${p.age}` : ''}
                  </h3>
                  {(p.city || p.country) && (
                    <p className="text-sm text-gray-500 mt-1">{[p.city, p.country].filter(Boolean).join(', ')}</p>
                  )}
                  {p.bio && <p className="text-gray-600 mt-3">{p.bio}</p>}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(p.interests || []).map((tag) => (
                      <span key={tag} className="text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-5">
                    <button
                      onClick={() => swipe(p, 'PASS')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50"
                    >
                      <X className="w-5 h-5" /> Pass
                    </button>
                    <button
                      onClick={() => swipe(p, 'LIKE')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600"
                    >
                      <Heart className="w-5 h-5" fill="white" /> Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
