import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-pink-100 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-400" fill="currentColor" />
          <span className="font-display font-bold">HeartLink</span>
        </div>
        <p className="text-sm text-pink-200/70">© {new Date().getFullYear()} HeartLink. All rights reserved.</p>
      </div>
    </footer>
  )
}
