import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import Chatbot from '@/components/Chatbot'

export const metadata: Metadata = {
  title: 'Career Compass',
  description: 'AI-Based Career Exploration and Scholarship Recommendation System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-gray-200 z-50 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Career Compass
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/register" className="text-gray-700 hover:text-primary transition font-medium">
                  Register
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary transition font-medium">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  )
}
