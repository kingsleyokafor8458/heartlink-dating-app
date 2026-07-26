import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, MessageCircle } from 'lucide-react'
import client from '../api/client'

function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/messages').then(({ data }) => {
      setConversations(data)
      setLoading(false)
    })
  }, [])

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
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <MessageCircle className="w-10 h-10 text-primary-200 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet — matches will show up here once you say hi.</p>
            <Link to="/matches" className="inline-block mt-4 text-primary-500 font-semibold">Go to Matches</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-pink-50 overflow-hidden">
            {conversations.map((c) => (
              <Link
                key={c.matchId}
                to={`/chat/${c.matchId}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-pink-50/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0">
                  {c.otherUser.photoUrls?.[0] && (
                    <img src={c.otherUser.photoUrls[0]} alt={c.otherUser.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-semibold text-primary-900 truncate">{c.otherUser.name}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className={`text-sm truncate ${c.hasUnread ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                    {c.lastMessageMine && c.lastMessageContent ? 'You: ' : ''}
                    {c.lastMessageContent || 'Say hi 👋'}
                  </p>
                </div>
                {c.hasUnread && <span className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
