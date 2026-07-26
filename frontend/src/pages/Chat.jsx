import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Loader2, Flag, ShieldOff } from 'lucide-react'
import client from '../api/client'
import { connectChat } from '../api/chatSocket'
import { useAuth } from '../context/AuthContext'

export default function Chat() {
  const { matchId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [showSafetyMenu, setShowSafetyMenu] = useState(false)
  const bottomRef = useRef(null)
  const chatRef = useRef(null)

  // Load conversation history once via REST, then switch to live WebSocket updates.
  useEffect(() => {
    let subscription
    let chat

    client.get(`/messages/${matchId}`).then(({ data }) => {
      setMessages(data)
      setLoading(false)
    })

    const token = localStorage.getItem('heartlink_token')
    chat = connectChat({
      token,
      onConnect: (c) => {
        setConnected(true)
        subscription = chat.subscribeToMatch(matchId, (incoming) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev
            return [...prev, incoming]
          })
        })
      },
      onError: () => setConnected(false),
    })
    chatRef.current = chat

    return () => {
      subscription?.unsubscribe()
      chat?.disconnect()
    }
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (connected && chatRef.current) {
      chatRef.current.sendMessage(matchId, text)
    } else {
      // Fallback if the socket isn't up yet — still works via REST.
      client.post('/messages', { matchId, content: text }).then(({ data }) => {
        setMessages((prev) => [...prev, data])
      })
    }
    setText('')
  }

  const otherUserId = () => {
    const other = messages.find((m) => m.senderId !== user?.id)?.senderId
      || messages.find((m) => m.recipientId !== user?.id)?.recipientId
    return other
  }

  const handleReport = async () => {
    const target = otherUserId()
    if (!target) return
    const reason = window.prompt('Reason (e.g. HARASSMENT, FAKE_PROFILE, INAPPROPRIATE_PHOTOS, SPAM, OTHER):', 'OTHER')
    if (!reason) return
    await client.post('/reports', { reportedUserId: target, reason })
    setShowSafetyMenu(false)
    window.alert('Thanks — we\'ve received your report.')
  }

  const handleBlock = async () => {
    const target = otherUserId()
    if (!target) return
    if (!window.confirm('Block this person? You won\'t see or hear from each other again.')) return
    await client.post(`/blocks/${target}`)
    setShowSafetyMenu(false)
    window.alert('User blocked.')
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
        <div className="flex items-center justify-end gap-3 mb-2 relative">
          <span className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
            {connected ? '● Live' : 'Connecting…'}
          </span>
          <button
            onClick={() => setShowSafetyMenu((s) => !s)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Safety options"
          >
            <ShieldOff className="w-5 h-5" />
          </button>
          {showSafetyMenu && (
            <div className="absolute top-8 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-44 z-10">
              <button onClick={handleReport} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Flag className="w-4 h-4" /> Report
              </button>
              <button onClick={handleBlock} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                <ShieldOff className="w-4 h-4" /> Block
              </button>
            </div>
          )}
        </div>

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
