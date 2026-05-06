'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface ThankYouProps {
  nome: string
  confirmado: boolean
  onReset: () => void
}

export default function ThankYou({ nome, confirmado, onReset }: ThankYouProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-16 px-4 border border-warm-line bg-white"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="page-eyebrow mb-6"
      >
        {confirmado ? 'Confirmação recebida' : 'Resposta registrada'}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-heading text-4xl md:text-5xl text-ink font-light mb-4"
      >
        {confirmado ? `Que alegria, ${nome}!` : 'Sentiremos sua falta'}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ transformOrigin: 'center' }}
        className="w-12 h-px bg-terracotta mx-auto mb-6"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="font-body text-sm text-warm-gray max-w-sm mx-auto leading-relaxed mb-10"
      >
        {confirmado
          ? 'Ficamos muito felizes em saber que você estará com a gente neste dia tão especial! Mal podemos esperar para celebrar juntos.'
          : `Olá, ${nome}. Entendemos e sentiremos muito sua falta. Estaremos pensando em você com muito carinho neste dia tão especial.`
        }
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/presentes">
          <Button variant="primary" size="sm">Ver Lista de Presentes</Button>
        </Link>
        <Link href="/recados">
          <Button variant="outline" size="sm">Deixar um Recado</Button>
        </Link>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onReset}
        className="mt-8 font-body text-[10px] tracking-editorial uppercase text-warm-muted hover:text-warm-gray transition-colors block mx-auto"
      >
        Enviar outra confirmação
      </motion.button>
    </motion.div>
  )
}
