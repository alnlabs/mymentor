import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/shared/components/AuthContext'
import { AuthRedirect } from '@/shared/components/AuthRedirect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Technical Interview Prep',
  description: 'Practice coding problems and MCQ questions for technical interviews',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
