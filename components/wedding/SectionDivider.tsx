import { Heart } from "lucide-react"

export const SectionDivider = () => (
  <div className="px-4">
    <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
      <div className="flex-grow h-px bg-wedding-lime" />
      <Heart className="w-5 h-5 text-wedding-gold" fill="currentColor" />
      <div className="flex-grow h-px bg-wedding-lime" />
    </div>
  </div>
)
