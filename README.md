# 모바일 청첩장

제 결혼식에 실제로 쓴 모바일 청첩장입니다. 업체 견적을 받아보고 만들기 시작했다가 결국 직접 다 짰습니다. 식이 끝나고 그냥 묵히기 아까워서 공개합니다.

**데모** — [bong-yul-invitation.netlify.app](https://bong-yul-invitation.netlify.app)
오른쪽 아래 버튼으로 예식 전 화면과 예식 후 감사 화면을 오갈 수 있습니다.

> **사용 범위**
> 본인 결혼식에 쓰시는 건 무료입니다. 계정 만들고 배포하는 데 드는 돈도 없습니다.
> 대신 이 코드를 그대로 다시 배포하거나 청첩장 제작을 돈 받고 대행하는 데는 쓰실 수 없습니다.
> 자세한 조건은 [사용 범위와 라이선스](#사용-범위와-라이선스)에 적어뒀습니다.

---

## 어떤 걸 만들 수 있나

세로 화면 하나에 이 순서로 이어집니다.

| 화면 | 내용 |
|------|------|
| 오프닝 | 심장 박동 애니메이션과 함께 인사말이 한 글자씩 타이핑됩니다 |
| 히어로 | 대표 사진, 신랑신부 이름. 3.5초 뒤 자동으로 다음 화면 |
| 인사말 | 초대 문구, 양가 연락처 모달 |
| 참석 의사 | 신랑측/신부측, 참석 여부, 성인·미취학아동 인원. 같은 이름+번호로 다시 내면 덮어씁니다 |
| 인터뷰 | Q&A 세 문항. 신랑 답변과 신부 답변을 나눠 보여줍니다 |
| 갤러리 | 가로 드래그 캐러셀. 눌러서 전체화면, 스와이프로 넘김 |
| 오시는 길 | 네이버 지도, 주소 복사, 네이버·카카오·티맵 길찾기, 자가용/버스/기차 안내 |
| 마음 전하실 곳 | 양가 계좌 탭. 한 번 눌러 계좌번호 복사 |
| 방명록 | 이름·비밀번호·메시지. 비밀번호로 본인 글 수정 |
| 감사 화면 | 예식이 끝난 뒤 쓰는 별도 화면. 첫 만남 D+n, 결혼 D+n 표시 |

여기에 카카오톡 공유 카드, 개나리 꽃잎이 흩날리는 배경, 하객 응답을 확인하는 관리자 화면이 붙어 있습니다.

---

## 작업 순서

순서가 있습니다. 뒤집어서 하면 뒤에서 되돌아와야 합니다.

1. **Fork** → 본인 저장소 만들기
2. **로컬 실행** → 일단 화면이 뜨는지 확인
3. **빈 상태로 먼저 배포** → 사이트 주소를 확정
4. **외부 서비스 키 발급** → 카카오·네이버는 3번에서 정한 주소를 등록해야 합니다
5. **데모 데이터 걷어내기**
6. **내용 채우기** → 사진, 문구, 개인정보
7. **발송 전 점검**

3번을 나중으로 미루면 카카오와 네이버 콘솔에 도메인을 두 번 등록하게 됩니다. Netlify 사이트 이름을 나중에 바꾸면 그때 등록해둔 인증이 한꺼번에 깨지고요.

---

## 1. Fork

`git clone`부터 하고 싶으시겠지만, **Fork를 먼저 하세요.**

Netlify와 Vercel은 GitHub 저장소를 연결해서 배포합니다. 본인 계정에 저장소가 있어야 자동 배포가 걸립니다. 청첩장은 결혼식 전날까지 계속 고칩니다. 사진 바꾸고, 문구 바꾸고, 예식 시간 바꾸고. push 한 번에 배포되는 구조가 아니면 그 며칠이 꽤 괴롭습니다.

제가 버그를 고치면 fork에서 `Sync fork` 버튼으로 가져가실 수도 있습니다. 청첩장에는 전화번호와 계좌번호가 들어갑니다. fork해두면 어차피 내 저장소니까, 그런 값을 남의 저장소에 밀어 넣는 사고도 안 납니다.

Fork 후에는 원하는 만큼 뜯어고치셔도 됩니다. 오히려 그래주셨으면 합니다. 인터뷰 문항을 통째로 바꾸든, 갤러리를 격자로 만들든, 방명록을 빼버리든 상관없습니다. 신랑신부마다 하고 싶은 이야기가 다르니까요.

이 저장소 오른쪽 위 **Fork** 버튼을 누르시면 됩니다. 저장소 이름은 아무거나 괜찮습니다.

---

## 2. 로컬 실행

Node.js 20 이상이 필요합니다. [nodejs.org](https://nodejs.org)에서 LTS를 받으세요.

```bash
git clone https://github.com/본인아이디/저장소이름.git
cd 저장소이름
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 포트는 `vite.config.ts`에 3000으로 박혀 있습니다.

같은 와이파이를 쓰는 휴대폰에서도 볼 수 있습니다. 터미널에 찍히는 `Network:` 주소(`http://192.168.0.5:3000` 같은)를 폰 브라우저에 넣어보세요. 청첩장은 결국 폰에서 보는 물건입니다. PC 화면만 보고 다 됐다고 판단하면 나중에 후회합니다.

명령은 세 개뿐입니다.

```bash
npm run dev       # 개발 서버
npm run build     # 빌드 → dist/
npm run preview   # 빌드 결과 확인
```

테스트 코드는 없습니다. 날짜에 쫓겨 만든 물건이라 그렇습니다.

---

## 3. 먼저 배포하고 주소부터 확정하기

내용을 채우기 전에 빈 껍데기를 한 번 올려서 주소를 잡아둡니다. 카카오와 네이버 지도가 도메인 단위로 인증하기 때문입니다.

### Netlify (권장)

서버리스 함수 설정이 `netlify.toml`에 들어가 있어서 손댈 게 거의 없습니다.

1. [netlify.com](https://netlify.com)에 GitHub 계정으로 로그인
2. **Add new site → Import an existing project** → fork한 저장소 선택
3. 빌드 설정은 자동으로 잡힙니다 (`npm run build`, 배포 폴더 `dist`)
4. Deploy
5. **Site settings → Change site name**에서 사이트 이름을 정합니다

`민수-지영-wedding.netlify.app` 정도면 청첩장 주소로 충분합니다. **이 이름은 지금 정하고 나중에 바꾸지 마세요.** 바꾸는 순간 카카오·네이버에 등록해둔 도메인이 어긋나서 공유 카드와 지도가 동시에 죽습니다.

도메인을 따로 사실 필요는 없다고 봅니다. 어차피 카톡으로 링크를 보내면 주소는 잘 안 보입니다.

### Vercel

1. [vercel.com](https://vercel.com)에서 저장소를 Import
2. 프레임워크는 Vite로 자동 인식됩니다
3. 배포 후 **Settings → Domains**에서 주소 확인

Netlify와 Vercel 중 하나만 쓰시면 됩니다. 둘 다 서버리스 함수가 준비돼 있지만 굳이 병행할 이유는 없습니다.

---

## 4. 외부 서비스 키 발급

전부 무료 범위에서 됩니다. 결혼식 하나 치르는 트래픽으로 유료 구간에 갈 일은 없습니다.

발급받은 값은 로컬에서는 `.env.local`에, 배포용으로는 Netlify/Vercel 대시보드의 환경변수에 각각 넣습니다.

> **일정 안내** — 네이버 클라우드 플랫폼만 가입에 시간이 걸립니다. 휴대폰 본인인증과 신용카드 등록(소액 결제 승인 후 취소)을 거쳐야 하고, 명의 문제로 하루 이상 지연되기도 합니다. 나머지는 다 즉시 됩니다. 청첩장 발송 전날 밤에 몰아서 하지 마세요.

### Firebase — 참석 의사와 방명록 저장

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성
2. 프로젝트 개요 옆 웹 아이콘(`</>`)으로 앱 등록
3. 화면에 나오는 `firebaseConfig` 값을 `.env.local`의 `VITE_FIREBASE_*`에 옮겨 적기
4. 왼쪽 메뉴 **Firestore Database** → 데이터베이스 만들기 → 위치는 `asia-northeast3`(서울)
5. 프로덕션 모드로 시작한 뒤 [보안 규칙](#firestore-보안-규칙)을 설정

### 카카오 — 공유 카드

1. [Kakao Developers](https://developers.kakao.com)에서 애플리케이션 추가
2. **앱 키**의 **JavaScript 키**를 `VITE_KAKAO_API_KEY`에 넣기
3. **플랫폼 → Web**에 3단계에서 정한 사이트 주소와 `http://localhost:3000`을 둘 다 등록
4. **카카오 링크** 활성화

3번을 빠뜨리면 공유 버튼을 눌렀을 때 "공유 중 오류가 발생했습니다" 알림이 뜹니다. 버튼 자체가 무반응이면 그건 키가 없는 경우입니다. 증상이 다르니 구분해서 보세요.

### 네이버 지도

1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 가입
2. **Services → Application Services → Maps → Application 등록**에서 **Web Dynamic Map** 선택
3. **Web 서비스 URL**에 사이트 주소와 `http://localhost:3000` 등록
4. 발급된 Client ID를 `VITE_NAVER_MAP_CLIENT_ID`에 넣기

지금 새로 발급받으시면 **`components/Location.tsx` 35번 줄도 함께 고쳐야 합니다.** 네이버가 콘솔을 개편하면서 SDK 파라미터가 `ncpClientId`에서 `ncpKeyId`로 바뀌었습니다. 이 코드는 아직 옛 파라미터를 씁니다.

```ts
// components/Location.tsx:35 — 현재
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;

// 새 콘솔에서 발급받았다면
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
```

그리고 **29번 줄의 fallback 키를 반드시 지우세요.**

```ts
// components/Location.tsx:29
const clientId = (envClientId && envClientId.length > 5) ? envClientId : 'tmyfa04oa3';
```

환경변수가 비어 있으면 저 문자열로 넘어가는데, 제 키입니다. 제가 그 앱을 지우거나 도메인 제한을 조이면 두 분 청첩장에서 지도가 사라집니다. 하필 결혼식 당일에요.

### 티맵 (선택)

[SK open API](https://openapi.sk.com)에서 키를 받아 `VITE_TMAP_API_KEY`에 넣습니다. 안 넣으셔도 나머지는 정상 동작하고 티맵 버튼만 반응이 없습니다.

---

## 5. 데모 데이터 걷어내기

여기가 제일 중요합니다. **그냥 fork해서 배포하면 김철수·박지민의 청첩장이 나옵니다.**

제 결혼식이 끝난 뒤 실제 개인정보와 사진을 걷어내고 포트폴리오용 더미 데이터를 채워뒀기 때문입니다. 되돌려야 할 곳이 다섯 군데입니다.

### (1) 이름·연락처·계좌 — `hooks/usePrivateInfo.ts`

지금은 `fetchData` 안에서 하드코딩된 객체를 그냥 돌려줍니다. API 호출로 바꾸세요.

```ts
// 현재 — 더미 데이터를 반환
const fetchData = async (): Promise<PrivateInfo> => {
    return { groom: { name: '김철수', ... }, ... };
};

// 이렇게
const fetchData = async (): Promise<PrivateInfo> => {
    const res = await fetch('/api/private-info');
    if (!res.ok) throw new Error('민감정보를 불러오지 못했습니다');
    return res.json();
};
```

`/api/private-info`는 이미 만들어져 있습니다. Netlify는 `netlify/functions/private-info.ts`, Vercel은 `api/private-info.ts`고 둘 다 환경변수를 읽어서 같은 모양의 JSON을 돌려줍니다.

> **로컬에서는 이게 실패합니다.** `npm run dev`는 순수 Vite 서버라 `/api` 요청을 받아줄 데가 없습니다. 함수까지 같이 띄우려면 `npm i -g netlify-cli` 후 `netlify dev`를 쓰세요. 그게 번거로우면 로컬에서만 더미를 반환하도록 조건을 두셔도 됩니다.
>
> ```ts
> if (import.meta.env.DEV) return { /* 더미 */ };
> ```

### (2) 방명록 — `components/Guestbook.tsx`

Firebase 연결을 떼고 `useState`에 데모 글 세 개를 박아둔 상태입니다. 파일 4번 줄에 `// Firebase 관련 import 제거 및 로컬 데모 환경 구성`이라고 적혀 있는 부분입니다.

솔직히 말씀드리면 여기가 제일 손이 많이 갑니다. 파일이 645줄이고 데이터를 불러오던 `useEffect`가 통째로 사라진 상태라, 지우는 게 아니라 새로 써야 합니다.

- 목록 구독은 `components/Admin/GuestbookManager.tsx`의 `onSnapshot` 패턴
- 저장·수정은 `components/Rsvp.tsx`의 `addDoc` / `updateDoc` 패턴
- `MockTimestamp` 클래스를 지우고 Firestore의 `Timestamp`로 되돌리기

두 파일을 다 봐야 합니다. `GuestbookManager`에는 구독과 삭제만, `Rsvp`에는 조회와 추가·수정만 있습니다.

방명록을 빼고 가셔도 됩니다. 요즘은 축하 메시지가 카톡 단톡방에 다 모이더군요.

### (3) 감사 화면 날짜 — `config/site.ts`

`config/site.ts`의 `date.firstMeet`과 `date.iso`가 D+n 계산 기준입니다. 아직 제 날짜가 들어 있습니다.

```ts
iso: "2026-03-14T14:00:00",        // 예식 일시
firstMeet: "2020-03-31T00:00:00"   // 첫 만남
```

안 고치면 예식이 끝난 뒤 하객들이 제 연애 일수를 보게 됩니다.

`components/ThankYou.tsx` 147번 줄이 신랑신부 이름을 표시하는데, 여기는 API로 받아온 이름이 아니라 정적 기본값을 씁니다. 그래서 (1)을 고쳐도 감사 화면에는 계속 `신랑 💍 신부`로 뜹니다. Context를 쓰도록 바꾸시거나 이름을 직접 적어 넣으세요.

### (4) 사진 — `config/images.ts`

`/demo-images/*.png`를 가리키고 있습니다. 본인 사진 URL로 교체하세요. ([사진 넣기](#사진-넣기) 참고)

### (5) 데모 토글 버튼 — `App.tsx`

화면 오른쪽 아래에 떠 있는 `감사인사 보기` / `청첩장 보기` 버튼은 데모용입니다. 하객에게 보여줄 물건이 아닙니다.

`isAfterWedding` 관련 코드를 걷어내고 예식 시각 기준으로 자동 분기시키는 편이 낫습니다. 36번 줄의 `useState`를 아래처럼 바꾸고, **281번 줄과 359번 줄의 버튼 두 개를 지우세요.** 버튼이 두 개라 하나만 지우면 타입 에러가 납니다.

```tsx
// App.tsx:36
const isAfterWedding = new Date() > new Date('2026-03-14T17:00:00');
```

예식이 **끝나는** 시각으로 잡으세요. 시작 시각으로 잡으면 식장에 앉아 있는 하객이 감사 인사를 먼저 받습니다.

---

## 6. 내 청첩장으로 바꾸기

거의 다 `config/` 안에서 끝납니다. 컴포넌트를 직접 열어야 하는 건 네이버 지도 키 한 군데뿐입니다.

### 결혼식 정보 — `config/site.ts`

가장 많이 손볼 파일입니다.

```ts
export const siteConfig = {
    date: {
        full: "2026. 03. 14. 토요일",
        year: "2026", month: "03", day: "14",
        weekDay: "토요일",
        time: "오후 2시",
        iso: "2026-03-14T14:00:00",        // 감사 화면 D+n 기준
        firstMeet: "2020-03-31T00:00:00"   // 첫 만남 D+n 기준
    },
    location: {
        name: "구미 토미스퀘어가든",
        hall: "4층 스퀘어가든 홀",
        address: "경상북도 구미시 인동35길 46, 4층",
        addressShort: "경상북도 구미시 인동35길 46",
        tel: "054-473-6799",
        coordinates: { lat: 36.097854, lng: 128.435753 }
    },
    // ...
};
```

이어서 이런 항목이 있습니다.

- `transport` — 자가용 내비 검색어, 주차 안내, 버스 노선, KTX 역에서 오는 방법
- `interviews` — 인터뷰 Q&A. 문항 수는 자유입니다. 한 문항에 `groom`/`bride`를 따로 쓰면 두 사람 답변이 나뉘고, `answer` 하나만 쓰면 공동 답변으로 표시됩니다
- `greeting` — 오프닝 타이핑 문구, 초대 인사말, 마지막 감사 문구
- `footer` — 하단 크레딧

인사말은 꼭 두 분 말로 바꾸세요. 제가 쓴 벚꽃·바람·눈 이야기는 저희 얘기지 두 분 얘기가 아닙니다. 하객들은 그 부분을 생각보다 꼼꼼히 읽습니다.

### 지도 좌표

`config/site.ts`의 `location.coordinates` 한 곳만 고치면 네이버 지도 핀, 카카오맵 링크, 티맵 목적지가 같이 따라옵니다.

```ts
coordinates: { lat: 36.097854, lng: 128.435753 }
```

네이버 지도에서 식장을 검색하고 마커를 우클릭하면 위도·경도가 나옵니다.

지도에 뜨는 상호명은 `config/ui-text.ts`의 `location.venueTitle`이고, 말풍선 안 이름·주소·전화번호는 `config/site.ts`의 `location.name`·`addressShort`·`tel`에서 옵니다. 두 파일을 같이 맞춰야 합니다.

배포 후 폰으로 네이버·카카오·티맵 버튼을 하나씩 눌러 확인하세요. 여기가 틀리면 하객이 엉뚱한 데로 갑니다.

### 화면 문구 — `config/ui-text.ts`

버튼 이름, 섹션 제목, 안내 문구, 에러 메시지가 전부 여기 있습니다. `"참석 의사 체크하기"`를 `"오실 수 있나요?"`로 바꾸고 싶다면 이 파일만 고치면 됩니다.

말투를 통째로 바꿔도 됩니다. 저는 정중한 쪽으로 썼지만 친구들끼리 편하게 하는 결혼식이면 반말체가 더 어울릴 수도 있습니다.

### 사진 넣기

이미지는 저장소에 넣지 않고 외부 호스팅을 씁니다. 사진 열댓 장이 git에 들어가면 저장소가 무거워지고 무료 플랜 대역폭도 아깝습니다. `.gitignore`에 `images/`가 걸려 있는 것도 그래서입니다.

[Cloudinary](https://cloudinary.com) 무료 플랜이면 청첩장 정도는 넉넉합니다. 가입 → Media Library에 업로드 → 각 이미지 URL 복사 순서입니다. imgur나 S3, Supabase Storage도 상관없습니다.

URL을 받으셨으면 `config/images.ts`를 채웁니다. 키 이름만 봐서는 그 사진이 어느 화면에 붙는지 안 보입니다.

| 키 | 어디에 쓰이나 |
|----|--------------|
| `wedding-100` | **첫 화면(히어로) 배경 + 감사 화면 배경** |
| `wedding-01` ~ `wedding-15` | 갤러리, 순서대로 |
| `wedding-98` | 인터뷰 섹션 — 신부 사진 |
| `wedding-99` | 인터뷰 섹션 — 신랑 사진 |
| `wedding-81` | 마지막 마무리 화면 배경 |
| `share` | 카카오 공유 버튼의 썸네일 |
| `navermap` `kakaonav` `tmap` | 길찾기 버튼 아이콘 |
| `webank` `ibkbank` `kakaobank` | 은행 로고 |

첫 화면 대표 사진이 `wedding-01`이 아니라 `wedding-100`입니다. 여기서 많이 틀립니다. `wedding-101`은 어디에도 안 쓰이니 신경 안 쓰셔도 됩니다.

갤러리 15장을 다 채우실 필요는 없습니다. 줄이시려면 **두 곳을 같이** 고쳐야 합니다. `components/Gallery.tsx`의 `imageNames` 배열과 `lib/image-loader.ts`의 프리로더 목록에 같은 15개가 중복으로 박혀 있어서, 한쪽만 줄이면 시작할 때마다 콘솔에 `Image with name "wedding-13" not found` 경고가 뜹니다.

세로 사진(3:4)이 폰 화면에 제일 잘 맞습니다. 원본 그대로 올리면 무거우니 Cloudinary URL에 `/upload/f_auto,q_auto,w_1000/`을 끼워 넣으세요. 알아서 압축해줍니다.

은행 로고는 `components/Gift.tsx`의 `getBankIcon`이 **우리·기업·카카오 세 곳만** 매칭합니다. 국민이나 신한, 농협을 쓰시면 로고 자리가 빕니다. 12~17번 줄에 조건을 추가하고 `config/images.ts`에 로고 URL을 넣으세요.

지도 아이콘과 은행 로고는 제 Cloudinary에서 불러옵니다. 그대로 두셔도 동작합니다만 제 계정이 언제까지 살아 있을지는 장담 못 합니다. 본인 계정으로 옮겨두시는 게 안전합니다.

### 카카오톡 공유 카드 — 경로가 둘입니다

주소를 복사해 보내느냐, 청첩장 안의 공유 버튼을 누르느냐에 따라 미리보기가 서로 다른 데서 나옵니다.

**주소를 복사해서 붙여넣을 때** — `index.html`의 og 태그를 씁니다. **여기에도 제 도메인이 박혀 있습니다.**

```html
<!-- index.html:9-14 — 현재 상태 -->
<title>저희 결혼합니다</title>
<meta property="og:title" content="결혼식에 초대합니다">
<meta property="og:description" content="2026년 3월 14일 오후 2시 토미스퀘어가든 4층 스퀘어가든홀">
<meta property="og:image" content="https://wedding-gayul.netlify.app/images/wedding-02.jpg">   <!-- 제 사진 -->
<meta property="og:url" content="https://wedding-gayul.netlify.app">                            <!-- 제 주소 -->
```

`og:image`는 절대 URL이어야 합니다. Cloudinary URL을 그대로 넣으셔도 되고, 저장소에 넣고 싶으시면 `public/` 아래에 두세요 (`public/og.jpg` → `https://내-사이트.netlify.app/og.jpg`). `images/`는 gitignore돼 있어서 안 올라갑니다. 1200×630 정도면 안 잘리고 나옵니다.

**청첩장 안의 카카오 공유 버튼을 눌렀을 때** — og 태그를 안 씁니다. `config/images.ts`의 `'share'` 키를 씁니다.

```ts
'share': '/demo-images/hero.png',
```

절대 URL을 넣으면 그대로 쓰고, `/`로 시작하는 상대 경로면 배포 도메인을 앞에 붙여줍니다. 그래서 `public/` 아래 파일이든 Cloudinary URL이든 둘 다 됩니다.

제목과 설명은 `config/site.ts`와 `PRIVATE_` 환경변수에서 자동으로 조립되니 따로 손댈 필요 없습니다.

카카오톡은 미리보기를 한 번 캐시하면 오래 들고 있습니다. 바꿨는데 반영이 안 되면 [카카오 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 초기화하세요. 다만 **공유 버튼 쪽 이미지가 안 바뀌는 건 캐시 문제가 아니라 위의 61번 줄 문제**일 가능성이 높습니다.

---

## 7. 개인정보는 환경변수로

전화번호와 계좌번호를 소스에 박아두면 안 됩니다. 공개 저장소에 올리는 순간 검색에 걸립니다.

이름 앞에 뭐가 붙었는지를 보면 그 값이 어디까지 나가는지 알 수 있습니다.

| 접두사 | 어디서 쓰나 | 브라우저에 노출되나 |
|--------|------------|-------------------|
| `VITE_` | 브라우저 (Firebase, 지도, 카카오 키) | **노출됩니다.** 빌드 결과물에 그대로 들어갑니다 |
| `PRIVATE_` | 서버리스 함수 안에서만 | 노출되지 않습니다 |

이름·전화번호·계좌번호는 전부 `PRIVATE_`입니다. 브라우저가 `/api/private-info`를 호출해서 받아가고 소스에는 남지 않습니다.

`VITE_` 키는 어차피 노출되는 값입니다. 설계상 그런 것이라 막을 방법이 없고, 대신 각 서비스 콘솔에서 **도메인 제한**을 걸어 다른 사이트에서 못 쓰게 막습니다. 이 설정은 꼭 하세요.

### 서버리스 함수가 실제로 읽는 값

`netlify/functions/private-info.ts` 기준입니다. 하나라도 빠지면 그 자리에 기본값(`신랑`, `010-****-****`, `****************`)이 그대로 뜹니다.

```env
# 신랑
PRIVATE_GROOM_NAME=김민수
PRIVATE_GROOM_FIRST_NAME=민수          # 감사 화면용 (아래 설명 참고)
PRIVATE_GROOM_PHONE=010-1234-5678
PRIVATE_GROOM_MOTHER_NAME=이영희
PRIVATE_GROOM_MOTHER_PHONE=010-1111-2222

# 신부
PRIVATE_BRIDE_NAME=박지영
PRIVATE_BRIDE_FIRST_NAME=지영
PRIVATE_BRIDE_PHONE=010-9876-5432
PRIVATE_BRIDE_FATHER_NAME=박기둥
PRIVATE_BRIDE_FATHER_PHONE=010-3333-4444

# 계좌 — 신랑측 두 개, 신부측 한 개
PRIVATE_GROOM_MOTHER_BANK=우리은행
PRIVATE_GROOM_MOTHER_ACCOUNT=1234567890
PRIVATE_GROOM_BANK=기업은행
PRIVATE_GROOM_ACCOUNT=1234567890
PRIVATE_BRIDE_BANK=카카오뱅크
PRIVATE_BRIDE_ACCOUNT=1234567890
```

첫 화면에 크게 뜨는 이름은 `FIRST_NAME`이 아니라 `PRIVATE_GROOM_NAME` / `PRIVATE_BRIDE_NAME`입니다. 이 둘을 빠뜨리면 첫 화면부터 `신랑 💍 신부`입니다.

`FIRST_NAME`은 `components/ThankYou.tsx:147` 한 곳에서만 쓰이는데, 그 줄이 정적 기본값을 읽기 때문에 지금은 값을 넣어도 화면에 안 나옵니다. [5-(3)](#3-감사-화면-날짜--componentsthankyoutsx)을 같이 고쳐야 살아납니다.

### 브라우저용 값

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_KAKAO_API_KEY=
VITE_NAVER_MAP_CLIENT_ID=
VITE_TMAP_API_KEY=
```

`MEASUREMENT_ID`는 Analytics용이라 비워두셔도 Firestore는 잘 돕니다.

### 배포 후 환경변수 등록

**Netlify** — Site settings → Environment variables에 위 값을 전부 등록. 그다음 **Deploys → Trigger deploy → Clear cache and deploy site**로 다시 빌드해야 반영됩니다. `VITE_` 값은 빌드할 때 코드에 박히기 때문입니다.

**Vercel** — Settings → Environment Variables에 등록 후 재배포.

### CORS는 언제 문제가 되나

`ALLOWED_ORIGINS` 배열이 두 파일에 있습니다.

```ts
// netlify/functions/private-info.ts — 제 도메인 3개가 들어 있습니다
const ALLOWED_ORIGINS = [
    'https://wedding-gayul.netlify.app',
    'https://bong-yul-invitation.netlify.app',
    'https://wedding-flax-iota.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
];
```

**청첩장과 API가 같은 도메인이면 이 배열을 안 고쳐도 정상 동작합니다.** 같은 출처 요청에는 브라우저가 `Origin` 헤더를 안 붙이고 CORS 검사 자체가 일어나지 않습니다. 그러니 "이름이 안 뜬다"의 원인은 대부분 CORS가 아니라 환경변수 미등록이거나 재배포 누락입니다.

고쳐야 하는 경우는 Netlify와 Vercel을 둘 다 쓰면서 한쪽 API를 다른 쪽에서 부르는 식으로 도메인이 갈릴 때입니다. 어느 쪽이든 **제 도메인 세 개는 지우고 본인 것만 남기세요.**

---

## Firestore 보안 규칙

하객이 로그인 없이 글을 남기는 구조라 익명 읽기·쓰기를 열어둘 수밖에 없습니다. 대신 날짜로 유효기간을 겁니다.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 이 날짜가 지나면 전부 잠깁니다. 본인 일정으로 바꾸세요.
    function isOpen() {
      return request.time < timestamp.date(2026, 9, 30);
    }

    match /rsvp/{doc} {
      allow read, write: if isOpen();
    }
    match /guestbook/{doc} {
      allow read, write: if isOpen();
    }
    match /bodmin/{doc} {
      allow read: if isOpen();
      allow write: if false;      // 관리자 계정은 콘솔에서만
    }
  }
}
```

**읽기를 닫으면 안 됩니다.** 하객 화면이 직접 읽습니다. RSVP는 제출 전에 이름+번호로 중복 문서를 조회하고(`components/Rsvp.tsx:51`), 방명록은 목록 표시와 비밀번호 대조를 브라우저에서 합니다. 읽기 권한을 막으면 관리자 화면이 아니라 하객 화면이 먼저 깨집니다.

**만료일은 넉넉하게 잡으세요.** 예식 후 감사 화면에도 방명록이 그대로 붙어 있어서, 쓰기를 일찍 막으면 하객이 축하 글을 못 남기고 원인 모를 실패만 봅니다. 관리자 화면의 삭제 기능도 쓰기 권한을 씁니다.

### 알아두셔야 할 것

이 구조는 안전하지 않습니다.

`read`가 열려 있는 동안 브라우저 콘솔에서 문서를 읽는 것만으로 **하객 실명과 휴대전화번호 전체, 참석 여부, 방명록 비밀번호가 다 보입니다.** 방명록 비밀번호는 Firestore에 평문으로 저장되고 브라우저가 문자열 비교로 대조합니다. 관리자 비밀번호도 같은 방식입니다. `write`가 열려 있으니 남의 방명록 글을 수정하거나 지우는 것도 막지 못합니다.

청첩장 수명이 두어 달이라 저는 이 정도로 타협했습니다. 마음에 걸리시면 선택지가 있습니다.

- 조회를 전부 서버리스 함수로 옮기고 Firestore 읽기 권한을 닫으세요. 다만 RSVP 중복 확인까지 같이 옮겨야 합니다. 하객 화면도 읽기를 씁니다
- 관리자 페이지를 안 쓰고 Firebase 콘솔에서 직접 보세요. 확인은 어차피 하루 한 번이면 됩니다
- 예식이 끝나면 컬렉션을 통째로 지우세요. 제일 확실합니다

### 컬렉션 구조

| 컬렉션 | 용도 | 필드 |
|--------|------|------|
| `rsvp` | 참석 의사 | `guest`, `guest_name`, `guest_phone`, `visited`, `adult_count`, `child_count`, `timestamp` |
| `guestbook` | 방명록 | `name`, `password`, `message`, `createdAt` |
| `bodmin` | 관리자 계정 | `id`, `pwd` (문서 ID는 `admin` 고정) |

---

## 관리자 화면

주소 뒤에 `?admin=true`를 붙이면 하객 응답을 볼 수 있습니다.

```
https://내-사이트.netlify.app?admin=true
```

쓰기 전에 Firebase 콘솔에서 계정을 만들어두세요.

1. Firestore Database → 컬렉션 시작
2. 컬렉션 ID `bodmin`, 문서 ID `admin`
3. 필드 두 개: `id`(문자열), `pwd`(문자열)

RSVP 목록과 방명록 관리 탭이 있고, 각각 삭제가 됩니다. 로그인 상태는 `localStorage`에 저장되니 매번 다시 칠 필요는 없습니다.

앞서 말씀드린 대로 간이 인증입니다. **다른 데서 쓰는 비밀번호는 쓰지 마세요.**

---

## 발송 전 점검

카톡으로 링크를 보내고 나면 되돌리기 어렵습니다. 도메인도, 캐시된 썸네일도, 잘못 안내된 식장 위치도요. 폰으로 한 번 훑으세요.

**첫 화면**
- [ ] 대표 사진이 내 사진인가 (`wedding-100`)
- [ ] 이름이 `신랑 💍 신부`가 아닌가
- [ ] 오프닝 타이핑 문구가 내 문구인가

**본문**
- [ ] 인사말이 내 글인가
- [ ] 인터뷰 답변이 내 답변인가
- [ ] 갤러리 사진이 다 뜨는가 (깨진 칸 없이)
- [ ] 연락처 모달의 번호가 맞는가 — 실제로 걸어보세요
- [ ] 계좌번호 복사가 되는가, 은행 로고가 뜨는가
- [ ] 참석 의사를 실제로 제출해보고 Firebase 콘솔에서 확인

**지도**
- [ ] 지도에 핀이 우리 식장에 있는가
- [ ] 네이버 / 카카오 / 티맵 버튼을 각각 눌러 목적지 확인
- [ ] 주소 복사 버튼

**공유**
- [ ] 카카오 공유 버튼 → 나한테 보내보고 썸네일과 문구 확인
- [ ] 주소를 복사해서 따로 보내보고 미리보기 확인 (경로가 다릅니다)

**마무리**
- [ ] 오른쪽 아래 데모 토글 버튼이 사라졌는가
- [ ] `ALLOWED_ORIGINS`에서 내 도메인 외 제거
- [ ] `Location.tsx`의 fallback 키 제거
- [ ] `index.html`의 `og:image` / `og:url`을 내 것으로 교체
- [ ] 예식 후 감사 화면 날짜가 내 날짜인가

마지막으로 **친구 한 명에게 먼저 보내보세요.** 본인 폰에서는 캐시 때문에 멀쩡해 보이는 게 남의 폰에서 깨집니다.

---

## 자주 막히는 곳

**지도가 안 뜹니다**
네이버 클라우드 플랫폼에 도메인을 등록하셨는지 보세요. 새 콘솔에서 발급받으셨다면 `Location.tsx:35`의 파라미터를 `ncpKeyId`로 바꿔야 합니다. 브라우저 콘솔에 `[Naver Map] Loading with Client ID:` 로그가 찍히니 어떤 키를 쓰는지 바로 보입니다.

**카카오 공유 버튼이 무반응입니다**
`VITE_KAKAO_API_KEY`가 없는 경우입니다. 키는 있는데 "공유 중 오류가 발생했습니다" 알림이 뜨면 도메인 미등록이거나 카카오 링크가 비활성 상태입니다.

**공유 카드에 남의 사진이 나옵니다**
경로가 둘이라 양쪽을 다 봐야 합니다. 앱 안의 공유 버튼이면 `config/images.ts`의 `'share'` 키, 주소를 붙여넣은 거면 `index.html`의 `og:image`입니다. 캐시 문제가 아닙니다.

**주소 붙여넣기 미리보기가 예전 정보입니다**
이건 캐시가 맞습니다. [카카오 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 초기화하세요.

**참석 의사가 저장이 안 됩니다**
Firestore 규칙과 `VITE_FIREBASE_*`를 확인하세요. 규칙 편집기에서 저장 버튼을 안 누르고 나오는 경우가 은근히 많습니다.

**이름이 계속 `신랑`, `신부`로 나옵니다**
`PRIVATE_` 환경변수가 배포 플랫폼에 등록됐는지, 환경변수 추가 후 재배포했는지, `usePrivateInfo.ts`가 아직 더미를 반환하고 있진 않은지 보세요. 감사 화면만 안 바뀐다면 [5-(3)](#3-감사-화면-날짜--componentsthankyoutsx)의 정적 import 문제입니다.

**로컬에서만 이름이 안 뜹니다**
`npm run dev`에는 `/api` 프록시가 없습니다. `netlify dev`를 쓰시거나 개발 모드 분기를 두세요.

**방명록에 낯선 사람 글이 세 개 있습니다**
데모 데이터입니다. [5-(2)](#2-방명록--componentsguestbooktsx)를 보세요.

**갤러리 사진 자리가 비어 있습니다**
`config/images.ts`에서 키를 빠뜨렸을 가능성이 큽니다. 콘솔에 `Image with name "..." not found in config/images.ts` 경고가 뜹니다.

**Netlify 빌드가 secrets scanning에서 멈춥니다**
`netlify.toml`의 `SECRETS_SCAN_OMIT_KEYS`에 키 이름을 추가하세요. `VITE_` 값은 원래 브라우저에 노출되는 게 정상이라 스캔에서 빼는 게 맞습니다.

---

## 알려진 문제

고칠 시간이 없었던 것들입니다. 고쳐서 PR 주시면 반영하겠습니다.

- **데이터 소스가 두 갈래입니다** — 8개 컴포넌트가 Context 대신 `data/content.ts`의 정적 `weddingData`를 import합니다. 그래서 감사 화면 등에는 API로 받아온 이름이 반영되지 않습니다
- **카카오톡 인앱 브라우저 안내창이 죽어 있습니다** — `App.tsx`에 모달 UI는 있지만 `setShowBrowserPrompt(true)`를 부르는 곳이 없습니다. 인앱 브라우저를 감지하는 코드도 없고요. 살리시려면 `navigator.userAgent`에 `KAKAOTALK`이 있는지 검사하는 `useEffect`를 넣으면 됩니다
- **`index.html`에 importmap 잔재가 있습니다** — React 18과 Firebase 10을 가리키는 importmap이 남아 있습니다. Vite가 번들링하므로 실제로는 안 쓰이지만 코드를 읽을 때 헷갈립니다
- **은행 로고가 세 곳뿐입니다** — `Gift.tsx`의 `getBankIcon`
- **`index.html`의 og 태그는 여전히 수동입니다** — 정적 HTML이라 `config/`를 읽을 수 없습니다. 직접 고치셔야 합니다

---

## 프로젝트 구조

```
.
├── App.tsx                     # 화면 전환, 스크롤·터치·드래그 처리
├── index.html                  # 폰트, og 태그, 카카오 SDK
├── components/
│   ├── OpeningSequence.tsx     # 타이핑 인트로
│   ├── Hero.tsx                # 첫 화면
│   ├── MainContent.tsx         # 아래 섹션들을 순서대로 배치
│   ├── Intro.tsx               # 인사말 + 연락처 모달
│   ├── Rsvp.tsx                # 참석 의사
│   ├── Profiles.tsx            # 인터뷰 Q&A
│   ├── Gallery.tsx             # 사진첩
│   ├── Location.tsx            # 지도, 길찾기, 교통편
│   ├── Gift.tsx                # 계좌
│   ├── Guestbook.tsx           # 방명록 (현재 데모 모드)
│   ├── Closing.tsx             # 마무리
│   ├── ThankYou.tsx            # 예식 후 감사 화면
│   ├── ShareButton.tsx         # 카카오 공유
│   ├── ForsythiaParticles.tsx  # 꽃잎 배경
│   └── Admin/                  # 관리자 화면
├── config/
│   ├── site.ts                 # ← 결혼식 정보. 여기부터 고치세요
│   ├── ui-text.ts              # ← 화면 문구
│   └── images.ts               # ← 사진 URL
├── data/content.ts             # config를 합쳐 컴포넌트에 넘김
├── hooks/
│   ├── usePrivateInfo.ts       # 민감정보 로드 (현재 데모 모드)
│   ├── useWeddingData.tsx      # 전역 데이터 Context
│   └── useModalBackHandler.ts  # 뒤로가기·ESC로 모달 닫기
├── lib/
│   ├── firebase.ts
│   └── image-loader.ts
├── netlify/functions/private-info.ts
├── api/private-info.ts
└── public/demo-images/         # 데모용 AI 일러스트
```

**기술 스택** — React 19 / TypeScript / Vite 6 / Framer Motion 12 / Firebase Firestore / Tailwind (CDN)

---

## 사용 범위와 라이선스

전문은 [`LICENSE`](LICENSE)에 있습니다. **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.ko)** 에 아래 조건을 더한 형태입니다.

### 이렇게 쓰셔도 됩니다

- 본인이나 가족·친구의 결혼식 청첩장으로 사용
- 돌잔치, 회갑연, 집들이 같은 다른 개인 행사로 변형
- Fork해서 마음대로 뜯어고치기
- 코드를 읽고 공부하기, 일부를 가져다 본인 프로젝트에 쓰기
- 포트폴리오에 이 오픈소스를 참고했다고 밝히고 올리기

### 이건 안 됩니다

- **재배포** — 이 코드를 본인 것처럼 다른 저장소나 템플릿 마켓에 올리는 것. 유료든 무료든 마찬가지입니다
- **상업적 이용** — 청첩장 제작을 돈 받고 대행하거나, 이 코드를 기반으로 유료 서비스를 만드는 것
- **출처 삭제** — 하단 크레딧(`config/site.ts`의 `footer.name`)을 지우는 것

크레딧은 화면 맨 아래에 작게 한 줄 들어갑니다. 하객 중에 그걸 눈여겨보는 사람은 없습니다. 남겨주시면 감사하겠습니다.

애매한 게 있으면 [이슈](https://github.com/gayulz/wedding/issues)로 물어보세요. 개인 행사에 쓰시는 거면 웬만하면 다 괜찮다고 답할 겁니다.

---

## Star와 Fork

도움이 되셨다면 **Star** 하나 부탁드립니다.

별이 늘어도 제가 얻는 건 없습니다. 다만 검색에서 조금 위로 올라가고, 그러면 다음에 청첩장을 직접 만들어보려는 사람이 이 저장소를 발견합니다. 업체 견적 보고 한숨 쉬다가 "직접 만들어볼까" 하고 검색해본 사람이라면 아마 저와 비슷한 처지일 겁니다.

**Fork도 부담 없이 하세요.** 원본을 어지럽히는 게 아닐까 걱정하실 필요 없습니다. Fork는 원래 그러라고 있는 기능이고, 저장소 주인 입장에서는 누군가 실제로 써보고 있다는 신호라 반가운 쪽입니다.

Fork하신 뒤에 이런 걸 해보셔도 좋겠습니다.

- 색과 폰트를 두 분 결혼식 콘셉트에 맞게 갈아엎기
- 섹션 순서를 바꾸거나 안 쓰는 섹션을 통째로 들어내기
- 예식 당일 실시간 사진 업로드, 축의금 정리, 하객 좌석 안내 같은 걸 새로 붙이기
- 청첩장 말고 다른 초대장으로 개조하기
- 위 [알려진 문제](#알려진-문제) 중 하나 고치기

괜찮은 게 나오면 이슈나 PR로 알려주세요. 반영할 만한 건 반영하겠습니다. "이 부분 설명이 부족하다"는 제보도 환영입니다. 만든 사람은 뭘 모르는지를 잘 모릅니다.

---

## 문의

- 버그나 질문 — [Issues](https://github.com/gayulz/wedding/issues)
- 메일 — gayulz@kakao.com

결혼 준비하시는 분이라면, 몸 상하지 않게 하세요. 청첩장은 그중 제일 쉬운 축에 듭니다.
