import { useEffect, useState } from 'react'
import { Heart, X, Loader2, Sparkles } from 'lucide-react'
import client from '../api/client'

export default function Likes() {
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchToast, setMatchToast] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await client.get('/likes/received')
    setLikes(data)
    setLoading(false)
  }

  const respond = async (targetId, action) => {
    setLikes((prev) => prev.filter((p) => p.id !== targetId))
    try {
      const { data } = await client.post('/swipe', { targetId, action })
      if (data.isMatch) {
        setMatchToast('It\'s a match! 🎉')
        setTimeout(() => setMatchToast(null), 3000)
      }
    } catch {
      // ignore
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
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" /> Who Liked You
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          These people already liked your profile — like them back to match instantly.
        </p>

        {matchToast && (
          <div className="mb-6 bg-primary-500 text-white text-center py-3 rounded-xl font-semibold">
            {matchToast}
          </div>
        )}

        {likes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No likes yet — keep your profile fresh and check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {likes.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  {p.photoUrls?.[0] && (
                    <img src={p.photoUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-primary-900">
                    {p.name}{p.age ? `, ${p.age}` : ''}
                  </p>
                  {p.city && <p className="text-xs text-gray-400">{p.city}</p>}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => respond(p.id, 'PASS')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" /> Pass
                    </button>
                    <button
                      onClick={() => respond(p.id, 'LIKE')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600"
                    >
                      <Heart className="w-4 h-4" fill="white" /> Like
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
