import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Casamento Keren & Gabriel | 14 de Março de 2027',
  description: 'Celebre conosco o dia mais especial da nossa vida. Keren & Gabriel, 14 de março de 2027, Curitiba-PR.',
  keywords: ['casamento', 'Keren', 'Gabriel', 'Curitiba', '2027'],
  openGraph: {
    title: 'Casamento Keren & Gabriel',
    description: 'Junte-se a nós para celebrar nosso casamento em 14 de março de 2027.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${lato.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
