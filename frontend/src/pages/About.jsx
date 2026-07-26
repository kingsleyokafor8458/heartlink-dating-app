import { Heart, ShieldCheck, Users, Sparkles } from 'lucide-react'

const VALUES = [
  {
    icon: Heart,
    title: 'Real connections, not endless swiping',
    body: "We built HeartLink around shared interests, not just photos — so conversations start with something in common.",
  },
  {
    icon: ShieldCheck,
    title: 'Safety comes first',
    body: 'Verified profiles, easy reporting and blocking, and a team that takes every report seriously.',
  },
  {
    icon: Users,
    title: 'A community, not just an app',
    body: "Whether you're looking for friendship or something more, HeartLink is built for genuine people looking for genuine connection.",
  },
]

export default function About() {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm mb-3">
            <Sparkles className="w-4 h-4" /> About HeartLink
          </span>
          <h1 className="font-display font-extrabold text-4xl text-primary-900">
            We're here to help you find your person
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            HeartLink started with a simple idea: dating apps had gotten too focused on quick swipes and not
            enough on the things that actually make relationships last — shared interests, honesty, and safety.
            So we built something different.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm p-6">
              <span className="w-11 h-11 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-display font-semibold text-primary-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <h2 className="font-display font-bold text-xl text-primary-900 mb-3">Our promise to you</h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
            No fake profiles, no pressure, no games — just a platform designed to help real people meet, connect,
            and build something meaningful. That's the whole mission.
          </p>
        </div>
      </div>
    </div>
  )
}
