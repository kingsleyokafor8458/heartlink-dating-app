import { Heart, Quote } from 'lucide-react'

// Placeholder testimonials — clearly sample content, not real users. Swap
// these out for real (consented) stories once you have them.
const STORIES = [
  {
    names: 'Amara & Tobi',
    location: 'Lagos, Nigeria',
    quote: "We matched over a shared love of hiking and ended up planning our first trip together within a month. A year later, we're engaged.",
    avatarSeed: 'AmaraTobi',
  },
  {
    names: 'Chidinma & Emeka',
    location: 'Abuja, Nigeria',
    quote: "I wasn't expecting much, but our first conversation on HeartLink turned into a three-hour phone call. We've been inseparable since.",
    avatarSeed: 'ChidinmaEmeka',
  },
  {
    names: 'Ifeoma & Daniel',
    location: 'Port Harcourt, Nigeria',
    quote: "The shared interests made it easy to find things to talk about right away. No awkward small talk — just a real connection from day one.",
    avatarSeed: 'IfeomaDaniel',
  },
]

export default function SuccessStories() {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <h1 className="font-display font-extrabold text-4xl text-primary-900">Success Stories</h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Real people, real connections — here are a few couples who found each other on HeartLink.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 italic mb-12">
          Sample stories shown for illustration — check back soon for stories from real HeartLink couples.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <div key={s.names} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
              <img
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${s.avatarSeed}&backgroundColor=ffd9e8`}
                alt=""
                className="w-16 h-16 rounded-full mb-4"
              />
              <Quote className="w-5 h-5 text-primary-300 mb-2" />
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{s.quote}</p>
              <p className="font-display font-semibold text-primary-900 flex items-center gap-1.5">
                {s.names} <Heart className="w-3.5 h-3.5 text-primary-400" fill="currentColor" />
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
