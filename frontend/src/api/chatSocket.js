import { Client } from '@stomp/stompjs'

// In dev, Vite proxies /api to the backend but WebSocket needs its own
// target since it doesn't go through the same HTTP proxy path by default.
// Adjust VITE_WS_URL if your backend isn't on localhost:8080.
const WS_URL = import.meta.env.VITE_WS_URL || `${window.location.origin.replace(/^http/, 'ws')}/ws`

/**
 * Opens one STOMP connection, authenticated with the same JWT used for
 * REST calls (sent as a native STOMP header, validated by
 * StompAuthChannelInterceptor on the backend).
 *
 * Returns { subscribeToMatch, sendMessage, disconnect }.
 */
export function connectChat({ token, onConnect, onError }) {
  const client = new Client({
    brokerURL: WS_URL,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 3000,
    onConnect: () => onConnect?.(client),
    onStompError: (frame) => onError?.(frame),
  })

  client.activate()

  return {
    client,
    subscribeToMatch(matchId, callback) {
      return client.subscribe(`/topic/matches/${matchId}`, (msg) => {
        callback(JSON.parse(msg.body))
      })
    },
    sendMessage(matchId, content) {
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ matchId, content }),
      })
    },
    disconnect() {
      client.deactivate()
    },
  }
}
