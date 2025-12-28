"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Copy, Heart, MapPin, Phone, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { WEDDING_CONFIG, sections } from "@/config/wedding-config"
import { AnimateOnScroll } from "@/components/wedding/AnimateOnScroll"
import { SectionDivider } from "@/components/wedding/SectionDivider"
import { DdayCounter } from "@/components/wedding/DdayCounter"
import { Footer } from "@/components/wedding/Footer"

export default function WeddingInvitation() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [accountModal, setAccountModal] = useState<"groom" | "bride" | null>(null)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(WEDDING_CONFIG.features.galleryDefaultIndex)
  const [showFooter, setShowFooter] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const isLastSection = currentSection === sections.length - 1
    setShowFooter(currentSection > 0 && !isLastSection)
  }, [currentSection])

  // 섹션으로 스크롤
  const scrollToSection = (index: number) => {
    if (index < 0 || index >= sections.length || isScrolling) return
    
    setIsScrolling(true)
    setCurrentSection(index)
    
    const element = document.getElementById(sections[index])
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    
    setTimeout(() => setIsScrolling(false), 1000)
  }

  // 휠 이벤트 핸들링
  useEffect(() => {
    let lastScrollTime = 0
    const scrollDelay = 800
    
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (isScrolling || now - lastScrollTime < scrollDelay) {
        e.preventDefault()
        return
      }
      
      if (Math.abs(e.deltaY) < 30) return
      
      lastScrollTime = now
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        e.preventDefault()
        scrollToSection(currentSection + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        e.preventDefault()
        scrollToSection(currentSection - 1)
      }
    }
    
    let touchStartY = 0
    let touchStartTime = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now()
      if (isScrolling || now - lastScrollTime < scrollDelay) return
      
      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY
      const deltaTime = now - touchStartTime
      
      if (Math.abs(deltaY) < 80 || deltaTime > 300) return
      
      lastScrollTime = now
      
      if (deltaY > 0 && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1)
      } else if (deltaY < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      container.addEventListener('touchstart', handleTouchStart, { passive: true })
      container.addEventListener('touchend', handleTouchEnd, { passive: true })
      
      return () => {
        container.removeEventListener('wheel', handleWheel)
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [currentSection, isScrolling])

  // Intersection Observer로 현재 섹션 추적
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0.1
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isScrolling) {
          const index = sections.findIndex(id => id === entry.target.id)
          if (index !== -1) {
            setCurrentSection(index)
          }
        }
      })
    }, options)
    
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    
    return () => observer.disconnect()
  }, [isScrolling])

  const weddingDate = new Date(WEDDING_CONFIG.weddingDateTime)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const makeCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const copyToClipboard = async (text: string, accountType: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAccount(accountType)
      setTimeout(() => setCopiedAccount(null), WEDDING_CONFIG.features.copySuccessTimeout)
    } catch (err) {
      console.error("복사 실패:", err)
    }
  }

  const closeModal = () => {
    setAccountModal(null)
    setCopiedAccount(null)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % WEDDING_CONFIG.images.gallery.length)
  }

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + WEDDING_CONFIG.images.gallery.length) % WEDDING_CONFIG.images.gallery.length,
    )
  }

  const shareToKakao = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('e967473bf6ff429f49cea2f45e1fa4c0');
      }
      
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "💒 최봉석 ♥ 김가율 결혼식에 초대합니다",
          description: "2026년 3월 14일 오후 2시\n토미스퀘어가든 4층 스퀘어가든홀",
          imageUrl: "https://bong-yul-invitation.netlify.app/images/wedding-07.jpeg",
          link: {
            mobileWebUrl: "https://bong-yul-invitation.netlify.app",
            webUrl: "https://bong-yul-invitation.netlify.app",
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: "https://bong-yul-invitation.netlify.app",
              webUrl: "https://bong-yul-invitation.netlify.app",
            },
          },
        ],
      })
    }
  }

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Hero Section */}
      <section id="invitation" className="h-screen snap-start snap-always">
        <div className="relative h-full flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
              <div
                  className="absolute inset-0 bg-cover bg-no-repeat"
                  style={{
                      backgroundImage: `url('${WEDDING_CONFIG.images.heroBackground}')`,
                      backgroundPosition: WEDDING_CONFIG.images.backgroundPosition,
                  }}
              />
              <div
                  className="absolute inset-0 bg-black"
                  style={{opacity: WEDDING_CONFIG.styles.heroOverlayOpacity}}
              />

              <div
                  className={`relative z-10 text-center max-w-md mx-auto transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              >
                  {/* 타이틀 조건부 렌더링 */}
                  {WEDDING_CONFIG.messages.mainTitle && (
                      <>
                          <h1 className="text-4xl font-serif text-white mb-2 text-balance drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{WEDDING_CONFIG.messages.mainTitle}</h1>
                          <div className="w-24 h-px bg-white mx-auto mb-6"/>
                      </>
                  )}
                  <div className="space-y-4 mb-8">
                      {/* 이름 텍스트 */}
                      <p className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]" style={{color: '#ffffff'}}>
                          {WEDDING_CONFIG.groom.name}<br/> <span className="inline-block animate-heartbeat"
                                                                 style={{color: '#ffbe53'}}>♥<br/></span>
                          <br/>{WEDDING_CONFIG.bride.name}
                      </p>
                      <div>
                        <p className="text-lg sm:text-xl md:text-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                          style={{color: '#ffffff'}}>
                            달달한 화이트데이에
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                          style={{color: '#ffffff'}}>
                            저희 결혼을 축하🥂해주세요
                        </p>
                     </div>

              </div>
          </div>
        </div>
      </section>

      {/* Couple Section */}
          <section id="couple" className="h-screen snap-start snap-always" style={{backgroundColor: '#EFE9E3'}}>
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto text-center">
                      <h2 className="text-3xl text-foreground mb-10">{WEDDING_CONFIG.messages.sectionTitles.couple}</h2>
                      <br/>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                          {/* 신랑 */}
                          <div className="flex flex-col items-center">
                              <div className="w-35 h-50 mb-6 overflow-hidden rounded-t-full relative">
                                  {WEDDING_CONFIG.images.groomPhoto ? (
                                      <Image
                                          src={WEDDING_CONFIG.images.groomPhoto}
                                          alt="신랑"
                                          fill
                                          className="object-cover"
                                          sizes="160px"
                                          quality={75}
                                          priority
                                      />
                                  ) : (
                                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                                          <span className="text-4xl">{WEDDING_CONFIG.groom.emoji}</span>
                                      </div>
                                  )}
                              </div>
                              <h3 className="text-xl text-card-foreground font-medium mb-2">{WEDDING_CONFIG.groom.name}</h3>
                              <p className="text-sm text-muted-foreground mb-1">{WEDDING_CONFIG.groom.engFirstName} {WEDDING_CONFIG.groom.englishName}</p>
                              <p className="text-xs text-muted-foreground mt-2">{WEDDING_CONFIG.groom.parents}</p>
                              <br/>
                              .
                              <p className="text-xs text-muted-foreground mt-2">골프를 사랑하는 {WEDDING_CONFIG.groom.mbti}</p>
                          </div>

                          {/* 신부 */}
                          <div className="flex flex-col items-center">
                              <div className="w-35 h-50 mb-6 overflow-hidden rounded-t-full relative">
                                  {WEDDING_CONFIG.images.bridePhoto ? (
                                      <Image
                                          src={WEDDING_CONFIG.images.bridePhoto}
                                          alt="신부"
                                          fill
                                          className="object-cover"
                                          sizes="160px"
                                          quality={75}
                                          priority
                                      />
                                  ) : (
                                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                                          <span className="text-4xl">{WEDDING_CONFIG.bride.emoji}</span>
                                      </div>
                                  )}
                              </div>
                              <h3 className="text-xl text-card-foreground font-medium mb-2">{WEDDING_CONFIG.bride.name}</h3>
                              <p className="text-sm text-muted-foreground mb-1">{WEDDING_CONFIG.bride.engFirstName} {WEDDING_CONFIG.bride.englishName}</p>
                              <p className="text-xs text-muted-foreground mt-2">{WEDDING_CONFIG.bride.parents}</p>
                              <br/>
                              .
                              <p className="text-xs text-muted-foreground mt-2">여행을 좋아하는 {WEDDING_CONFIG.bride.mbti}</p>
                          </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">서로 다른점이 많지만 서로에게</p>
                      <p className="text-xs text-muted-foreground mt-2">든든한 버팀목과 사랑스러운 동반자가 되겠습니다.</p>
                  </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Message Section - D-day + 메시지 */}
          <section id="message" className="h-screen snap-start snap-always">
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto text-center">
                      <br />
                      <h2 className="text-2xl text-foreground mb-8">💍 Wedding Day 💍</h2>
                      <DdayCounter/>
                      <div className="bg-muted/50 rounded-lg p-1 text-center mt-5">
                          <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                              . . .
                              {WEDDING_CONFIG.messages.coupleMessage.split("\n").map((line, index) => (
                                  <span className="text-foreground" key={index}>
                                      {line}
                                      {index < WEDDING_CONFIG.messages.coupleMessage.split("\n").length - 1 && <br/>}
                                  </span>
                              ))}
                              . . .
                          </p>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Wedding Details */}
          <section id="details" className="h-screen snap-start snap-always" style={{backgroundColor: '#EFE9E3'}}>
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto w-full">
                      <h2 className="text-3xl text-center text-foreground mb-12">
                          {WEDDING_CONFIG.messages.sectionTitles.details}
                      </h2>

                      <div className="space-y-2">
                          <Card className="p-6 bg-card border-border min-h-[100px] flex flex-col justify-center w-full">
                              <div className="flex items-center gap-4 mb-0">
                                  <Calendar className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.date}</h3>
                              </div>
                              <p className="text-card-foreground font-medium ml-10">{formatDate(weddingDate)}</p>
                          </Card>

                          <Card className="p-6 bg-card border-border min-h-[100px] flex flex-col justify-center w-full">
                              <div className="flex items-center gap-4 mb-0">
                                  <Clock className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.time}</h3>
                              </div>
                              <p className="text-card-foreground font-medium ml-10">{formatTime(weddingDate)}</p>
                          </Card>

                          <Card className="p-6 bg-card border-border min-h-[100px] flex flex-col justify-center w-full">
                              <div className="flex items-center gap-4 mb-0">
                                  <MapPin className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.location}</h3>
                              </div>
                              <div className="space-y-1 ml-10">
                                  <p className="text-card-foreground font-medium">{WEDDING_CONFIG.venue.name}</p>
                                  <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.venue.hall}</p>
                                  <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.venue.address}</p>
                              </div>
                          </Card>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Location Section 1 - 지도 */}
          <section id="location1" className="h-screen snap-start snap-always">
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto w-full">
                      <div className="text-center mb-12">
                          <h2 className="text-2xl text-foreground mb-0">
                              {WEDDING_CONFIG.messages.sectionTitles.location}
                          </h2>
                      </div>
                        <br />
                      {/* 구글 맵 임베드 - 더 크게 */}
                      <Card className="p-1 bg-card border-border mb-3 w-full">
                          <div className="rounded-lg overflow-hidden mb-0" style={{height: '350px'}}>
                              <iframe
                                  src={WEDDING_CONFIG.venue.googleMapEmbedUrl}
                                  width="100%"
                                  height="100%"
                                  style={{border: 0}}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  className="rounded-lg"
                              />
                          </div>
                      </Card>

                      {/* 네이버지도, 카카오맵 버튼 */}
                      <div className="grid grid-cols-2 gap-3">
                          <Button
                              onClick={() => window.open(WEDDING_CONFIG.venue.naverMapUrl, "_blank")}
                              className="hover:bg-wedding-teal text-white py-3 bg-[#ffbe53] w-full"
                          >
                              {WEDDING_CONFIG.messages.naverMapButton}
                          </Button>
                          <Button
                              onClick={() => window.open(WEDDING_CONFIG.venue.kakaoMapUrl, "_blank")}
                              className="hover:bg-wedding-teal text-white py-3 bg-[#ffbe53] w-full"
                          >
                              {WEDDING_CONFIG.messages.kakaoMapButton}
                          </Button>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Location Section 2 - 대중교통/자가용 안내 */}
          <section id="location2" className="h-screen snap-start snap-always" style={{backgroundColor: '#EFE9E3'}}>
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto w-full">
                      <div className="text-center mb-7">
                          <h2 className="text-2xl text-foreground mb-2">
                              교통 안내
                          </h2>
                      </div>
                      <div className="space-y-2">
                          <Card className="p-6 bg-card border-border w-full">
                              <div>
                                  <h3 className="text-base font-medium text-card-foreground mb-0 flex items-center gap-2">
                                      {WEDDING_CONFIG.messages.sectionTitles.publicTransport}
                                  </h3>
                              </div>

                              <div className="space-y-4 text-sm">
                                  {/* 기차 KTX */}
                                  <div>
                                      <h4 className="font-medium text-card-foreground mb-1 text-xs">{WEDDING_CONFIG.messages.labels.trainKTX}</h4>
                                      <p className="text-muted-foreground">{WEDDING_CONFIG.transportation.publicTransport.train.ktx}</p>
                                  </div>

                                  {/* 버스 KTX */}
                                  <div>
                                      <h4 className="font-medium text-card-foreground mb-1 text-xs">{WEDDING_CONFIG.messages.labels.busKTX}</h4>
                                      <div className="space-y-1 text-xs">
                                          <p className="text-muted-foreground">
                                              <span className="font-medium">{WEDDING_CONFIG.messages.labels.localBus} :</span>{" "}
                                              {WEDDING_CONFIG.transportation.publicTransport.bus.ktx.local}
                                          </p>
                                          <p className="text-muted-foreground">
                                              <span className="font-medium">{WEDDING_CONFIG.messages.labels.expressBus} :</span>{" "}
                                              {WEDDING_CONFIG.transportation.publicTransport.bus.ktx.express}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </Card>

                          {/* 자가용 안내 */}
                          <Card className="p-6 bg-card border-border w-full">
                              <div>
                                  <h3 className="text-base font-medium text-card-foreground mb-0 flex items-center gap-2">
                                      {WEDDING_CONFIG.messages.sectionTitles.carGuide}
                                  </h3>
                              </div>

                              <div className="space-y-4 text-sm">
                                  {/* 주소 */}
                                  <div>
                                      <h4 className="font-medium text-card-foreground mb-1 text-xs">{WEDDING_CONFIG.messages.labels.address}</h4>
                                      <p className="text-muted-foreground">{WEDDING_CONFIG.transportation.car.address}</p>
                                  </div>

                                  {/* 남구미 IC에서 오실 때 */}
                                  <div>
                                      <h4 className="font-medium text-card-foreground mb-1 text-xs">{WEDDING_CONFIG.messages.labels.southGumiIC}</h4>
                                      <p className="text-muted-foreground leading-relaxed text-xs">
                                          {WEDDING_CONFIG.transportation.car.routes.southGumi.split("\n").map((line, index) => (
                                              <span key={index}>
                                                  {line}
                                                  {index < WEDDING_CONFIG.transportation.car.routes.southGumi.split("\n").length - 1 && <br/>}
                                              </span>
                                          ))}
                                      </p>
                                  </div>

                                  {/* 구미 IC에서 오실 때 */}
                                  <div>
                                      <h4 className="font-medium text-card-foreground mb-1 text-xs">{WEDDING_CONFIG.messages.labels.gumiIC}</h4>
                                      <p className="text-muted-foreground leading-relaxed text-xs">
                                          {WEDDING_CONFIG.transportation.car.routes.gumiIC.split("\n").map((line, index) => (
                                              <span key={index}>
                                                  {line}
                                                  {index < WEDDING_CONFIG.transportation.car.routes.gumiIC.split("\n").length - 1 && <br/>}
                                              </span>
                                          ))}
                                      </p>
                                  </div>
                              </div>
                          </Card>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="h-screen snap-start snap-always">
            <div className="h-full py-16 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="w-full px-2">
                      <h2 className="text-3xl text-center text-foreground mb-12 px-4">
                          {WEDDING_CONFIG.messages.sectionTitles.gallery}
                      </h2>

                      {/* 3x5 그리드 사진첩 */}
                      <div className="grid grid-cols-3 gap-1 md:gap-2">
                          {WEDDING_CONFIG.images.gallery.map((image, index) => (
                              <button
                                  key={image.id || index}
                                  onClick={() => setSelectedImageIndex(index)}
                                  className="aspect-square rounded-lg overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-200 relative group"
                              >
                                  <Image
                                      src={image.url || "/placeholder.svg"}
                                      alt={image.alt}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 33vw"
                                      quality={85}
                                      loading="lazy"
                                      placeholder="blur"
                                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                              </button>
                          ))}
                      </div>
                      <div className="text-center mt-8 px-4">
                          <p className="text-sm text-muted-foreground">사진을 클릭하시면 크게 보실 수 있습니다.</p>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>

          {/* 사진 모달 팝업 */}
          {selectedImageIndex !== WEDDING_CONFIG.features.galleryDefaultIndex && (
              <div 
                  className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-[60]"
                  onClick={() => setSelectedImageIndex(WEDDING_CONFIG.features.galleryDefaultIndex)}
              >
                  <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                      {/* 닫기 버튼 */}
                      <button
                          onClick={() => setSelectedImageIndex(WEDDING_CONFIG.features.galleryDefaultIndex)}
                          className="absolute -top-12 right-0 text-black hover:text-gray-700 transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full p-2"
                      >
                          <X className="w-8 h-8" />
                      </button>

                      {/* 메인 사진 컨테이너 */}
                      <div className="relative w-full max-h-[80vh] flex items-center justify-center">
                          {/* 이전 버튼 */}
                          <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-black p-3 rounded-full transition-all backdrop-blur-sm z-10 shadow-lg"
                          >
                              <ChevronLeft className="w-6 h-6" />
                          </button>

                          {/* 사진 */}
                          <div className="relative w-full" style={{maxHeight: '80vh'}}>
                              <div className="relative w-full aspect-[3/4] max-h-[80vh]">
                                  <Image
                                      src={WEDDING_CONFIG.images.gallery[selectedImageIndex]?.url || "/placeholder.svg"}
                                      alt={WEDDING_CONFIG.images.gallery[selectedImageIndex]?.alt || "웨딩 사진"}
                                      fill
                                      className="object-contain rounded-lg"
                                      sizes="(max-width: 1024px) 100vw, 1024px"
                                      quality={90}
                                      priority
                                  />
                              </div>
                          </div>

                          {/* 다음 버튼 */}
                          <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-black p-3 rounded-full transition-all backdrop-blur-sm z-10 shadow-lg"
                          >
                              <ChevronRight className="w-6 h-6" />
                          </button>
                      </div>

                      {/* 사진 번호 표시 */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 text-black px-4 py-2 rounded-full text-sm backdrop-blur-sm font-medium">
                          {selectedImageIndex + 1} / {WEDDING_CONFIG.images.gallery.length}
                      </div>
                  </div>
              </div>
          )}
          </section>

          {/* Contact Section */}
          <section id="contact" className="h-screen snap-start snap-always" style={{backgroundColor: '#EFE9E3'}}>
            <div className="h-full py-16 px-4 overflow-hidden flex items-center justify-center">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto">
                      <h2 className="text-3xl    text-center text-foreground mb-12">
                          {WEDDING_CONFIG.messages.sectionTitles.contact}
                      </h2>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                          <Card className="p-4 bg-card border-border text-center">
                              <h3 className="font-medium text-card-foreground mb-3">{WEDDING_CONFIG.messages.labels.groomSide}</h3>
                              <div className="space-y-2">
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full bg-transparent"
                                      onClick={() => makeCall(WEDDING_CONFIG.groom.phone)}
                                  >
                                      <Phone className="w-4 h-4 mr-2"/>
                                      {WEDDING_CONFIG.messages.labels.groom}
                                  </Button>

                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full bg-transparent"
                                      onClick={() => makeCall(WEDDING_CONFIG.groom.motherPhone)}
                                  >
                                      <Phone className="w-4 h-4 mr-2"/>
                                      {WEDDING_CONFIG.messages.labels.mother}
                                  </Button>
                              </div>
                          </Card>

                          <Card className="p-4 bg-card border-border text-center">
                              <h3 className="font-medium text-card-foreground mb-3">{WEDDING_CONFIG.messages.labels.brideSide}</h3>
                              <div className="space-y-2">
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full bg-transparent"
                                      onClick={() => makeCall(WEDDING_CONFIG.bride.phone)}
                                  >
                                      <Phone className="w-4 h-4 mr-2"/>
                                      {WEDDING_CONFIG.messages.labels.bride}
                                  </Button>
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full bg-transparent"
                                      onClick={() => makeCall(WEDDING_CONFIG.bride.fatherPhone)}
                                  >
                                      <Phone className="w-4 h-4 mr-2"/>
                                      {WEDDING_CONFIG.messages.labels.father}
                                  </Button>
                              </div>
                          </Card>
                      </div>

                      <div className="mb-8">
                          <h3 className="text-lg font-medium text-center text-foreground mb-4">
                              {WEDDING_CONFIG.messages.sectionTitles.accountInfo}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                              <Button
                                  onClick={() => setAccountModal("groom")}
                                  className="h-auto p-4 bg-card hover:bg-yellow-100 text-card-foreground border border-border"
                                  variant="outline"
                              >
                                  <div className="text-center">
                                      <h4 className="font-medium mb-1">{WEDDING_CONFIG.messages.labels.groomAccountButton}</h4>
                                      <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.accounts.groom.accountHolder}</p>
                                  </div>
                              </Button>

                              <Button
                                  onClick={() => setAccountModal("bride")}
                                  className="h-auto p-4 bg-card hover:bg-yellow-100 text-card-foreground border border-border"
                                  variant="outline"
                              >
                                  <div className="text-center">
                                      <h4 className="font-medium mb-1">{WEDDING_CONFIG.messages.labels.brideAccountButton}</h4>
                                      <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.accounts.bride.accountHolder}</p>
                                  </div>
                              </Button>
                          </div>
                      </div>
                  </div>

                  <br/>
                  {/* Footer - 청첩장 공유하기 */}
                  <footer className="py-8 px-4 text-center overflow-hidden">
                      <AnimateOnScroll>
                          <div className="max-w-md mx-auto">
                              <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-foreground mb-4">청첩장 공유하기</h3>

                                  <div className="flex flex-col gap-3">
                                      {/* 카카오톡 공유 버튼 */}
                                      <Button
                                          onClick={shareToKakao}
                                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg"
                                      >
                                          💬 카카오톡으로 공유하기
                                      </Button>
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-border">
                                      <p className="text-xs text-muted-foreground">
                                          {WEDDING_CONFIG.groom.name} ♥ {WEDDING_CONFIG.bride.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">{formatDate(weddingDate)}</p>
                                  </div>
                              </div>
                          </div>
                      </AnimateOnScroll>
                  </footer>
              </AnimateOnScroll>
            </div>
          </section>

          {/* Account Modal */}
          {accountModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-card rounded-lg p-6 w-full max-w-sm border border-border">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-card-foreground">
                              {accountModal === "groom"
                                  ? WEDDING_CONFIG.messages.labels.groomSide
                                  : WEDDING_CONFIG.messages.labels.brideSide}{" "}
                              계좌정보
                          </h3>
                          <Button variant="ghost" size="sm" onClick={closeModal} className="h-8 w-8 p-0">
                              <X className="w-4 h-4"/>
                          </Button>
                      </div>

                      <div className="space-y-4">
                          {accountModal === "groom" && (
                              <>
                                  {/* 신랑 어머니 계좌 */}
                                  <div className="bg-muted/50 rounded-lg p-4">
                                      <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {WEDDING_CONFIG.messages.labels.accountHolder}
                        </span>
                                              <span className="font-medium text-card-foreground">
                          {WEDDING_CONFIG.accounts.groomMother.accountHolder} ({WEDDING_CONFIG.messages.labels.mother})
                        </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                              <span
                                                  className="text-sm text-muted-foreground">{WEDDING_CONFIG.messages.labels.bank}</span>
                                              <span className="font-medium text-card-foreground">
                          {WEDDING_CONFIG.accounts.groomMother.bank}
                        </span>
                                          </div>
                                          <div className="flex justify-between items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {WEDDING_CONFIG.messages.labels.accountNumber}
                        </span>
                                              <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-card-foreground">
                            {WEDDING_CONFIG.accounts.groomMother.accountNumber}
                          </span>
                                                  <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() =>
                                                          copyToClipboard(WEDDING_CONFIG.accounts.groomMother.accountNumber, "groomMother")
                                                      }
                                                      className="h-6 px-2"
                                                  >
                                                      {copiedAccount === "groomMother" ? (
                                                          <Check className="w-3 h-3 text-green-600"/>
                                                      ) : (
                                                          <Copy className="w-3 h-3"/>
                                                      )}
                                                  </Button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  {/* 신랑 계좌 */}
                                  <div className="bg-muted/50 rounded-lg p-4">
                                      <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {WEDDING_CONFIG.messages.labels.accountHolder}
                        </span>
                                              <span className="font-medium text-card-foreground">
                          {WEDDING_CONFIG.accounts.groom.accountHolder} ({WEDDING_CONFIG.messages.labels.groom})
                        </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                              <span
                                                  className="text-sm text-muted-foreground">{WEDDING_CONFIG.messages.labels.bank}</span>
                                              <span
                                                  className="font-medium text-card-foreground">{WEDDING_CONFIG.accounts.groom.bank}</span>
                                          </div>
                                          <div className="flex justify-between items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {WEDDING_CONFIG.messages.labels.accountNumber}
                        </span>
                                              <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-card-foreground">
                            {WEDDING_CONFIG.accounts.groom.accountNumber}
                          </span>
                                                  <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => copyToClipboard(WEDDING_CONFIG.accounts.groom.accountNumber, "groom")}
                                                      className="h-6 px-2"
                                                  >
                                                      {copiedAccount === "groom" ? (
                                                          <Check className="w-3 h-3 text-green-600"/>
                                                      ) : (
                                                          <Copy className="w-3 h-3"/>
                                                      )}
                                                  </Button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </>
                          )}

                          {accountModal === "bride" && (
                              <div className="bg-muted/50 rounded-lg p-4">
                                  <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                          <span
                                              className="text-sm text-muted-foreground">{WEDDING_CONFIG.messages.labels.bank}</span>
                                          <span
                                              className="font-medium text-card-foreground">{WEDDING_CONFIG.accounts.bride.bank}</span>
                                      </div>

                                      <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {WEDDING_CONFIG.messages.labels.accountHolder}
                      </span>
                                          <span className="font-medium text-card-foreground">
                        {WEDDING_CONFIG.accounts.bride.accountHolder}
                      </span>
                                      </div>

                                      <div className="flex justify-between items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {WEDDING_CONFIG.messages.labels.accountNumber}
                      </span>
                                          <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-card-foreground">
                          {WEDDING_CONFIG.accounts.bride.accountNumber}
                        </span>
                                              <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => copyToClipboard(WEDDING_CONFIG.accounts.bride.accountNumber, "bride")}
                                                  className="h-6 px-2"
                                              >
                                                  {copiedAccount === "bride" ? (
                                                      <Check className="w-3 h-3 text-green-600"/>
                                                  ) : (
                                                      <Copy className="w-3 h-3"/>
                                                  )}
                                              </Button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-3">
                                  {WEDDING_CONFIG.messages.labels.copyAccountMessage}
                              </p>
                              <Button onClick={closeModal}
                                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                  {WEDDING_CONFIG.messages.labels.confirmButton}
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* 고정 푸터 - 스크롤 시 나타남 */}
          <footer 
            className={`fixed bottom-0 left-0 right-0 bg-wedding-green/95 backdrop-blur-sm text-white py-4 px-4 transition-all duration-500 z-50 ${
              showFooter ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="max-w-md mx-auto flex items-center justify-around">
              <Button
                onClick={shareToKakao}
                size="sm"
                className="bg-wedding-gold hover:bg-wedding-lime text-foreground"
              >
                <Heart className="w-4 h-4 mr-1" fill="currentColor" />
                공유하기
              </Button>
            </div>
          </footer>
    </div>
  )
}
