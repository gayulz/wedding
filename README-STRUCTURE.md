# 🎉 Wedding Invitation 프로젝트 구조

## 📁 파일 구조

```
wedding-invitation/
├── app/
│   └── page.tsx                    # 메인 페이지 (간소화됨)
├── components/
│   └── wedding/
│       ├── AnimateOnScroll.tsx     # 스크롤 애니메이션 컴포넌트
│       ├── SectionDivider.tsx      # 섹션 구분선
│       ├── DdayCounter.tsx         # D-day 카운터 (FlipChar, FlipDigit 포함)
│       └── Footer.tsx              # 하단 고정 푸터
└── config/
    └── wedding-config.ts            # 청첩장 설정 데이터
```

## ✨ 주요 컴포넌트

### 1. **wedding-config.ts**
- 모든 청첩장 설정 데이터 (신랑신부 정보, 날짜, 장소, 메시지 등)
- 이 파일만 수정하면 내용 변경 가능

### 2. **AnimateOnScroll.tsx**
- Intersection Observer API 사용
- 스크롤 시 fade-in-up 애니메이션

### 3. **SectionDivider.tsx**
- 하트 아이콘이 있는 섹션 구분선

### 4. **DdayCounter.tsx**
- D-day 계산 및 플립 애니메이션
- 결혼 전/당일/후 상태별 다른 메시지

### 5. **Footer.tsx**
- 스크롤 시 하단에 나타나는 고정 푸터
- 신랑신부 이름, 날짜, 카카오톡 공유 버튼

## 🔧 수정 방법

### 청첩장 내용 수정
`config/wedding-config.ts` 파일의 WEDDING_CONFIG 객체만 수정

### 스타일 수정
- Tailwind CSS 사용
- `tailwind.config.mjs`에 커스텀 색상 정의됨

### 새 섹션 추가
1. `components/wedding/` 폴더에 새 컴포넌트 생성
2. `app/page.tsx`에서 import 후 사용

## 🎨 컬러 팔레트

- `wedding-gold`: #ffbe53
- `wedding-lime`: #a6b550  
- `wedding-green`: #58a166
- `wedding-teal`: #148677
- `wedding-blue`: #146772
- `wedding-navy`: #2f4858

## 📝 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속
