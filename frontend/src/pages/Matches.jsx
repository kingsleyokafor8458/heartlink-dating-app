import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Loader2 } from 'lucide-react'
import client from '../api/client'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [matchesRes, profilesRes] = await Promise.all([
        client.get('/matches'),
        client.get('/matches/profiles'),
      ])
      setMatches(matchesRes.data)
      setProfiles(profilesRes.data)
    } finally {
      setLoading(false)
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
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-6">Your Matches</h1>

        {profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No matches yet — keep browsing to find your people!</p>
            <Link to="/browse" className="inline-block mt-4 text-primary-500 font-semibold">Go to Discover</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => {
              const match = matches.find((m) => m.userIds.includes(p.id))
              return (
                <Link
                  key={p.id}
                  to={`/chat/${match?.id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="aspect-square bg-gray-100">
                    {p.photoUrls?.[0] && (
                      <img src={p.photoUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-primary-900">{p.name}{p.age ? `, ${p.age}` : ''}</p>
                      <p className="text-xs text-gray-400">{p.city}</p>
                    </div>
                    <MessageCircle className="w-5 h-5 text-primary-400 group-hover:text-primary-600" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
