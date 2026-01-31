# 💍 Wedding Invitation - 디지털 청첩장

> 사랑하는 두 사람의 특별한 순간을 위한 인터랙티브 웹 청첩장

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 프로젝트 소개

친구들과 가족을 위한 모던하고 인터랙티브한 웹 청첩장입니다. 전통적인 종이 청첩장을 넘어, 웹 기술을 활용해 감동적이고 기억에 남는 초대 경험을 제공합니다.

### ✨ 주요 특징

#### 🎨 **우아한 UX/UI**
- **풀페이지 슬라이드 네비게이션**: 마우스 휠, 터치 제스처로 자연스러운 섹션 전환
- **Framer Motion 애니메이션**: 부드러운 페이드/슬라이드 전환 효과
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **오프닝 시퀀스**: 첫 방문 시 감동적인 인트로 애니메이션

#### 📱 **인터랙티브 기능**
- **실시간 방명록**: Firebase Firestore 기반 CRUD 기능
  - 비밀번호 보호 수정/삭제
  - 실시간 업데이트 (`onSnapshot`)
  - 커스텀 Alert 디자인
- **카카오톡 공유**: Kakao SDK 통합
- **네이버 지도 연동**: 예식장 위치 및 교통편 안내
- **갤러리**: 드래그 가능한 이미지 캐러셀

#### 🚀 **고급 기술 구현**
- **날짜 기반 자동 화면 전환**: 결혼식 당일 이후 자동으로 감사 페이지 표시
- **이미지 프리로딩**: 갤러리 이미지 백그라운드 로딩으로 UX 최적화
- **브라우저 감지**: 카카오톡 인앱 브라우저 사용자에게 외부 브라우저 권장
- **GPU 가속**: `transform: translateZ(0)` 활용한 성능 최적화

---

## 🛠️ 기술 스택

### Frontend
- **React 19** - 최신 React concurrent features
- **TypeScript 5.8** - 타입 안정성
- **Vite 6.2** - 빠른 개발 환경 및 빌드
- **Framer Motion 12.23** - 애니메이션 라이브러리
- **Tailwind CSS 3.4** - 유틸리티 기반 스타일링

### Backend & Services
- **Firebase Firestore** - NoSQL 데이터베이스 (방명록)
- **Kakao API** - 카카오톡 공유하기
- **Naver Map API** - 지도 서비스

### Deployment
- **Netlify** - CI/CD 자동 배포
- **Git** - 버전 관리

---

## 📂 프로젝트 구조

```
wedding-invitation/
├── components/
│   ├── Hero.tsx                # 메인 히어로 섹션
│   ├── Intro.tsx               # 소개 및 연락처
│   ├── Profiles.tsx            # 신랑신부 인터뷰
│   ├── Gallery.tsx             # 포토 갤러리
│   ├── Location.tsx            # 지도 및 오시는 길
│   ├── Transport.tsx           # 교통편 안내
│   ├── Gift.tsx                # 계좌번호 안내
│   ├── Guestbook.tsx           # Firebase 방명록
│   ├── ThankYou.tsx            # 결혼 후 감사 페이지
│   ├── ShareButton.tsx         # 카카오톡 공유 버튼
│   ├── OpeningSequence.tsx     # 오프닝 애니메이션
│   └── ForsythiaParticles.tsx  # 배경 파티클 효과
├── lib/
│   ├── firebase.ts             # Firebase 설정
│   └── image-loader.ts         # 이미지 프리로딩 유틸
├── data/
│   └── content.ts              # 모든 텍스트 컨텐츠 관리
├── hooks/
│   └── useModalBackHandler.ts  # 모달 뒤로가기 핸들링
├── App.tsx                     # 메인 앱 컴포넌트
└── index.tsx                   # 엔트리 포인트
```

---

## 🎯 핵심 구현 기능

### 1. 날짜 기반 자동 화면 전환

결혼식 당일(2026-03-14 14:00) 이후 자동으로 감사 페이지로 전환됩니다.

```typescript
// App.tsx
const weddingDate = new Date('2026-03-14T14:00:00');
const isAfterWedding = new Date() >= weddingDate;

if (isAfterWedding) {
  return <ThankYou onModalStateChange={setIsAnyModalOpen} />;
}
```

### 2. 실시간 방명록 (Firebase)

```typescript
// Guestbook.tsx
useEffect(() => {
  const q = query(
    collection(db, 'guestbook'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const newEntries: GuestbookEntry[] = [];
    snapshot.forEach((doc) => {
      newEntries.push({ id: doc.id, ...doc.data() } as GuestbookEntry);
    });
    setEntries(newEntries);
  });

  return () => unsubscribe();
}, []);
```

### 3. 풀페이지 네비게이션

마우스 휠, 터치 제스처를 감지하여 섹션 전환을 제어합니다.

```typescript
// App.tsx
const handleScroll = useCallback((delta: number) => {
  if (isScrolling || isAnyModalOpen) return;

  if (delta > 0 && currentIdx < SECTIONS.length - 1) {
    setCurrentIdx(prev => prev + 1);
  } else if (delta < 0 && currentIdx > 0) {
    setCurrentIdx(prev => prev - 1);
  }
}, [isScrolling, currentIdx, isAnyModalOpen]);
```

### 4. 이미지 프리로딩

갤러리 이미지를 백그라운드에서 미리 로드하여 사용자 경험을 개선합니다.

```typescript
// lib/image-loader.ts
export const preloadGalleryImages = () => {
  const imagePromises = Array.from({ length: 12 }, (_, i) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `/optimized-images/wedding-${i + 1}.webp`;
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  return Promise.all(imagePromises);
};
```

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/wedding-invitation.git
cd wedding-invitation

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Firebase, Kakao, Naver API 키 입력

# 4. 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

---

## 🔧 환경 변수 설정

`.env.local` 파일을 생성하고 다음 키를 설정하세요:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Kakao
VITE_KAKAO_API_KEY=your_kakao_api_key

# Naver
VITE_NAVER_MAP_CLIENT_ID=your_naver_client_id
```

---

## 📱 주요 화면

### 1. Hero - 메인 랜딩
- Ken Burns 효과가 적용된 배경 이미지
- 신랑신부 이름, 날짜, 장소 정보
- 자동 스크롤 유도 애니메이션

### 2. Intro - 초대 메시지
- 결혼 인사말
- 부모님 성함 및 관계
- 연락처 모달 (전화/문자 바로 연결)

### 3. Profiles - 인터뷰
- Q&A 형식의 신랑신부 소개
- 아코디언 UI로 접고 펼치기

### 4. Gallery - 포토 갤러리
- 12장의 사진 캐러셀
- 드래그 제스처 지원
- 이미지 확대 팝업

### 5. Location - 오시는 길
- 네이버 지도 임베드
- 주소 복사 기능
- 네이버/티맵/카카오맵 네비게이션 링크

### 6. Transport - 교통편 안내
- 자가용, 버스, 기차 안내
- 아코디언 UI로 정보 확인

### 7. Gift - 마음 전하실 곳
- 신랑/신부측 계좌번호
- 원터치 복사 기능
- 탭 UI로 구분

### 8. Guestbook - 방명록
- 실시간 방명록 CRUD
- 비밀번호 보호 수정/삭제
- 페이지네이션 (더보기/접기)

### 9. ThankYou - 감사 페이지 (결혼 후)
- 결혼 후 경과일 자동 계산
- 감사 메시지
- 기존 방명록 유지

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Background**: `#f8f8f8` (밝은 회색)
- **Dark Background**: `#0a0a0c` (거의 검은색)
- **Primary Text**: `#1a1a1a` (진한 회색)
- **Accent**: `#8E8E8E` (중간 회색)

### 타이포그래피
- **제목**: Myeongjo (명조체)
- **본문**: Gowoon (고운체)
- **영문**: Joseon (조선체)
- **숫자/UI**: Nanum Square (나눔스퀘어)

### 애니메이션
- **섹션 전환**: 0.6초 ease-in-out
- **모달**: 0.3초 scale + opacity
- **호버**: 0.2초 transition

---

## 📊 성능 최적화

- ✅ **이미지 최적화**: WebP 포맷 사용 (`/optimized-images/*.webp`)
- ✅ **프리로딩**: 갤러리 이미지 백그라운드 로딩
- ✅ **GPU 가속**: `transform: translateZ(0)` 적용
- ✅ **코드 스플리팅**: Vite 자동 청크 분할
- ✅ **캐싱**: Netlify 1년 immutable 캐시 설정
- ✅ **Tree Shaking**: Tailwind CSS 미사용 스타일 제거

---

## 🔒 보안

- Firebase 클라이언트 키는 클라이언트 측에서 사용되므로 Netlify Secrets Scanning에서 제외
- Firestore Security Rules로 데이터 접근 제어
- 방명록 수정/삭제는 4자리 숫자 비밀번호로 보호 (클라이언트 측 검증)

---

## 📝 라이선스

This project is for personal use.

---

## 👤 개발자

**Gayul Kim**

- 백엔드 개발자에서 풀스택으로 성장 중
- 사용 기술: React, TypeScript, Firebase, Spring Boot

---

## 🙏 감사의 말

이 프로젝트는 소중한 사람들과의 특별한 순간을 기념하기 위해 만들어졌습니다.

---

<div align="center">

**Made with ❤️ by Gayul Kim**

</div>
