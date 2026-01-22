# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

이 저장소는 **한국어를 기본 커뮤니케이션 언어**로 사용합니다:

- **기본 응답 언어**: 한국어로 답변 및 설명 제공
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 준수 (코드 표준)

---

## Project Overview

This is a luxury wedding invitation website built with React, TypeScript, and Vite. It's a full-page interactive experience with smooth transitions between sections, deployed on Netlify. The site integrates Firebase for data persistence and includes AI photo generation capabilities via Google Gemini API.

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build locally
```

## Environment Setup

Create a `.env.local` file in the root with the following variables:

```
VITE_FIREBASE_API_KEY=firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
VITE_FIREBASE_MEASUREMENT_ID=measurement_id
VITE_KAKAO_API_KEY=kakao_api_key
VITE_NAVER_MAP_CLIENT_ID=naver_client_id
```

These are exposed as client-side variables and are intentionally excluded from Netlify's secrets scanning (see netlify.toml).

## Architecture

### Page Navigation Model

The app uses a **full-page slide/section-based navigation** pattern:

- **Single Page Structure**: `App.tsx` manages state for which section to display (0-7)
- **8 Distinct Sections**: Hero → Intro → Profiles → Gallery → Location → Transport → Gift → Guestbook
- **Scroll/Touch-Triggered**: Users navigate via mouse wheel, trackpad scroll, or touch swipe gestures
- **Smooth Transitions**: Framer Motion provides fade + slide animations (0.6s duration) between sections

### Key Navigation Logic (`App.tsx:48-60`)

- Scroll up (`delta < 0`) decrements index; scroll down (`delta > 0`) increments
- Implements debouncing (800ms) to prevent rapid section jumps
- Supports both wheel and touch events (touch threshold: 50px delta)

- KakaoTalk webview detection prompts users to open in external browser for better performance

### Component Structure

```
components/
├── Hero.tsx               # Landing section with call-to-action
├── Intro.tsx              # Wedding introduction/details
├── Profiles.tsx           # Bride and groom profiles
├── Gallery.tsx            # Photo carousel with drag gestures (12 preloaded images)
├── Location.tsx           # Naver Map integration and venue location
├── Transport.tsx          # Transportation information
├── Gift.tsx               # Registry/gift information
├── Guestbook.tsx          # Firebase-backed guestbook with CRUD operations
├── ShareButton.tsx        # Kakao Share integration

└── FloatingParticles.tsx  # Animated background particles effect
```

### Data Layer

- **Firebase Firestore** (`lib/firebase.ts`): Stores guestbook entries with real-time updates
  - Collection: `guestbook`
  - Fields: `name`, `password` (4-digit numeric), `message`, `createdAt` (Timestamp)
  - Operations: Create, Read (real-time with `onSnapshot`), Update (password-protected)
- **Static Data**: Most content is hardcoded or imported from `metadata.json`

## Styling & Theming

- **Tailwind CSS**: Primary styling framework (configured in Vite)
- **Dark Theme**: Default background is `#0a0a0c` (near-black)
- **Framer Motion**: Animations and transitions (v12.23.26)
- **Responsive**: Mobile-first design with breakpoints handled through Tailwind

## Build Configuration

### Vite (`vite.config.ts`)

- **Development Server**: Port 3000, accessible from all interfaces (`0.0.0.0`)
- **Path Alias**: `@/*` resolves to project root

### TypeScript (`tsconfig.json`)

- **Target**: ES2022
- **Module**: ESNext
- **Module Resolution**: Bundler (optimized for Vite/modern bundlers)
- **JSX**: React 17+ auto runtime
- **Strict Checks**: Enabled (no `skipLibCheck` leniency)

## Deployment (Netlify)

See `netlify.toml` for configuration:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist/`
- **Node Version**: 20
- **SPA Fallback**: All routes redirect to `index.html` (status 200)
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Cache Policy**:
  - Static assets (JS, CSS, images): 1 year immutable cache
  - HTML: Default caching
- **Secrets Scanning**: Client-side Firebase/Gemini keys are excluded from scanning

## Performance Considerations

- **Image Preloading**: Gallery component preloads all 12 images before rendering (`/optimized-images/wedding-*.webp`)
- **Lazy Loading**: Components mount/unmount based on section visibility via `AnimatePresence`
- **Touch Optimization**: Touch events have 50px sensitivity threshold to prevent accidental scrolls
- **CSS-in-Tailwind**: No external CSS files needed; tree-shaking removes unused styles
- **Browser-Specific Optimizations**:
  - Guestbook adapts display count based on browser (KakaoTalk: 3 items, Chrome: 4 items, Others: 5 items)
  - KakaoTalk users see browser switch prompt for better experience

## Testing & Debugging

Currently no test framework is set up. Tests would likely be integrated via:
- **Vitest** (Vite-native, low config)
- **React Testing Library** (component testing)
- **Playwright** (E2E testing)

To check for TypeScript errors without building:
```bash
# TypeScript has noEmit set to true, so run tsc separately if needed:
npx tsc --noEmit
```

## Dependencies

- **React 19+**: Latest with concurrent features
- **Framer Motion 12.23+**: Animation library (used for page transitions, carousels, accordions)
- **Firebase 12.7+**: Cloud Firestore for guestbook data
- **Vite 6.2+**: Modern build tool
- **TypeScript 5.8+**: Type safety

## Git & Version Control

The repo is already a git repository. Recent commits focus on:
- Guestbook feature with Firebase integration
- FloatingNavMenu and FloatingParticles components
- Image preloading optimizations
- Mobile layout fixes and browser-specific optimizations
- KakaoTalk share template improvements

## Common Development Tasks

### Adding a New Section

1. Create component in `components/NewSection.tsx`
2. Import it in `App.tsx`
3. Add section name to `SECTIONS` array
4. Add conditional render in the `AnimatePresence` block
5. The navigation dots will automatically adjust

### Modifying Animations

- Edit Framer Motion `initial`, `animate`, `exit` props in `App.tsx:138-143`
- Adjust `transition` duration as needed (currently 0.6s)
- Individual components can have their own Framer Motion animations
- Gallery uses drag gestures with custom swipe detection (threshold: 10000 swipe units)

### Updating Firebase Schema

- Modify `lib/firebase.ts` to export new Firestore collections
- Import and use `db` in components like `Guestbook.tsx` (example usage pattern)

### Adjusting Mobile Responsiveness

- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Location section already has mobile-specific height limit (60vh)
- Test on actual devices or Chrome DevTools mobile emulation

### Working with Third-Party Integrations

**Kakao Share API**:
- Requires `VITE_KAKAO_API_KEY` in `.env.local`
- Used in `ShareButton.tsx` for social sharing
- Loads Kakao SDK script dynamically

**Naver Map API**:
- Requires `VITE_NAVER_MAP_CLIENT_ID` in `.env.local`
- Used in `Location.tsx` for venue map display
- Coordinates: 36.097854, 128.435753 (토미스퀘어가든)

**Firebase**:
- Config already hardcoded in `lib/firebase.ts` (public client keys)
- Real-time listener pattern used for live guestbook updates
- Password-protected edit operations (client-side validation only)
