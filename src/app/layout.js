import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Galeria.',
  description: 'Galeria - Discover greatness',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
