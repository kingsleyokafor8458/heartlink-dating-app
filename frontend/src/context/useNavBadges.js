import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export function useNavBadges() {
  const { user } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingLikes, setPendingLikes] = useState(0)

  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        const [msgRes, likesRes] = await Promise.all([
          client.get('/messages/unread-count'),
          client.get('/likes/received'),
        ])
        setUnreadMessages(msgRes.data.count || 0)
        setPendingLikes(likesRes.data.length || 0)
      } catch {
        // non-critical — badges just won't update this cycle
      }
    }

    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [user])

  return { unreadMessages, pendingLikes }
}
