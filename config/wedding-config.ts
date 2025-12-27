// ========================================
// 🎯 청첩장 설정 - 여기만 수정하세요!
// ========================================

export const WEDDING_CONFIG = {
  // 👰🤵 신랑신부 정보
  groom: {
    name: "최봉석",
    engFirstName: "Choi",
    englishName: "Bong Seok",
    parents: "석명순의 아들",
    emoji: "👨",
    phone: "010-4404-1519",
    motherPhone: "010-5232-9720",
  },
  bride: {
    name: "김가율",
    engFirstName: "Kim",
    englishName: "Ga Yul",
    parents: "김상준의 딸",
    emoji: "👩",
    phone: "010-8790-1519",
    fatherPhone: "010-6600-4422",
  },

  // 📅 결혼식 날짜 및 시간
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
    parking: "제1주차장(야외), 제2주차장(실내)이가 예식홀과 가장 가깝습니다.",
  },

  // 🚇 교통 정보
  transportation: {
    publicTransport: {
      train: {
        ktx: "동대구역 → 구미역 → 대중교통 이용(30분~50분 소요)",
      },
      bus: {
        ktx: {
          local: "187, 187-1, 188",
          express: "180, 881, 881-1, 883, 883-1, 884, 884-1, 884-2, 885, 885",
        },
      },
    },
    car: {
      address: "경상북도 구미시 인동35길 46",
      routes: {
        southGumi: "녹동강 변도로(좌회전) → 구미대교 → 인동광장 → 대구,가산 방향 → 롯데리아 사거리(좌회전)",
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
    viewInvitationButton: "초대장 보기",
    naverMapButton: "🗺️ 네이버 지도",
    kakaoMapButton: "🏢 카카오맵",
    viewLargerMapText: "View larger map",
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
    heroBackground: "/images/wedding-07.jpeg",
    backgroundPosition: "center bottom",
    groomPhoto: "/images/wedding-99.jpeg",
    bridePhoto: "/images/wedding-98.jpeg",
    couplePhoto: "/images/wedding-10.jpeg",
    venuePhoto: "",
    gallery: [
      { id: 1, url: "/images/wedding-02.jpeg", alt: "", description: "for Vietnam" },
      { id: 2, url: "/images/wedding-05.jpeg", alt: "", description: "for Vietnam" },
      { id: 3, url: "/images/wedding-01.jpeg", alt: "취미생활", description: "골프를 좋아하는 우리" },
      { id: 4, url: "/images/wedding-15.jpeg", alt: "반국투어", description: "우리의 추억, 반국투어" },
      { id: 5, url: "/images/wedding-26.jpeg", alt: "세부여행", description: "오빠의 첫 해외여행" },
      { id: 6, url: "/images/wedding-30.jpeg", alt: "강원도 여행", description: "육백마지기에서 우리" },
      { id: 7, url: "/images/wedding-42.jpeg", alt: "오이도에서", description: "살뺀 가율이가 그립다네요" },
      { id: 8, url: "/images/wedding-34.jpeg", alt: "연애 초반의 우리", description: "정말 풋풋했구나." },
      { id: 9, url: "/images/wedding-46.jpeg", alt: "벚꽃", description: "벚꽃을 보러 간 저녁" },
      { id: 10, url: "/images/wedding-43.jpeg", alt: "파주데이트", description: "눈이 엄청 많이왔지" },
    ],
  },

  // 💳 계좌 정보
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
    heroOverlayOpacity: 0.65,
    heroContentMarginTop: "mt-64",
    navigationPosition: "right-4",
  },

  // ⚙️ 기능 설정
  features: {
    showNavigationDots: true,
    smoothScroll: true,
    copySuccessTimeout: 2000,
    galleryDefaultIndex: 0,
  },
}

export const sections = ["invitation", "couple", "message", "details", "location1", "location2", "gallery", "contact"]
