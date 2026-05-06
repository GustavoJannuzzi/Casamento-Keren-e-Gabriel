'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function PhotoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const textY = useTransform(scrollYProgress, [0.2, 0.8], ['20px', '-20px'])

  return (
    <section ref={ref} className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Foto com parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Image
          src="/images/noivos.jpeg"
          alt="Keren e Gabriel"
          fill
          className="object-cover object-center"
        />
        {/* overlay escuro para legibilidade */}
        <div className="absolute inset-0 bg-ink/40" />
      </motion.div>

      {/* Texto central com fade + float */}
      <motion.div
        style={{ opacity, y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        {/* linha decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'center' }}
          className="w-16 h-px bg-cream/60 mb-8"
        />

        <p className="font-heading font-light text-cream leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          &ldquo;Duas almas que se encontraram<br className="hidden md:block" /> para nunca mais se perder.&rdquo;
        </p>

        <div className="w-16 h-px bg-cream/60 mt-2" />

        <p className="font-body text-[11px] tracking-editorial uppercase text-cream/60 mt-6">
          Keren & Gabriel — 14 · Março · 2027
        </p>
      </motion.div>
    </section>
  )
}
