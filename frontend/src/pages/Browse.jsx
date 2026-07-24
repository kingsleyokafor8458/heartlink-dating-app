import { useEffect, useState } from 'react'
import { Heart, X, Loader2 } from 'lucide-react'
import client from '../api/client'

export default function Browse() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchToast, setMatchToast] = useState(null)

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    setLoading(true)
    try {
      const { data } = await client.get('/browse')
      setProfiles(data)
    } finally {
      setLoading(false)
    }
  }

  const swipe = async (targetId, action) => {
    setProfiles((prev) => prev.filter((p) => p.id !== targetId))
    try {
      const { data } = await client.post('/swipe', { targetId, action })
      if (data.isMatch) {
        setMatchToast('It\'s a match! 🎉')
        setTimeout(() => setMatchToast(null), 3000)
      }
    } catch {
      // silently ignore for now
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-pink-50/40 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-6">Discover</h1>

        {matchToast && (
          <div className="mb-6 bg-primary-500 text-white text-center py-3 rounded-xl font-semibold">
            {matchToast}
          </div>
        )}

        {profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No more profiles right now — check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg shadow-pink-100/60 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.photoUrls?.[0] && (
                    <img src={p.photoUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
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
                      onClick={() => swipe(p.id, 'PASS')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50"
                    >
                      <X className="w-5 h-5" /> Pass
                    </button>
                    <button
                      onClick={() => swipe(p.id, 'LIKE')}
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
