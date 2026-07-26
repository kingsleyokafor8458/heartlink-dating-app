import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import client from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await client.post('/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </span>
          <h1 className="font-display font-extrabold text-4xl text-primary-900">Get in Touch</h1>
          <p className="text-gray-500 mt-3">Questions, feedback, or something not working right? We'd love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
          <input
            name="name" placeholder="Your name" value={form.name} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <textarea
            name="message" placeholder="How can we help?" value={form.message} onChange={handleChange} required rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />

          <button
            type="submit" disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'sent' && (
            <p className="text-center text-sm text-green-600">Thanks for reaching out — we'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm text-red-500">Something went wrong — please try again in a moment.</p>
          )}
        </form>
      </div>
    </div>
  )
}
