import { useEffect, useRef, useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import client from '../api/client'

export default function Profile() {
  const [form, setForm] = useState({ name: '', age: '', bio: '', city: '', country: '', interests: '' })
  const [photoUrls, setPhotoUrls] = useState([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await client.get('/me')
    setForm({
      name: data.name || '',
      age: data.age || '',
      bio: data.bio || '',
      city: data.city || '',
      country: data.country || '',
      interests: (data.interests || []).join(', '),
    })
    setPhotoUrls(data.photoUrls || [])
    setLoading(false)
  }

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

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await client.post('/me/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPhotoUrls(data.photoUrls || [])
    } catch (err) {
      setUploadError(err.response?.data?.error || 'Upload failed — please try a smaller image.')
    } finally {
      setUploading(false)
      e.target.value = '' // allow re-selecting the same file
    }
  }

  const handlePhotoRemove = async (url) => {
    const { data } = await client.delete('/me/photos', { params: { url } })
    setPhotoUrls(data.photoUrls || [])
  }

  if (loading) return null

  return (
    <div className="min-h-[calc(100vh-80px)] bg-pink-50/40 px-6 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="font-display font-bold text-2xl text-primary-900 mb-6">Edit Profile</h1>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Photos ({photoUrls.length}/6)</p>
          <div className="grid grid-cols-3 gap-3">
            {photoUrls.map((url) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={url} alt="Profile" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handlePhotoRemove(url)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photoUrls.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-primary-200 text-primary-400 flex flex-col items-center justify-center gap-1 hover:bg-primary-50 transition-colors disabled:opacity-60"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-medium">{uploading ? 'Uploading' : 'Add photo'}</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />
          {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
          <p className="text-xs text-gray-400 mt-2">JPEG, PNG, or WEBP, up to 5MB each.</p>
        </div>

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

          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Save Changes
          </button>
          {saved && <p className="text-center text-sm text-green-600">Profile updated!</p>}
        </form>
      </div>
    </div>
  )
}
