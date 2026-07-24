import { Heart, ShieldCheck, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard'

// Illustrated, procedurally-generated avatars (DiceBear) — not photos of real
// people, so they're safe to ship as seed/demo data. Swap for real user
// uploads (photoUrls from the User model) once people start signing up.
const SAMPLE_PROFILES = [
  {
    id: 1,
    name: 'Sarah',
    age: 26,
    city: 'Lagos',
    country: 'Nigeria',
    photoUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sarah-Heartlink&backgroundColor=ffd9e8',
    tags: ['Hiking', 'Travel', 'Music'],
  },
  {
    id: 2,
    name: 'David',
    age: 28,
    city: 'Abuja',
    country: 'Nigeria',
    photoUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=David-Heartlink&backgroundColor=c9e7ff',
    tags: ['Football', 'Music', 'Tech'],
  },
  {
    id: 3,
    name: 'Ada',
    age: 24,
    city: 'Enugu',
    country: 'Nigeria',
    photoUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Ada-Heartlink&backgroundColor=ffe7b3',
    tags: ['Reading', 'Cooking', 'Movies'],
  },
  {
    id: 4,
    name: 'Michael',
    age: 30,
    city: 'Port Harcourt',
    country: 'Nigeria',
    photoUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Michael-Heartlink&backgroundColor=d3f5d3',
    tags: ['Basketball', 'Fitness', 'Travel'],
  },
]

const FEATURES = [
  { icon: Heart, label: 'Real People' },
  { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: Users, label: 'Meaningful Connections' },
]

export default function Landing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-pink-50 to-white">
      {/* decorative floating hearts */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <Heart className="absolute top-24 left-[36%] w-8 h-8 text-primary-200" fill="currentColor" />
        <Heart className="absolute top-14 left-[42%] w-5 h-5 text-primary-200" fill="currentColor" />
        <Heart className="absolute top-56 left-[46%] w-10 h-10 text-primary-100" fill="currentColor" />
        <svg className="absolute top-40 left-0 w-56 h-56 text-primary-200 opacity-70" viewBox="0 0 200 200" fill="none">
          <path d="M10 10 C 80 10, 80 110, 10 110 C -30 110, 60 190, 190 150" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left: copy */}
        <div>
          <h1 className="font-display font-extrabold leading-tight text-4xl sm:text-5xl lg:text-[3.4rem]">
            <span className="inline-flex items-center gap-3 text-primary-900">
              <Heart className="w-9 h-9 lg:w-11 lg:h-11 text-primary-500 shrink-0" fill="currentColor" />
              Find Your
            </span>
            <br />
            <span className="text-primary-500">Perfect Match</span>
          </h1>

          <p className="italic text-gray-500 text-lg mt-6 max-w-md leading-relaxed">
            Meet amazing people who share your interests, build meaningful
            friendships, and discover lasting relationships.
          </p>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="italic text-sm text-gray-400 mt-4 flex items-center gap-1.5">
              Your next chapter could start here...
              <Heart className="w-3.5 h-3.5 text-primary-300" fill="currentColor" />
            </p>
          </div>
        </div>

        {/* Right: profile grid */}
        <div className="grid grid-cols-2 gap-5">
          {SAMPLE_PROFILES.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
