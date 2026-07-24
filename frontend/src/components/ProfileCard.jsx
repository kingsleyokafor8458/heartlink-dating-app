import { Heart, MapPin, BadgeCheck } from 'lucide-react'

// Small tag-to-emoji map purely for the landing page's illustrative cards
const TAG_ICON = {
  Hiking: '⛰️', Travel: '✈️', Music: '🎵', Football: '⚽', Tech: '💻',
  Reading: '📖', Cooking: '🍳', Movies: '🎬', Basketball: '🏀',
  Fitness: '💪', Art: '🎨', Gaming: '🎮', Coffee: '☕', Dancing: '💃',
}

export default function ProfileCard({ profile, onLike, interactive = false }) {
  const { name, age, city, country, photoUrl, tags = [], online = true, verified = true } = profile

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/60 overflow-hidden">
      <div className="relative aspect-[4/3]">
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {online && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Online
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-lg text-primary-900">
                {name}, {age}
              </h3>
              {verified && (
                <BadgeCheck className="w-4 h-4 text-white fill-blue-500" strokeWidth={2} />
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              {city}, {country}
            </p>
          </div>

          <button
            onClick={() => onLike?.(profile)}
            aria-label={`Like ${name}`}
            className="shrink-0 w-9 h-9 rounded-full border border-primary-200 text-primary-500 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <span>{TAG_ICON[tag] || '❤️'}</span>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
