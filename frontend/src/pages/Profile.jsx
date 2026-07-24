import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Profile() {
  const [form, setForm] = useState({ name: '', age: '', bio: '', city: '', country: '', interests: '', photoUrls: [] })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/me').then(({ data }) => {
      setForm({
        name: data.name || '',
        age: data.age || '',
        bio: data.bio || '',
        city: data.city || '',
        country: data.country || '',
        interests: (data.interests || []).join(', '),
        photoUrls: data.photoUrls || [],
      })
      setLoading(false)
    })
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaved(false)
    await client.put('/me', {
      ...form,
      age: form.age ? Number(form.age) : null,
      interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return null

  return (
    <div className="min-h-[calc(100vh-80px)] bg-pink-50/40 px-6 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-6">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <textarea name="bio" placeholder="Tell people about yourself..." value={form.bio} onChange={handleChange} rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div className="flex gap-3">
            <input name="city" placeholder="City" value={form.city} onChange={handleChange}
              className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
            <input name="country" placeholder="Country" value={form.country} onChange={handleChange}
              className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <input name="interests" placeholder="Interests (comma separated)" value={form.interests} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />

          <p className="text-xs text-gray-400">
            Photo upload can be wired up to S3/Cloudinary — for now, paste a public image URL in your database's
            <code className="mx-1">photoUrls</code> field, or extend this form with a file input.
          </p>

          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Save Changes
          </button>
          {saved && <p className="text-center text-sm text-green-600">Profile updated!</p>}
        </form>
      </div>
    </div>
  )
}
