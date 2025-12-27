"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { WEDDING_CONFIG } from "@/config/wedding-config"

const FlipChar = ({ char, isInView, delay = 0 }: { char: string; isInView: boolean; delay?: number }) => {
  const [displayChar, setDisplayChar] = useState("A")
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    let startTimeout: NodeJS.Timeout
    let spinInterval: NodeJS.Timeout
    let stopTimeout: NodeJS.Timeout

    if (isInView) {
      startTimeout = setTimeout(() => {
        spinInterval = setInterval(() => {
          setDisplayChar(alphabet[Math.floor(Math.random() * alphabet.length)])
        }, 75)

        stopTimeout = setTimeout(() => {
          clearInterval(spinInterval)
          setDisplayChar(char)
        }, 800)
      }, delay)
    }

    return () => {
      clearTimeout(startTimeout)
      clearInterval(spinInterval)
      clearTimeout(stopTimeout)
    }
  }, [isInView, char, delay, alphabet])

  return (
    <div className="relative w-16 h-20 rounded-lg shadow-lg bg-[#148677] flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-transparent rounded-t-lg" />
      <span className="relative text-5xl font-bold text-white">{displayChar}</span>
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/20" />
    </div>
  )
}

const FlipDigit = ({ digit, isInView, delay = 0 }: { digit: string; isInView: boolean; delay?: number }) => {
  const [displayDigit, setDisplayDigit] = useState("0")

  useEffect(() => {
    let startTimeout: NodeJS.Timeout
    let spinInterval: NodeJS.Timeout
    let stopTimeout: NodeJS.Timeout

    if (isInView) {
      startTimeout = setTimeout(() => {
        spinInterval = setInterval(() => {
          setDisplayDigit(String(Math.floor(Math.random() * 10)))
        }, 75)

        stopTimeout = setTimeout(() => {
          clearInterval(spinInterval)
          setDisplayDigit(digit)
        }, 800)
      }, delay)
    }

    return () => {
      clearTimeout(startTimeout)
      clearInterval(spinInterval)
      clearTimeout(stopTimeout)
    }
  }, [isInView, digit, delay])

  return (
    <div className="relative w-16 h-20 rounded-lg shadow-lg bg-[#148677] flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-transparent rounded-t-lg" />
      <span className="relative text-5xl font-bold text-white">{displayDigit}</span>
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/20" />
    </div>
  )
}

export const DdayCounter = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  const dDay = useMemo(() => {
    const today = new Date()
    const weddingDay = new Date(WEDDING_CONFIG.weddingDateTime)
    today.setHours(0, 0, 0, 0)
    weddingDay.setHours(0, 0, 0, 0)
    const diffTime = weddingDay.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.3,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const dDayDigits = String(dDay).padStart(3, "0").split("")
  const dPlusDigits = String(Math.abs(dDay)).padStart(3, "0").split("")

  return (
    <div ref={ref} className="mt-16">
      {dDay < 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="mt-2 text-xl text-foreground"> 저희 결혼한지 💍 {Math.abs(dDay)}일 지났습니다 ❤️</p>
          <div className="flex items-center gap-2">
            <FlipChar char="D" isInView={isInView} delay={0} />
            <span className="text-6xl font-bold text-wedding-green">+</span>
            {dPlusDigits.map((digit, index) => (
              <FlipDigit key={index} digit={digit} isInView={isInView} delay={(index + 1) * 150} />
            ))}
          </div>
          <p className="mt-2 text-xl text-foreground"> 아직 행복하게 잘 살고 있습니다😅🫶</p>
        </div>
      ) : dDay === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="mt-2 text-xl text-foreground">🎉 저희 오늘 결혼 💍 합니다 🎉</p>
          <div className="flex items-center gap-2">
            <FlipChar char="D" isInView={isInView} delay={0} />
            <span className="text-6xl font-bold text-wedding-green">-</span>
            <FlipChar char="D" isInView={isInView} delay={120} />
            <FlipChar char="A" isInView={isInView} delay={250} />
            <FlipChar char="Y" isInView={isInView} delay={400} />
          </div>
          <p className="mt-2 text-lg text-foreground"></p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/*<p className="mt-2 text-xl text-foreground"> 💍 Wedding Day 💍</p>*/}
          <div className="flex items-center gap-2">
            <FlipChar char="D" isInView={isInView} delay={0} />
            <span className="text-5xl font-bold text-wedding-green">-</span>
            {dDayDigits.map((digit, index) => (
              <FlipDigit key={index} digit={digit} isInView={isInView} delay={(index + 1) * 150} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
