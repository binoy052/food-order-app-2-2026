import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'GourmetBite | Premium Food Order',
  description: 'Premium Food Ordering Experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar container">
          <Link href="/" className="navbar-brand">GourmetBite</Link>
          <div className="nav-links">
            <Link href="/">Menu</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
