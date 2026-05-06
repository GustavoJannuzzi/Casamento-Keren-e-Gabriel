'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import CountdownTimer from './CountdownTimer'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Efeito parallax na foto e no texto
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
    >
      {/* ── Coluna da foto (parallax) ── */}
      <div className="relative h-[55vh] lg:h-screen overflow-hidden bg-ink-light">
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-0 scale-110"
        >
          <Image
            src="/images/noivos-principal.jpeg"
            alt="Keren e Gabriel"
            fill
            className="object-cover object-top"
            priority
          />
          {/* overlay gradiente suave — escurece levemente e faz transição para o lado do texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream/60 lg:to-cream/80 hidden lg:block" />
        </motion.div>

        {/* Data flutuante na foto (mobile) */}
        <div className="absolute bottom-6 left-6 lg:hidden">
          <p className="font-body text-xs tracking-editorial uppercase text-cream/80">
            14 · Março · 2027
          </p>
        </div>
      </div>

      {/* ── Coluna do texto ── */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-0 bg-cream relative">
        <motion.div
          style={{ y: textY, opacity }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-lg"
        >
          {/* Eyebrow */}
          <motion.p variants={itemVariants} className="page-eyebrow mb-6">
            Venha comemorar o nosso casamento
          </motion.p>

          {/* Linha decorativa */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-warm-line mb-8"
          />

          {/* Nome — split animado */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              variants={itemVariants}
              className="font-heading font-light text-ink leading-none"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', letterSpacing: '-0.03em' }}
            >
              Keren
            </motion.h1>
          </div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 my-3">
            <span className="flex-1 h-px bg-warm-line" />
            <span className="font-heading text-2xl text-terracotta font-light italic">e</span>
            <span className="flex-1 h-px bg-warm-line" />
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              variants={itemVariants}
              className="font-heading font-light text-ink leading-none"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', letterSpacing: '-0.03em' }}
            >
              Gabriel
            </motion.h1>
          </div>

          {/* Data + local — desktop */}
          <motion.div variants={itemVariants} className="mb-10 hidden lg:block">
            <div className="grid grid-cols-2 gap-6 border-t border-b border-warm-line py-5">
              <div>
                <p className="font-body text-xs tracking-editorial uppercase text-warm-gray mb-1">
                  Cerimônia
                </p>
                <p className="font-heading text-lg text-ink">16h00</p>
                <p className="font-body text-xs text-warm-gray mt-0.5">Sábado, 14 de março</p>
              </div>
              <div>
                <p className="font-body text-xs tracking-editorial uppercase text-warm-gray mb-1">
                  Recepção
                </p>
                <p className="font-heading text-lg text-ink">18h00</p>
                <p className="font-body text-xs text-warm-gray mt-0.5">Curitiba — Paraná</p>
              </div>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={itemVariants} className="mb-10">
            <p className="font-body text-xs tracking-editorial uppercase text-warm-gray mb-4">
              Faltam
            </p>
            <CountdownTimer />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <Link href="/confirmar-presenca" className="btn-primary text-center justify-center">
              Confirmar Presença
            </Link>
            <Link href="/presentes" className="btn-outline text-center justify-center">
              Lista de Presentes
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 left-8 md:left-16 lg:left-20 hidden lg:flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8 bg-warm-line"
          />
          <p className="font-body text-xs tracking-editorial uppercase text-warm-gray">
            Role para baixo
          </p>
        </motion.div>
      </div>
    </section>
  )
}
