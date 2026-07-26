import { UserPlus, Heart, MessagesSquare, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create your profile',
    body: 'Sign up, add a few photos, and tell people a bit about yourself and your interests.',
  },
  {
    icon: Heart,
    title: 'Discover & swipe',
    body: "Browse profiles picked for you and like the ones that catch your eye. Pass on the rest — no explanations needed.",
  },
  {
    icon: Sparkles,
    title: "It's a match!",
    body: "When you both like each other, it's a match — and a conversation can begin.",
  },
  {
    icon: MessagesSquare,
    title: 'Start chatting',
    body: 'Message your matches in real time and see where the conversation takes you.',
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="font-display font-extrabold text-4xl text-primary-900">How HeartLink Works</h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Four simple steps between you and your next great connection.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm p-6 relative">
              <span className="absolute top-6 right-6 text-5xl font-display font-extrabold text-primary-50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="w-11 h-11 rounded-full bg-primary-500 text-white flex items-center justify-center mb-4 relative z-10">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-display font-semibold text-primary-900 mb-2 relative z-10">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed relative z-10">{body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-primary-200 transition-colors"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
