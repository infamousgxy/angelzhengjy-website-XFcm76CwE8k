import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AngelZhengJY - 愿每一份美好都被真诚对待',
  description: '探索AngelZhengJY的丝巾艺术世界，每一条丝巾都是一个温柔的拥抱，一个色彩的疗愈故事。',
  generator: 'Angelzhengjy',
  applicationName: 'AngelZhengJY',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
