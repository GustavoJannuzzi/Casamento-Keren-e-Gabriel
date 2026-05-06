'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface PageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-16 md:mb-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="page-eyebrow text-center mb-4"
      >
        {eyebrow}
      </motion.p>

      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: '100%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-light text-ink text-center leading-none"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}
        >
          {title}
        </motion.h1>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center' }}
        className="w-12 h-px bg-terracotta mx-auto mt-5"
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-body text-sm text-warm-gray text-center max-w-xl mx-auto mt-5 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
