"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Copy, Heart, MapPin, Phone, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

// ========================================
// 🎯 청첩장 설정 - 아래 정보만 수정하세요!
// ========================================

// 스크롤 애니메이션을 위한 헬퍼 컴포넌트
const AnimateOnScroll = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1, // 요소가 10% 보일 때 애니메이션 시작
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

  return (
    <div ref={ref} className={`${className || ""} ${isIntersecting ? "animate-fade-in-up" : "opacity-0"}`}>
      {children}
    </div>
  )
}

const SectionDivider = () => (
  <div className="px-4">
    <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
      <div className="flex-grow h-px bg-wedding-lime" />
      <Heart className="w-5 h-5 text-wedding-gold" fill="currentColor" />
      <div className="flex-grow h-px bg-wedding-lime" />
    </div>
  </div>
);

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

const DdayCounter = () => {
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
        // threshold 값을 낮춰서 컴포넌트가 조금만 보여도 애니메이션이 시작되도록 수정
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
          <p className="mt-2 text-xl text-foreground font-heading"> 저희 결혼한지 💍 {Math.abs(dDay)}일 지났습니다 ❤️</p>
          <div className="flex items-center gap-2">
            <FlipChar char="D" isInView={isInView} delay={0} />
            <span className="text-6xl font-bold text-wedding-green">+</span>
            {dPlusDigits.map((digit, index) => (
              <FlipDigit key={index} digit={digit} isInView={isInView} delay={(index + 1) * 150} />
            ))}
          </div>
          <p className="mt-2 text-xl text-foreground font-heading"> 아직 행복하게 잘 살고 있습니다😅🫶</p>
        </div>
      ) : dDay === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="mt-2 text-xl text-foreground font-heading">🎉 저희 오늘 결혼 💍 합니다 🎉</p>
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
          <p className="mt-2 text-xl text-foreground font-heading"> 💍 Wedding Day 💍</p>
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

const WEDDING_CONFIG = {
  // 👰🤵 신랑신부 정보
  groom: {
    name: "최봉석",
    engFirstName : "Choi",
    englishName: "Bong Seok",
    parents: "석명순의 아들",
    emoji: "👨",
    phone: "010-4404-1519", // 신랑 연락처
    motherPhone: "010-5232-9720", // 신랑 어머니 연락처
  },
  bride: {
    name: "김가율",
    engFirstName : "Kim",
    englishName: "Ga Yul",
    parents: "김상준의 딸",
    emoji: "👩",
    phone: "010-8790-1519", // 신부 연락처
    fatherPhone: "010-6600-4422", // 신부 아버지 연락처
  },

  // 📅 결혼식 날짜 및 시간 (YYYY-MM-DDTHH:MM:SS 형식)
  weddingDateTime: "2026-03-14T14:00:00",

  // 🏛️ 예식장 정보
  venue: {
    name: "구미 토미스퀘어가든",
    hall: "4층 스퀘어가든 홀",
    address: "경상북도 구미시 인동35길 46",
    googleMapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.8277194096677!2d128.4332375773818!3d36.09768747245584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565c58fe61ae731%3A0xc044c1ef3023962e!2z7Yag66-47Iqk7YCY7Ja06rCA65Og!5e0!3m2!1sko!2skr!4v1758998723872!5m2!1sko!2skr",
    naverMapUrl: "https://map.naver.com/v5/search/경상북도%20구미시%20인동35길%2046",
    kakaoMapUrl: "https://map.kakao.com/link/search/경상북도%20구미시%20인동35길%2046",
    parking: "제1주차장(야외), 제2주차장(실내)이가 예식홀과 가장 가깝습니다.", // 주차 안내
  },

  // 🚇 교통 정보
  transportation: {
    // 대중교통 안내
    publicTransport: {
      train: {
        ktx: "동대구역 → 구미역 → 대중교통 이용(30분~50분 소요)",
      },
      bus: {
        ktx: {
          local: "187, 187-1, 188", // 자선(초록) 버스
          express: "180, 881, 881-1, 883, 883-1, 884, 884-1, 884-2, 885, 885", // 간선(파랑) 버스
        },
      },
    },
    // 자가용 안내
    car: {
      address: "경상북도 구미시 인동35길 46",
      routes: {
        southGumi:
          "녹동강 변도로(좌회전) → 구미대교 → 인동광장 → 대구,가산 방향 → 롯데리아 사거리(좌회전)",
        gumiIC: "IC사거리(우회전) → 인동광장 → 대구, 가산 방향 → 롯데리아 사거리(좌회전)",
      },
    },
  },

  // 💝 메시지
  messages: {
    mainTitle: "",
    coupleMessage:
      "\n\n\n" +
      "따뜻한 봄에 만난 우리,\n" +
      "오랜 시간 먼 길을 오가며 단단해진 사랑을 믿고\n" +
      "이제는 함께 걸어가려 합니다.\n\n" +
      "봄에는 활짝 핀 벚꽃이 되어주고\n" + 
      "여름에는 시원한 바람이 되어주겠습니다.\n" +
      "가을에는 드넓은 하늘이 되어주고\n" +
      "겨울에는 새하얀 눈이 되어\n" +
      "평생을 늘 서로에게 버팀목이 되어주겠습니다.\n\n" +
      "시작의 한 걸음,\n" +
      "함께 축복해 주시면 감사드립니다.\n\n\n",
    footerMessage: "참석이 어려우신 분들은\n마음만이라도 전해주세요",
    // 버튼 텍스트
    viewInvitationButton: "초대장 보기",
    naverMapButton: "🗺️ 네이버 지도",
    kakaoMapButton: "🏢 카카오맵",
    viewLargerMapText: "View larger map",
    // 섹션 제목들
    sectionTitles: {
      couple: "🤵🏻 신랑  &  신부 👰🏻‍♀️",
      details: "Wedding Details",
      location: "오시는 길",
      gallery: "사진첩",
      contact: "연락처",
      publicTransport: "대중 교통 안내",
      carGuide: "자가용 안내",
      accountInfo: "마음 전하실 곳",
    },
    // 상세 라벨들
    labels: {
      date: "날짜",
      time: "시간",
      location: "장소",
      groom: "신랑",
      bride: "신부",
      groomSide: "신랑측",
      brideSide: "신부측",
      mother: "어머니",
      father: "아버지",
      bank: "은행",
      accountHolder: "예금주",
      accountNumber: "계좌번호",
      trainKTX: "기차 KTX",
      busKTX: "버스 KTX",
      localBus: "지선(초록)",
      expressBus: "간선(파랑)",
      address: "주소",
      southGumiIC: "남구미 IC에서 오실 때",
      gumiIC: "구미 IC에서 오실 때",
      groomAccountButton: "신랑측 계좌번호 확인",
      brideAccountButton: "신부측 계좌번호 확인",
      copyAccountMessage: "계좌번호를 복사하여 송금해 주세요",
      confirmButton: "확인",
    },
  },

  // 🎨 이미지 URL
  images: {
    // 메인 배경 이미지 (Hero Section)
    heroBackground:
      "/images/wedding-07.jpeg",
    backgroundPosition: "center bottom", // 배경 이미지 위치 (center top, center center, center bottom 등)

    // 프로필 사진 (선택사항 - 비워두면 이모지 사용)
    groomPhoto: "/images/wedding-99.jpeg", // 신랑 사진 URL
    bridePhoto: "/images/wedding-98.jpeg", // 신부 사진 URL
    couplePhoto: "/images/wedding-10.jpeg", // 커플 사진 URL (선택사항)
    venuePhoto: "", // 예식장 사진 URL (선택사항)

    // 📸 갤러리 사진들 (각 사진의 URL을 개별적으로 설정)
    gallery: [
      {
        id: 1,
        url: "/images/wedding-02.jpeg", 
        alt: "",
        description: "for Vietnam",
      },
      {
        id: 2,
        url: "/images/wedding-05.jpeg", // 실내에서 촬영된 신랑신부의 로맨틱한 사진
        alt: "",
        description: "for Vietnam",
      },
      {
        id: 3,
        url: "/images/wedding-01.jpeg", // 스튜디오에서 촬영된 정식 웨딩 사진
        alt: "취미생활",
        description: "골프를 좋아하는 우리",
      },
      {
        id: 4,
        url: "/images/wedding-15.jpeg", // 신부가 부케를 들고 있는 클로즈업 사진
        alt: "반국투어",
        description: "우리의 추억, 반국투어",
      },
      {
        id: 5,
        url: "/images/wedding-26.jpeg", // 기존 배경 이미지 재사용
        alt: "세부여행",
        description: "오빠의 첫 해외여행",
      },
      {
        id: 6,
        url: "/images/wedding-30.jpeg", // 첫 번째 사진 반복
        alt: "강원도 여행",
        description: "육백마지기에서 우리",
      },
      {
        id: 7,
        url: "/images/wedding-42.jpeg", // 두 번째 사진 반복
        alt: "오이도에서",
        description: "살뺀 가율이가 그립다네요",
      },
      {
        id: 8,
        url: "/images/wedding-34.jpeg", // 세 번째 사진 반복
        alt: "연애 초반의 우리",
        description: "정말 풋풋했구나.",
      },
      {
        id: 9,
        url: "/images/wedding-46.jpeg", // 네 번째 사진 반복
        alt: "벚꽃",
        description: "벚꽃을 보러 간 저녁",
      },
      {
        id: 10,
        url: "/images/wedding-43.jpeg", // 다섯 번째 사진 반복
        alt: "파주데이트",
        description: "눈이 엄청 많이왔지",
      },
    ],
  },

  // 💳 계좌 정보 (선택사항)
  accounts: {
    groom: {
      bank: "기업은행",
      accountNumber: "01044041519",
      accountHolder: "최봉석",
    },
    groomMother: {
      bank: "우리은행",
      accountNumber: "70820187102001",
      accountHolder: "석명순",
    },
    bride: {
      bank: "기업은행",
      accountNumber: "01087901519",
      accountHolder: "김가율",
    },
  },

  // 🎨 스타일 설정
  styles: {
    // 배경 오버레이 투명도 (0.0 ~ 1.0, 높을수록 배경이 어두워짐)
    heroOverlayOpacity: 0.65,
    // 메인 콘텐츠 상단 여백 (mt-16, mt-32, mt-64 등)
    heroContentMarginTop: "mt-64",
    // 네비게이션 도트 위치 (right-4, right-8 등)
    navigationPosition: "right-4",
  },

  // ⚙️ 기능 설정
  features: {
    // 네비게이션 도트 표시 여부
    showNavigationDots: true,
    // 자동 스크롤 애니메이션 사용 여부
    smoothScroll: true,
    // 복사 완료 메시지 표시 시간 (밀리초)
    copySuccessTimeout: 2000,
    // 갤러리 기본 선택 사진 인덱스 (0부터 시작)
    galleryDefaultIndex: 0,
  },
}

// ========================================
// 🚫 아래 코드는 수정하지 마세요!
// ========================================
const sections = ["invitation", "couple", "details", "location", "gallery", "contact"]

export default function WeddingInvitation() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [accountModal, setAccountModal] = useState<"groom" | "bride" | null>(null)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(WEDDING_CONFIG.features.galleryDefaultIndex)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((sectionId) => sectionId === entry.target.id)
            if (index > -1) {
              setCurrentSection(index)
            }
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

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

  const scrollToSection = (index: number) => {
    setCurrentSection(index)
    const element = document.getElementById(sections[index])
    element?.scrollIntoView({ behavior: WEDDING_CONFIG.features.smoothScroll ? "smooth" : "auto" })
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

  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
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
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "💒 최봉석 ♥ 김가율 결혼식에 초대합니다",
          description: "2026년 3월 14일 오후 2시\n토미스퀘어가든 4층 스퀘어가든홀",
          imageUrl: "https://bong-yul-invitation.netlify.app",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      })
    }
  }

  return (
      <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <section id="invitation"
                   className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
              <div
                  className="absolute inset-0 bg-cover bg-no-repeat"
                  style={{
                      backgroundImage: `url('${WEDDING_CONFIG.images.heroBackground}')`,
                      backgroundPosition: WEDDING_CONFIG.images.backgroundPosition,
                  }}
              />
              <div
                  className="absolute inset-0 bg-background opacity-75"
                  style={{opacity: WEDDING_CONFIG.styles.heroOverlayOpacity}}
              />

              <div
                  className={`relative z-10 text-center max-w-md mx-auto transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              >
                  {/* 하트 제거 */}
                  {/* 타이틀 조건부 렌더링 */}
                  {WEDDING_CONFIG.messages.mainTitle && (
                      <>
                          <h1 className="text-4xl font-serif text-foreground mb-2 text-balance">{WEDDING_CONFIG.messages.mainTitle}</h1>
                          <div className="w-24 h-px bg-primary mx-auto mb-6"/>
                      </>
                  )}
                  <div className="space-y-4 mb-8">
                      {/* 텍스트 크기 증가 - 그림자 제거 */}
                      <p className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading" style={{color: '#2f4858'}}>
                          {WEDDING_CONFIG.groom.name}<br/> <span className="inline-block animate-heartbeat"
                                                                 style={{color: '#ffbe53'}}>♥<br/></span>
                          <br/>{WEDDING_CONFIG.bride.name}
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-medium font-heading"
                         style={{color: '#a6b550'}}>
                          봄이 시작하는 계절에
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-medium font-heading"
                         style={{color: '#a6b550'}}>
                          저희 결혼합니다💍
                      </p>

                  </div>
              </div>
          </section>


          {/* Couple Section */}
          <section id="couple" className="py-16 px-4 overflow-hidden">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto text-center">
                      <h2 className="text-3xl text-foreground mb-8">{WEDDING_CONFIG.messages.sectionTitles.couple}</h2>
                      <div className="grid grid-cols-2 gap-4 mb-12">
                          <Card className="p-4 bg-card border-border flex flex-col">
                              <div
                                  className="w-32 h-32 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden relative">
                                  {WEDDING_CONFIG.images.groomPhoto ? (
                                      <Image
                                          src={WEDDING_CONFIG.images.groomPhoto}
                                          alt="신랑"
                                          fill
                                          className="object-cover"
                                          sizes="128px"
                                          quality={75}
                                          priority
                                      />
                                  ) : (
                                      <span className="text-2xl">{WEDDING_CONFIG.groom.emoji}</span>
                                  )}
                              </div>
                              <div className="flex flex-col flex-grow">
                                  <h3 className="text-xl text-card-foreground mb-2">{WEDDING_CONFIG.groom.name}</h3>
                                  <p className="text-sm text-muted-foreground">{`${WEDDING_CONFIG.groom.engFirstName} ${WEDDING_CONFIG.groom.englishName}`}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{WEDDING_CONFIG.groom.parents}</p>
                              </div>
                          </Card>

                          <Card className="p-4 bg-card border-border flex flex-col">
                              <div
                                  className="w-32 h-32 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden relative">
                                  {WEDDING_CONFIG.images.bridePhoto ? (
                                      <Image
                                          src={WEDDING_CONFIG.images.bridePhoto}
                                          alt="신부"
                                          fill
                                          className="object-cover"
                                          sizes="128px"
                                          quality={75}
                                          priority
                                      />
                                  ) : (
                                      <span className="text-2xl">{WEDDING_CONFIG.bride.emoji}</span>
                                  )}
                              </div>
                              <div className="flex flex-col flex-grow">
                                  <h3 className="text-xl text-card-foreground mb-2">{WEDDING_CONFIG.bride.name}</h3>
                                  <p className="text-sm text-muted-foreground">{`${WEDDING_CONFIG.bride.engFirstName} ${WEDDING_CONFIG.bride.englishName}`}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{WEDDING_CONFIG.bride.parents}</p>
                              </div>
                          </Card>
                      </div>
                      {/*    <AnimateOnScroll className="py-16">*/}
                      {/*  <SectionDivider />*/}
                      {/*</AnimateOnScroll>*/}
                      <div className="bg-muted/50 rounded-lg p-6 text-center">
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
                      <DdayCounter/>
                  </div>
              </AnimateOnScroll>
          </section>

          <AnimateOnScroll className="py-16">
              <SectionDivider/>
          </AnimateOnScroll>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          {/* Wedding Details */}
          <section id="details" className="py-16 px-4 bg-muted/30 overflow-hidden">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto">
                      <h2 className="text-3xl text-center text-foreground mb-12">
                          {WEDDING_CONFIG.messages.sectionTitles.details}
                      </h2>

                      <div className="space-y-6">
                          <Card className="p-6 bg-card border-border">
                              <div className="flex items-center gap-4 mb-0">
                                  <Calendar className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.date}</h3>
                              </div>
                              <p className="text-card-foreground font-medium">{formatDate(weddingDate)}</p>
                          </Card>

                          <Card className="p-6 bg-card border-border">
                              <div className="flex items-center gap-4 mb-0">
                                  <Clock className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.time}</h3>
                              </div>
                              <p className="text-card-foreground font-medium"> {formatTime(weddingDate)}</p>
                          </Card>

                          <Card className="p-6 bg-card border-border">
                              <div className="flex items-center gap-4 mb-0">
                                  <MapPin className="w-6 h-6 text-wedding-green"/>
                                  <h3 className="text-lg font-medium text-card-foreground">{WEDDING_CONFIG.messages.labels.location}</h3>
                              </div>
                              <div className="space-y-1">
                                  <p className="text-card-foreground font-medium">{WEDDING_CONFIG.venue.name}</p>
                                  <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.venue.hall}</p>
                                  <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.venue.address}</p>
                              </div>
                          </Card>
                      </div>
                  </div>
              </AnimateOnScroll>
          </section>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          <AnimateOnScroll className="py-16">
              <SectionDivider/>
          </AnimateOnScroll>

          {/* Location Section */}
          <section id="location" className="py-16 px-4 overflow-hidden">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto">
                      <div className="text-center mb-8">
                          <h2 className="text-2xl text-foreground mb-2">
                              {WEDDING_CONFIG.messages.sectionTitles.location}
                          </h2>
                      </div>

                      {/* 구글 맵 임베드 */}
                      <Card className="p-4 bg-card border-border mb-4">
                          <div className="aspect-video rounded-lg overflow-hidden mb-3">
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
                      <div className="grid grid-cols-2 gap-3 mb-8">
                          <Button
                              onClick={() => window.open(WEDDING_CONFIG.venue.naverMapUrl, "_blank")}
                              className="hover:bg-wedding-teal text-white py-3 bg-[#ffbe53]"
                          >
                              {WEDDING_CONFIG.messages.naverMapButton}
                          </Button>
                          <Button
                              onClick={() => window.open(WEDDING_CONFIG.venue.kakaoMapUrl, "_blank")}
                              className="hover:bg-wedding-teal text-white py-3 bg-[#ffbe53]"
                          >
                              {WEDDING_CONFIG.messages.kakaoMapButton}
                          </Button>
                      </div>

                      {/* 대중교통 안내 */}
                      <Card className="p-6 bg-card border-border mb-6">
                          <div>
                              <h3 className="text-lg font-medium text-card-foreground mb-0 flex items-center gap-2">
                                  {WEDDING_CONFIG.messages.sectionTitles.publicTransport}
                              </h3>
                          </div>

                          <div className="space-y-4 text-sm">
                              {/* 기차 KTX */}
                              <div>
                                  <h4 className="font-medium text-card-foreground mb-2">{WEDDING_CONFIG.messages.labels.trainKTX}</h4>
                                  <p className="text-muted-foreground">{WEDDING_CONFIG.transportation.publicTransport.train.ktx}</p>
                              </div>

                              {/* 버스 KTX */}
                              <div>
                                  <h4 className="font-medium text-card-foreground mb-2">{WEDDING_CONFIG.messages.labels.busKTX}</h4>
                                  <div className="space-y-1">
                                      <p className="text-muted-foreground">
                                          <span
                                              className="font-medium">{WEDDING_CONFIG.messages.labels.localBus} :</span>{" "}
                                          {WEDDING_CONFIG.transportation.publicTransport.bus.ktx.local}
                                      </p>
                                      <p className="text-muted-foreground">
                                          <span
                                              className="font-medium">{WEDDING_CONFIG.messages.labels.expressBus} :</span>{" "}
                                          {WEDDING_CONFIG.transportation.publicTransport.bus.ktx.express}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </Card>

                      {/* 자가용 안내 */}
                      <Card className="p-6 bg-card border-border">
                          <div>
                              <h3 className="text-lg font-medium text-card-foreground mb-0 flex items-center gap-2">
                                  {WEDDING_CONFIG.messages.sectionTitles.carGuide}
                              </h3>
                          </div>

                          <div className="space-y-4 text-sm">
                              {/* 주소 */}
                              <div>
                                  <h4 className="font-medium text-card-foreground mb-2">{WEDDING_CONFIG.messages.labels.address}</h4>
                                  <p className="text-muted-foreground">{WEDDING_CONFIG.transportation.car.address}</p>
                              </div>

                              {/* 남구미 IC에서 오실 때 */}
                              <div>
                                  <h4 className="font-medium text-card-foreground mb-2">{WEDDING_CONFIG.messages.labels.southGumiIC}</h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                      {WEDDING_CONFIG.transportation.car.routes.southGumi.split("\n").map((line, index) => (
                                          <span key={index}>
                      {line}
                                              {index < WEDDING_CONFIG.transportation.car.routes.southGumi.split("\n").length - 1 &&
                                                  <br/>}
                    </span>
                                      ))}
                                  </p>
                              </div>

                              {/* 구미 IC에서 오실 때 */}
                              <div>
                                  <h4 className="font-medium text-card-foreground mb-2">{WEDDING_CONFIG.messages.labels.gumiIC}</h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                      {WEDDING_CONFIG.transportation.car.routes.gumiIC.split("\n").map((line, index) => (
                                          <span key={index}>
                      {line}
                                              {index < WEDDING_CONFIG.transportation.car.routes.gumiIC.split("\n").length - 1 &&
                                                  <br/>}
                    </span>
                                      ))}
                                  </p>
                              </div>
                          </div>
                      </Card>
                  </div>
              </AnimateOnScroll>
          </section>

          <AnimateOnScroll className="py-16">
              <SectionDivider/>
          </AnimateOnScroll>

          <section id="gallery" className="py-16 px-4 bg-muted/30 overflow-hidden">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto">
                      <h2 className="text-3xl    text-center text-foreground mb-12">
                          {WEDDING_CONFIG.messages.sectionTitles.gallery}
                      </h2>

                      {/* 메인 사진 영역 */}
                      <Card className="p-4 bg-card border-border mb-6">
                          <div className="relative rounded-lg overflow-hidden mb-3">
                              <div className="relative w-full aspect-[3/4] bg-muted/20 rounded-lg overflow-hidden">
                                  <Image
                                      src={WEDDING_CONFIG.images.gallery[selectedImageIndex]?.url || "/placeholder.svg"}
                                      alt={WEDDING_CONFIG.images.gallery[selectedImageIndex]?.alt || "웨딩 사진"}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 400px"
                                      quality={75}
                                      priority={selectedImageIndex === 0}
                                  />

                                  {/* 이전/다음 버튼 */}
                                  <button
                                      onClick={prevImage}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-wedding-teal text-white p-2 rounded-full transition-all bg-wedding-green opacity-90"
                                  >
                                      <ChevronLeft className="w-4 h-4"/>
                                  </button>
                                  <button
                                      onClick={nextImage}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-wedding-teal text-white p-2 rounded-full transition-all bg-wedding-green opacity-90"
                                  >
                                      <ChevronRight className="w-4 h-4"/>
                                  </button>

                                  {/* 사진 설명 */}
                              </div>
                          </div>

                          {/* 사진 인덱스 표시 */}
                      </Card>

                      {/* 썸네일 슬라이더 */}
                      <Card className="p-4 bg-card border-border border px-0.5 py-3.5">
                          <div className="relative">
                              <div
                                  className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-[5px] flex-row items-end pb-0">
                                  {WEDDING_CONFIG.images.gallery.map((image, index) => (
                                      <button
                                          key={image.id}
                                          onClick={() => selectImage(index)}
                                          className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start relative ${
                                              selectedImageIndex === index
                                                  ? "border-wedding-green shadow-lg"
                                                  : "border-transparent hover:border-wedding-lime hover:scale-102"
                                          }`}
                                      >
                                          <Image
                                              src={image.url || "/placeholder.svg"}
                                              alt={image.alt}
                                              fill
                                              className="object-cover"
                                              sizes="64px"
                                              quality={60}
                                          />
                                      </button>
                                  ))}
                              </div>

                              <div className="text-center mt-2"></div>
                          </div>
                      </Card>
                  </div>
              </AnimateOnScroll>
          </section>

          <AnimateOnScroll className="py-16">
              <SectionDivider/>
          </AnimateOnScroll>

          {/* Contact Section */}
          <section id="contact" className="py-16 px-4 overflow-hidden">
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
                                  className="h-auto p-4 bg-card hover:bg-card/80 text-card-foreground border border-border"
                                  variant="outline"
                              >
                                  <div className="text-center">
                                      <h4 className="font-medium mb-1">{WEDDING_CONFIG.messages.labels.groomAccountButton}</h4>
                                      <p className="text-sm text-muted-foreground">{WEDDING_CONFIG.accounts.groom.accountHolder}</p>
                                  </div>
                              </Button>

                              <Button
                                  onClick={() => setAccountModal("bride")}
                                  className="h-auto p-4 bg-card hover:bg-card/80 text-card-foreground border border-border"
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
              </AnimateOnScroll>
          </section>

          <AnimateOnScroll className="py-8">
              <SectionDivider/>
          </AnimateOnScroll>

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

          {/* Footer */}
          <footer className="py-8 px-4 text-center overflow-hidden">
              <AnimateOnScroll>
                  <div className="max-w-md mx-auto">
                      <div className="space-y-4">
                          <h3 className="text-lg font-medium text-foreground mb-4">청첩장 공유하기</h3>

                          <div className="flex flex-col gap-3">
                              {/* 카카오톡 공유 버튼 */}
                              <Button
                                  onClick={() => {
                                      // 실제 카카오톡 SDK 연동 시 위의 shareToKakao() 함수 호출
                                      alert("카카오톡 SDK 연동 후 사용 가능합니다.\n위의 주석 가이드라인을 참고해주세요.")
                                  }}
                                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg"
                              >
                                  💬 카카오톡으로 공유하기
                              </Button>

                              {/* URL 복사 버튼 */}

                              {/* 기본 공유 버튼 (Web Share API) */}

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

          {/* Navigation Dots */}
          {WEDDING_CONFIG.features.showNavigationDots && (
              <div
                  className={`fixed ${WEDDING_CONFIG.styles.navigationPosition} top-1/2 transform -translate-y-1/2 z-50`}>
                  <div className="flex flex-col gap-2">
                      {sections.map((_, index) => (
                          <button
                              key={index}
                              onClick={() => scrollToSection(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  currentSection === index
                                      ? "bg-primary scale-125"
                                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                              }`}
                          />
                      ))}
                  </div>
              </div>
          )}
      </div>
  )
}
