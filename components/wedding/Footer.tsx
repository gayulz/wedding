"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { WEDDING_CONFIG } from "@/config/wedding-config"

interface FooterProps {
  showFooter: boolean
  formatDate: (date: Date) => string
  shareToKakao: () => void
}

export const Footer = ({ showFooter, formatDate, shareToKakao }: FooterProps) => {
  const weddingDate = new Date(WEDDING_CONFIG.weddingDateTime)

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 bg-wedding-green/95 backdrop-blur-sm text-white py-4 px-4 transition-all duration-500 z-50 ${
        showFooter ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="text-sm">
          <p className="font-medium">
            {WEDDING_CONFIG.groom.name} ♥ {WEDDING_CONFIG.bride.name}
          </p>
          <p className="text-xs opacity-90">{formatDate(weddingDate)}</p>
        </div>
        <Button onClick={shareToKakao} size="sm" className="bg-wedding-gold hover:bg-wedding-lime text-foreground">
          <Heart className="w-4 h-4 mr-1" fill="currentColor" />
          공유하기
        </Button>
      </div>
    </footer>
  )
}
