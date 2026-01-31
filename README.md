# Wedding Invitation

모바일 중심의 인터랙티브 디지털 청첩장

Live Demo: [bong-yul-invitation.netlify.app](https://bong-yul-invitation.netlify.app)

---

## Tech Stack

| Category | Stack |
|----------|-------|
| Frontend | React 19, TypeScript, Vite |
| Animation | Framer Motion |
| Database | Firebase Firestore |
| Hosting | Netlify / Vercel |
| CDN | Cloudinary |

---

## Features

- 풀스크린 슬라이드 네비게이션 (휠, 터치, 드래그)
- 날짜 기반 자동 화면 전환 (결혼식 이후 감사 페이지)
- 실시간 방명록 및 참석 여부 응답
- 카카오톡 공유, 네이버 지도 연동
- 민감정보 보호 (Serverless Functions 활용)

---

## Quick Start

```bash
git clone https://github.com/gayulz/wedding-invitation.git
cd wedding-invitation
npm install
cp .env.example .env.local
npm run dev
```

개발 서버: `http://localhost:5173`

---

## Project Structure

```
wedding-invitation/
├── api/                    # Vercel Serverless Functions
├── netlify/functions/      # Netlify Serverless Functions
├── components/
│   ├── Admin/              # 관리자 페이지
│   ├── Hero.tsx            # 메인 화면
│   ├── Gallery.tsx         # 포토 갤러리
│   ├── Guestbook.tsx       # 방명록
│   ├── Rsvp.tsx            # 참석 여부
│   ├── Location.tsx        # 오시는 길
│   └── ...
├── config/
│   ├── images.ts           # Cloudinary 이미지 URL
│   └── site.ts             # 사이트 설정
├── lib/
│   └── firebase.ts         # Firebase 초기화
└── App.tsx
```

---

## Environment Variables

### Client (VITE_)
브라우저에 노출되는 API 키. 도메인 제한 설정 권장.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
VITE_KAKAO_API_KEY=
VITE_NAVER_MAP_CLIENT_ID=
```

### Server (PRIVATE_)
Serverless Functions에서만 사용. 절대 클라이언트에 노출되지 않음.

```env
PRIVATE_GROOM_NAME=
PRIVATE_GROOM_PHONE=
PRIVATE_BRIDE_NAME=
PRIVATE_BRIDE_PHONE=
PRIVATE_GROOM_ACCOUNT=
PRIVATE_BRIDE_ACCOUNT=
```

전체 목록은 `.env.example` 참조.

---

## Deployment

### Netlify

1. Dashboard → Site settings → Environment variables에 모든 환경변수 등록
2. Functions 디렉토리: `netlify/functions`
3. API 경로 자동 리다이렉트 설정 완료 (`netlify.toml`)

### Vercel

1. Settings → Environment Variables에 환경변수 등록
2. `api/private-info.ts`의 CORS 허용 도메인에 본인 도메인 추가 필요:

```typescript
const ALLOWED_ORIGINS = [
    'https://your-domain.vercel.app',
    'http://localhost:5173'
];
```

---

## Image CDN (Cloudinary)

이미지는 Cloudinary에서 호스팅. `config/images.ts`에서 URL 관리.

```typescript
export const imageUrls = {
    'wedding-01': 'https://res.cloudinary.com/.../image.jpg',
    // ...
};
```

무료 계정으로 충분히 사용 가능.

---

## Firestore 구조

| 컬렉션 | 용도 | 필드 |
|--------|------|------|
| `guestbook` | 방명록 | name, password, message, createdAt |
| `rsvp` | 참석 여부 | guest, guest_name, guest_phone, visited, adult_count, child_count, timestamp |
| `bodmin` | 관리자 인증 | id, pwd |

### Firestore Security Rules 예시

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{doc} { allow read, write: if true; }
    match /rsvp/{doc} { allow read, write: if true; }
    match /bodmin/{doc} { allow read: if true; }
  }
}
```

---

## 관리자 페이지

URL 뒤에 `?admin=true` 추가하여 접근:

```
https://your-domain.netlify.app?admin=true
```

Firebase Console에서 `bodmin` 컬렉션에 `admin` 문서 생성 후 `id`, `pwd` 필드 설정 필요.

---

## License

This project is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
비상업적 용도로만 사용 가능합니다.

---

## Contact

- 문의사항은 [Issues](https://github.com/gayulz/wedding-invitation/issues)에 남겨주세요
- Email: gayulz@kakao.com
