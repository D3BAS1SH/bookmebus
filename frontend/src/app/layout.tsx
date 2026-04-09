import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import { Providers } from '@/lib/providers'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
})

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'BookMeBus | Real-time Bus Tracking & Booking',
  description: 'Book tickets and track your bus in real-time with BookMeBus.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


