import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Loader2 } from 'lucide-react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Chat() {
  const { matchId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    load()
    // simple polling for near-real-time updates; swap for WebSocket/STOMP in production
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const load = async () => {
    try {
      const { data } = await client.get(`/messages/${matchId}`)
      setMessages(data)
    } finally {
      setLoading(false)
    }
  }

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const content = text
    setText('')
    const { data } = await client.post('/messages', { matchId, content })
    setMessages((prev) => [...prev, data])
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-pink-50/40 flex flex-col">
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m) => {
            const mine = m.senderId === user?.id
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    mine
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex gap-3 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button
            type="submit"
            className="w-12 h-12 shrink-0 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
