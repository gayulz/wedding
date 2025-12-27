import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import Script from 'next/script'

import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '최봉석 ♥ 김가율 모바일 청첩장',
  description: '따뜻한 사랑으로 채워나갈 저희의 새 시작에 오셔서 축복해 주세요.',
  openGraph: {
    title: '최봉석 ♥ 김가율 결혼식에 초대합니다',
    description: '따뜻한 사랑으로 채워나갈 저희의 새 시작에 오셔서 축복해 주세요.',
    images: [
      {
        url: 'https://bong-yul-invitation.netlify.app/images/wedding-10.jpeg',
        width: 1200,
        height: 630,
        alt: '저희 💍 결혼해요 💒',
      },
    ],
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const CherryBlossomEffect = () => (
  <div className="cherry-blossom-container">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="petal"></div>
    ))}
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistMono.variable}`}>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script id="kakao-init" strategy="afterInteractive">
          {`
            if (window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init('e967473bf6ff429f49cea2f45e1fa4c0');
            }
          `}
        </Script>
        <CherryBlossomEffect />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
