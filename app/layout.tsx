import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '최봉석 ♥ 김가율 모바일 청첩장',
  description: '따뜻한 사랑으로 채워나갈 저희의 새 시작에 오셔서 축복해 주세요.',
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
      <CherryBlossomEffect />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
