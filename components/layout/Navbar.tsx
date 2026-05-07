'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const links = [
  { href: '/nossa-historia', label: 'Nossa História' },
  { href: '/detalhes', label: 'Detalhes' },
  { href: '/padrinhos', label: 'Padrinhos' },
  { href: '/presentes', label: 'Presentes' },
  { href: '/recados', label: 'Recados' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-700',
        scrolled
          ? 'bg-cream/95 backdrop-blur-sm border-b border-warm-line/50 py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-3 items-center">

        {/* Left links — desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.slice(0, 2).map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href} label={label} />
          ))}
        </nav>

        {/* Center — monogram */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="font-heading text-ink tracking-tight hover:text-ink-light transition-colors whitespace-nowrap"
            style={{ fontSize: 'clamp(15px, 4.2vw, 22px)' }}
          >
            Keren <span className="font-light text-terracotta">&</span> Gabriel
          </Link>
        </div>

        {/* Right links — desktop */}
        <nav className="hidden lg:flex items-center justify-end gap-8">
          {links.slice(2).map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href} label={label} />
          ))}
          <Link
            href="/confirmar-presenca"
            className="btn-outline text-[10px] py-2.5 px-5"
          >
            RSVP
          </Link>
        </nav>

        {/* Mobile: burger */}
        <div className="lg:hidden flex justify-end col-start-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 flex flex-col gap-1.5 group"
            aria-label="Menu"
          >
            <span className={cn(
              'block w-6 h-px bg-ink transition-all duration-300',
              menuOpen && 'rotate-45 translate-y-[5px]'
            )} />
            <span className={cn(
              'block w-4 h-px bg-ink transition-all duration-300',
              menuOpen && 'opacity-0 w-0'
            )} />
            <span className={cn(
              'block w-6 h-px bg-ink transition-all duration-300',
              menuOpen && '-rotate-45 -translate-y-[5px]'
            )} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-cream/98 backdrop-blur-sm border-t border-warm-line/40 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-8 gap-6">
              {[...links, { href: '/confirmar-presenca', label: 'Confirmar Presença' }].map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      'font-heading text-2xl font-light block transition-colors',
                      pathname === href ? 'text-terracotta' : 'text-ink hover:text-terracotta'
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'relative font-body text-xs tracking-editorial uppercase pb-0.5 transition-colors group',
        active ? 'text-ink' : 'text-warm-gray hover:text-ink'
      )}
    >
      {label}
      <span className={cn(
        'absolute bottom-0 left-0 h-px bg-ink transition-all duration-300',
        active ? 'w-full' : 'w-0 group-hover:w-full'
      )} />
    </Link>
  )
}
