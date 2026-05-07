'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const events = [
  { year: '2019', title: 'O Destino nos uniu',         body: 'Em uma festa de amigos em comum em Curitiba, dois sorrisos se cruzaram pela primeira vez. Ninguém sabia ainda, mas aquele seria o início de uma história linda.' },
  { year: '2020', title: 'O Primeiro Encontro',        body: 'Uma mensagem no celular, um convite para um café. Sentados frente a frente numa tarde chuvosa de Curitiba, descobrimos que o tempo voa quando estamos com a pessoa certa.' },
  { year: '2021', title: 'A Primeira Viagem',          body: 'Florianópolis foi a nossa primeira aventura juntos. As praias, o pôr do sol e muitas risadas nos mostraram que viajar ao lado um do outro era o que queríamos para sempre.' },
  { year: '2022', title: 'Oficialmente Namorados',     body: 'Gabriel esperou o momento perfeito. Com flores e um olhar cheio de amor, tornamos nossa história oficial.' },
  { year: '2024', title: 'O Noivado em Buenos Aires',  body: 'Em uma noite inesquecível, Gabriel surpreendeu Keren com uma proposta que tirou o fôlego. A resposta já estava escrita nas estrelas.', photo: '/images/pedido de casamento.jpeg' },
  { year: '2027', title: 'O Grande Dia',               body: 'E agora chegou o momento mais esperado: dizer sim diante de todos que amamos. Keren e Gabriel, para sempre unidos.' },
]

function ProposalPhoto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div ref={ref} className="overflow-hidden border border-warm-line mt-5">
      <motion.div style={{ y }} className="relative h-64 scale-110">
        <Image
          src="/images/pedido de casamento.jpeg"
          alt="O pedido de casamento em Buenos Aires"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
        {/* overlay leve para não competir com o card */}
        <div className="absolute inset-0 bg-ink/10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
      </motion.div>
    </div>
  )
}

function TimelineItem({ event, index }: { event: typeof events[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className={`relative grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-start mb-12 md:mb-0 ${!isLeft ? 'md:[direction:rtl]' : ''}`}>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="[direction:ltr] bg-white border border-warm-line p-8 group hover:border-warm-gray transition-colors duration-300"
      >
        <p className="page-eyebrow mb-3">{event.year}</p>
        <h3 className="font-heading text-2xl md:text-3xl text-ink font-light mb-3 leading-tight">
          {event.title}
        </h3>
        <p className="font-body text-sm text-warm-gray leading-relaxed">{event.body}</p>

        {/* Foto do noivado dentro do card */}
        {event.photo && <ProposalPhoto />}
      </motion.div>

      {/* Spacer (linha do tempo) */}
      <div className="hidden md:flex flex-col items-center pt-8 [direction:ltr]">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-3 h-3 bg-terracotta rounded-full flex-shrink-0"
        />
        {index < events.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ transformOrigin: 'top' }}
            className="w-px flex-1 bg-warm-line mt-2 min-h-[80px]"
          />
        )}
      </div>
    </div>
  )
}

export default function Timeline() {
  return (
    <div className="relative">
      {/* Linha central — mobile */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-warm-line md:hidden" />

      <div className="space-y-0 pl-10 md:pl-0">
        {events.map((event, i) => (
          <TimelineItem key={event.year} event={event} index={i} />
        ))}
      </div>
    </div>
  )
}
